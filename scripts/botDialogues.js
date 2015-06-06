var botDialogues = {};

var myName = null,
    dogs;

var subDialogue = [
  { "emote": "love", "speak": "Subdialogue part 1..." },
  { "eval": "//Subdialogue part 2..." },
  { "speak": "Subdialogue part 3..." }
];



var dialogueShow = {
  "mode": "on",
  "emote": "restface"
}

var randText = function() {
  return _.sample([
    "OK, bye.",
    "Cool, thanks.",
    "That's all? Fine.",
    "Oh.",
    "Yeah OK.",
    "Sure pal.",
    "Whatever you say, Paulbot.",
    "Uh huh.",
    "Well. Sure.",
    "Mmmm yeah, see ya!"
    ]);
};

var randDialogue = function() {
  var dialogue = [];
  dialogue.push({"emote": "wiggle", "speak": randText()});
  dialogue.push({"speak": randText()});
  dialogue.push({"speak": randText()});
  return dialogue;
}

botDialogues.slider = [
  {
    "mode": "on",
    "speak": "LOOK AT THE SLIDER CHANGE THE BACKGROUND COLOR! TK TK TK"
  },
  {
    "slider": {
      "onbrush": function(value) {
        d3.select("body").style("background-color", d3.hsl(value, .8, .8));
        d3.select("aside").style("background-color", d3.hsl(value, .8, .8));
        return "document.getElementsByTagName('body')[0].style.backgroundColor = \"" + document.getElementsByTagName('body')[0].style.backgroundColor + "\"";
      },
      "domain": [0, 180]
    }
  },
  {
    "prompts": [{"prompt": "OK, how about font color?"}]
  },
  {
    "slider": {
      "onbrush": function(value) {
        d3.select("body").style("color", d3.hsl(value, .8, .2));
        return "document.getElementsByTagName('body')[0].style.backgroundColor = \"" + document.getElementsByTagName('body')[0].style.color + "\"";
      },
      "domain": [0,180]
    }
  },
  {
    "prompts": [{"prompt": "For God's sake, back to normal, please."}]
  },
  {
    "eval": "resetArticle();"
  }
];

botDialogues.exampleEventLogger = [
  {
    "mode": "on",
    "speak": "Interactions on a web page are driven by events. Events are 'fired', and code can 'listen' for when they happen, and act accordingly."
  },
  {
    "eval": 'logger(true);'
  },
  {
    "speak": "Move your mouse and hit keys and scroll and look at them all!",
    "prompts": [{"prompt": "OK."}]
  }
];

botDialogues.tutorialAdding = [
  {
    "mode": "on",
    "speak": "So obviously you know computers can do math:"
  },
  { "eval": "2+2" },
  { "speak": "Now you try."},
  {
    "test": function(item) {
      if(isNaN(item.result)) {
        this.speak("Sorry, that's not a number.");
      } else if(item.command.indexOf("+") === -1) {
        this.speak("Sorry, that's a number but there's no addition in there.");
      } else {
        return true;
      }
    }
  },
  { "speak": "Right, OK, easy enough. The weird thing is, in JavaScript, the symbol + means more than one thing: if you put it between strings, it 'concatenates' them, which just means it jams the letters together into one longer string:" },
  { "eval": '"mank" + "ind"'},
  { "speak": "Now you try."},
  {
    "test": function(item) {
      if(typeof item.result !== "string") {
        this.speak("Mmmm, doesn't look like you have a string there.")
        return false;
      } else if(item.command.indexOf("+") === -1) {
        this.speak("Doesn't look like you added anything there.")
        return false;
      } else {
        return true;
      }
    }
  },
{ "speak": "Great. Now, the REALLY weird thing is that these two uses of + can sometimes collide. First, easy math question: what's 4 + 20?"},
dialogueTest(function(item) { return item.result===24; }, "Nope. Simple question, just answer with a number: what's 4 + 20?"),
{ "speak": "Correct. But look at this:" },
{ "eval": '4+"20"'},
{ "speak": "WTF? Well, see the quotation marks around \"20\"? That means that it's being treated as a string here, which forces JavaScript to treat 4 as a string too and just jam 20 on the end. Try adding a string to a number:"},
dialogueTest(function(item) { return typeof item.result === "string" && item.command.indexOf("+") !== -1 }, "Nope. Just try something like: \"one\" + 1"),
{ "speak": "Weird, right? Worse, sometimes \"2\" is treated as a number:" },
{"eval": '"2" - 1'},
{"speak": "And sometimes as a string:"},
{"eval": '"2" + 1'},
{"wait": 1000},
{"speak": "Which you can get around with sneaky double negation addition:"},
{"eval": '"2" - -1'},
{ "speak": "And this is why programmers are angry." }
]

botDialogues.exampleRoulette = [
{
  "mode": "on",
  "speak": "Web pages are made up of different HTML 'elements'. Many of them have some semantic meaning: paragraphs, headers, lists. Others are just arbitrary containers of stuff, like divs and spans. These elements are styled according to rules written in CSS. Here, let's randomize the CSS rules being applied to the HTML elements on this page.",
  "prompts": [{"prompt": "OK..."}]
},
{
  "eval": roulette+' roulette();'
},
{
  "speak": "Cool, right?",
  "prompts": [
    {"prompt": "OK. Neat.", "dialogue": [{"mode": "off"}]},
    {"prompt": "Again! Again!!", "dialogue": function() { return botDialogues.exampleRoulette.slice(1); }},
    {"prompt": "Back to normal, please...", "dialogue": [{"mode": "off", }]}
  ]
}
];

botDialogues.exampleDestroy = [
{
  "mode": "on",
  "speak": "OK cool well now we'll just delete random things on the page.",
},
{
  "eval": 'destroyPage();',
  "prompts": [{"prompt": "Hey where's everything going?"}]
},
{
  "speak": "You're on your own. It's too late now.",
  "emote": "ded"
}
];



botDialogues.CLOSE = [
{"mode": "off"}
]

botTeases = {
  "events": {
    "message": "The browser is constantly firing events in response to mouse and keyboard actions. Try mashing keys!",
    "do": function() { logger(true); },
    "buttons": [
      {"text": "Learn more", "click": function() { paulbot.dialogue(botDialogues.tutorialDOM); }},
      {"text": "Stop it", "click": function() { logger(false); paulbot.mode("off"); }}
    ]
  },
  "adding": {
    "message": "Hey, what's the difference between 4+20 and 4+\"20\"?",
    "buttons": [
      {"text": "Learn more", "click": function() { paulbot.dialogue(botDialogues.tutorialAdding); }},
      {"text": "Sounds boring", "click": function() { paulbot.mode("off"); }}
    ]
  },
  "arrays": {
    "message": "Something something TK cool illustration of things happening on the page with arrays",
    "buttons": [
      {"text": "Learn more", "click": function() { paulbot.dialogue(botDialogues.tutorialArrays); }},
      {"text": "Sounds boring", "click": function() { paulbot.mode("off"); }}
    ]
  },
  "css": {
    "message": "Randomizing page styles...",
    "do": roulette,
    "buttons": [
      {"text": "Again!", "click": function() { roulette(); }},
      {"text": "Back to normal please", "click": function() { resetArticle(); paulbot.mode("off"); }}
    ]
  }
}
