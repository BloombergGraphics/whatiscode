var botDialogues = {};

var myName = null,
    dogs;

var subDialogue = [
  { "emote": "love", "speak": "Subdialogue part 1..." },
  { "eval": "//Subdialogue part 2..." },
  { "speak": "Subdialogue part 3..." }
];

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

botDialogues.adding = [
  {
    "show": true,
    "goTo": [100,100],
    "speak": "Computers can do math. Try adding two numbers, like this:"
  },
  {
    "eval": "2+2"
  },
  {
    "test": function(item) {
      if(isNaN(item.result)) {
        this.speak("Sorry, that's not a number.");
      } else {
        return true;
      }
    }
  },
  {
    "speak": "Great. You can also use - * / for subtraction, multiplication, and division. Now try something that comes out to 5."
  },
  {
    "test": function(item) {
      if(item.result == 5) {
        return true;
      } else {
        this.speak("That comes out to '" + item.result + "', which does not equal 5.");
        return false;
      }
    }
  },
  {
    "speak": "Great job. Goodbye!",
    "prompts": [{"prompt": "Bye!"}]
  },
  {
    "show": false
  }
]

botDialogues.welcome = [
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
        "dialogue": subDialogue
      },
      {
        "prompt": "No thanks",
        "dialogue": randDialogue
      },
      {
        "prompt": "Just continue"
      }
    ],
  },
  {
    "test": function() { return myName=='Toph'; }
  },
  {
    "speak": "Next we're gonna…"
  }
];
