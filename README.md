# Sample

```javascript 
// create a bot
paulbot = bot().botName("paulbot");
// initialize
paulbot();
// do some things, load a "script" for the bot to follow
paulbot.show().goTo([300,300]).script(botScripts.welcome);

// load different scripts when you click buttons
$('body').on('click', '.paulbot-prompt', function(e) {
	paulbot.show().script(botScripts[this.dataset.script]);
})
```

# bot api

It's a closure, you see, like a degenerate bastardized http://bost.ocks.org/mike/chart/. 

**bot()** — returns a bot

**bot()()** — initializes

bot.**botName**(*string*) — Getter/setter for #id, for multiple bots on one page.

bot.**jumpTo**(*[x,y] or selection*) — Teleport to coordinates.

bot.**goTo**(*[x,y] or selection*) — Smoothly go to.

bot.**show()**, bot.**hide()** — Shows/hides in place. Could have some randomized entrance/exit animation.

bot.**pulse()** — Desperate for attention, just does some "hey look at me" animation.

bot.**click**(*selection*) — Fires a click event on the designated target

bot.**speak**(*string, [callback]*) — Animates typey-typing string. Callback when finished.

bot.**eval**(*string, [callback]*) — Animates typey-typing string, and then `eval()`s string. Callback when finished.

bot.**emote**(*string*) — Switches bot face to given emotion, currently either "default", "pray", or "amiga"

bot.**responses**(*array*) — Sets button prompts; a 'script' for the bot to follow is bound to every button. That script can in turn have more branching responses. So it's a nested tree.

bot.**script**(*object*) — Sets a 'script' (like for an actor) for the bot to follow. A script consists of a set of actions (speak, eval, do, emote[TK]), and branches for the user to follow. Every branch is just another script.

bot.**destroy**() — Destroys the bot in grand fashion. Currently just hides. ;)

# "Script" syntax

We need a better term than "script" because that just sounds like a generic javascript script. Anyway, you can pass the bot an object that defines actions for it to follow. This is **NOT JSON** — it's a JS object, and thus can contain real functions. It looks like this:

```javascript
var botScript =
{
  "prompt": null,
  "speak": "Hi, I'm Paulbot. Welcome to my Learninal! We will have fun today.",
  "do": null,
  "eval": null,
  "responses": [
    {
      "prompt": "Button Label 1",
      "speak": "Great! Hover over the black bar at the bottom and start coding.",
      "do": function() { paulbot.goTo(d3.select("strong")); },
      "responses": [ ... ]
    },
    ...
  ]
}
```
