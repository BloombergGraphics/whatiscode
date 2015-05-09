var botDialogues = {};

var myName = null,
    dogs;

var subDialogue = [
  { "speak": "Subdialogue part 1..." },
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
  dialogue.push({"speak": randText()});
  dialogue.push({"speak": randText()});
  dialogue.push({"speak": randText()});
  return dialogue;
}

botDialogues.welcome = [
  {
    "speak": "Welcome!",
    "show": true,
    "goTo": [100,100]
  },
  {
    "eval": "alert('hi');"
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
