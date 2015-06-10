### Build
```sh
npm install
npm install -g grunt-cli
```

So basically we have this bot object, which is a closure. It has a bunch of actions: show, goTo, speak, eval, emote, prompts, dialogue. Each of those returns a promise that's resolved when the action is finished or the user supplies some input. 

You can call those methods directly, but typically you'll pass a "dialogue" to the robot.dialogue method, which is an array of steps to follow. Each element of the array is an object specifying actions to be taken concurrently; each successive element is performed serially. This is not JSON — it's a JS object, and thus can contain real functions. It looks like this:

```javascript
var dialogueArray = [
  // first step
  { 
    // concurrently performed
    "methodName": value,
    "anotherMethod": function,
    ... 
  },
  // second step 
  ...
];
```

- Every method's argument is upcasted, so it can be either a value or a function.
- Every method returns a promise; every step is a set of promises; the bot goes to the next step when all promises have resolved.
- `bot.dialogue(dialogueArray)` returns a promise that resolves when all steps have resolved, so sub-dialogues can be included in any step. And since they're upcasted, you can pass it a function that dynamically returns a subdialogue.

# Sample script

```javascript
var dialogueArray = [
  {
    "speak": "Welcome!",
    "show": true,
    "goTo": [100,100]
  },
  {
    "eval": "alert('hi');",
  },
  {
    "prompts": [
      {
        "prompt": "OK",
        "dialogue": subDialogue //another dialogue
      },
      {
        "prompt": "No thanks",
        "dialogue": randDialogue //a function that returns a random dialogue
      },
      {
        "prompt": "Take me away",
        "link": "http://bloomberg.com/" //"Take me away" button will open bloomberg.com in new window
      },
      {
        "prompt": "Just continue" //this'll just flow through to the next step
      }
    ],
  },
  {
    "test": function(userInput) { return myName=='Toph'; } //this will listen for user code input until myName=='Toph' and then continue
  },
  {
    "speak": "Next we're gonna…"
  }
];
```

# bot api

bot.**goTo**(*[x,y] or selection*) — Smoothly animate the bot to that position.

bot.**show**(*bool*) — Shows/hides in place. Could have some randomized entrance/exit animation.

bot.**speak**(*string*) — Animates typey-typing string. Returns a promise that resolves when it's done speaking. Currently plaintext only, no html.

bot.**eval**(*string*) — Animates typey-typing string (TK gotta fix), and then `eval()`s string. Returns a promise that resolves after execution.

bot.**emote**(*string*) — Switches bot face to given emotion: ded, love, notimpressed, restface, troll, wiggle, wink.

bot.**test**(*function*) — Listens for event that fires every time user enters code; promise resolves when the function it's passed returns true. Test function is passed an object with the user's latest input and its evaluated value, like `{"command": "2+2", "result": 4}`.

bot.**prompts**(*array*) — Sets button prompts; pass it an array of prompts; resolves when user picks one. A single prompt object looks like this: `{"prompt": "Button label", "dialogue": [ ... ], "link": "http://..."}`. Both dialogue and link are optional; if not specified, clicking the button just continues the dialogue.

bot.**dialogue**(*array*) — Sets a set of steps for the bot to follow; see above.
