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

botDialogues.logger = [
  {
    "show": true,
    "goTo": [100,100],
    "speak": "Interactions on a web page are driven by events. Events are 'fired', and code can 'listen' for when they happen, and act accordingly."
  },
  {
    "eval": logger+' logger();'
  },
  {
    "speak": "Move your mouse and scroll and look at them all!",
    "prompts": [{"prompt": "OK."}]
  }
];

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

botDialogues.debug = [
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

botDialogues.roulette = [
{
  "show": true,
  "goTo": [100,100],
  "speak": "Web pages are made up of different HTML 'elements'. Many of them have some semantic meaning: paragraphs, headers, lists. Others are just arbitrary containers of stuff, like divs and spans. These elements are styled according to rules written in CSS. Here, let's randomize the CSS rules being applied to the HTML elements on this page.",
  "prompts": [{"prompt": "OK..."}]
},
{
  "eval": roulette+' roulette();'
},
{
  "speak": "Cool, right?",
  "prompts": [
    {"prompt": "OK. Neat.", "dialogue": [{"show": false}]},
    {"prompt": "Again! Again!!", "dialogue": function() { return botDialogues.roulette.slice(1); }},
    {"prompt": "Back to normal, please...", "dialogue": [{"show": false, "eval": "resetArticle();"}]}
  ]
}
];

botDialogues.destroy = [
{
  "show": true,
  "goTo": [100,100],
  "speak": "OK cool well now we'll just delete random things on the page.",
},
{
  "eval": destroyPage+' destroyPage();',
  "prompts": [{"prompt": "Hey where's everything going?"}]
},
{
  "speak": "You're on your own. It's too late now.",
  "emote": "ded"
}
];

botDialogues.arrays = [
{
  "show": true,
  "goTo": [100,100],
  "speak": "Hello! Many, many things in a computer are saved in a LIST form. Many of the tasks that a programmer does involve creating and modifying lists. Let’s create a list.",
},
{
  "speak": "THIS IS THE CODE TO MAKE A LIST OF DOGS.",
  "eval": "dogs = ['black lab', 'tabby', 'golden retriever', 'corgi', 'chihuahua'];",
  "emote": "love",
  "prompts": [{"prompt": "OK..."}]
},
{
  "speak": "First of all, one of these does not belong. So you should replace it with “boston terrier”.",
  "emote": "troll"
},
{
  "speak": "In Javascript arrays start at 0 (zero) which is weird and confusing but you need to work with it, that’s life. So starting at 0 what number is ‘tabby’? Type your answer below and hit enter:",
  "emote": "restface"
},
{
  "test": function(item) {
    if(item.result == 1) {
      return true;
    } else if((item.command+'').toLowerCase().trim() == "one") {
      this.speak("OK, true, but please just enter it in numerals, like 8 or 9 or 2345235.");
      return false;
    } else {
      this.speak("Nope. OK, starting at 0, so 'black lab' is 0, so 'tabby' is...");
      return false;
    }
  }
},
{ "speak": "Right! Here's how we could replace chihuahuas with a different dog:" },
{ "eval": "dogs[4] = 'pug';" },
{ "speak": "Now replace 'tabby' with 'boston terrier'." },
{
  "test": function(item) {
    if(dogs[1]+''.toLowerCase().trim() == 'boston terrier') {
      return true;
    } else {
      this.speak("Nope. The element that should be 'boston terrier' is instead '"+ dogs[1] +"'. Try again.");
      return false;
    }
  }
},
{ "speak": "Now you have done it. You have replaced the dogs." },
{ "speak": "Now get rid of chihuahuas. The way you do that is by calling the pop method: dogs.pop();", "emote": "restface" },
{
  "test": function(item) {
    if(dogs.length == 4 && item.result=="pug" && item.command.indexOf("pop") !== -1) {
      return true;
    } else {
      dogs = ["black lab","boston terrier","golden retriever","corgi","pug"];
      this.speak("Welp, something went wrong. I've reset the dogs array; try again. Just type and hit enter: dogs.pop();");
      return false;
    }
  }
},
{ "speak": function() { return "Great. Notice how the pop method returns the value of the item you popped off. The array is now: " + JSON.stringify(dogs); } },
{ "speak": "Now add ‘mutt’ but PUSHING into the end of the array: dogs.push('mutt');" },
{
  "test": function(item) {
    if(dogs.indexOf("mutt") !== -1 && dogs instanceof Array) {
      return true;
    } else {
      dogs = ["black lab","boston terrier","golden retriever","corgi"];
      this.speak("Welp, something went wrong. I've reset the dogs array; try again. Just type and hit enter: dogs.push('mutt');");
      return false;
    }
  }
},
{ "speak": "Great! RECAP: You’ve learned how to make a list. You can learn a hell of a lot more elsewhere:",
  "prompts": [
    {"prompt": "Eloquent JavaScript, Chapter 4", "link": "http://eloquentjavascript.net/04_data.html"},
    {"prompt": "Or just Google it", "link": "https://www.google.com/#q=javascript%20array%20tutorial"}
  ]
}
];

botDialogues.dom = [

]
