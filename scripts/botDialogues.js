var botDialogues = {};

var myName = null;

botDialogues.welcome =
{
  "prompt": null,
  "speak": "Hi, I'm Paulbot. Welcome to my Learninal! We will have fun today.",
  "do": null,
  "eval": null,
  "responses": [
    {
      "prompt": "I want to code",
      "speak": "Great! First, set your name, like this:",
      "eval": "myName = 'Paul';",
      "do": function() { d3.select(learninal.el).classed("open",true); },
      "test": function() { return myName !== "Paul"; },
      "responses": [
        {
          "prompt": "OK, done.",
          "eval": "paulbot.hide();"
        }
      ]
    },
    {
      "prompt": "Show me some code",
      "speak": "Here's how to make an alert. It's pretty obnoxious, frankly.",
      "eval": "alert('heyyy')",
      "responses": [
        {
          "prompt": "How about something colorful?",
          "speak": "So true. Here, look, let's mess with the article styles:",
          "eval": "roulette();",
          "responses": [
            {
              "prompt": "Wow u are cool after all. Bye",
              "eval": "paulbot.hide();"
            }
          ]
        },
        {
          "prompt": "How about something destructive?",
          "speak": "OK cool well now we'll just delete random things on the page.",
          "eval": "destroyPage();",
          "responses": [
            {
              "prompt": "Hey where's everything going?",
              "speak": "You're on your own. It's too late now."
            }
          ]
        }
      ]
    },
    {
      "prompt": "Go away forever",
      "speak": "My mind is going...",
      "do": function() { this.emote('pray.gif'); },
      "eval": "paulbot.destroy();"
    }
  ]
};

botDialogues.rewrite = {
  "prompt": null,
  "speak": "Wanna see me rewrite this article?",
  "eval": "rewrite();"
}

botDialogues.logger = {
  "prompt": null,
  "speak": "Interactions on a web page are driven by events. Events are 'fired', and code can 'listen' for when they happen, and act accordingly. Do you want to see some events?",
  "responses": [
    {
      "prompt": "OK.",
      "speak": "Cool. Move your mouse and scroll and look at them all!",
      "do": function() { logger(); }
    },
    {
      "prompt": "Not really.",
      "speak": "Oh. Well, click that paulbot prompt again if you ever want to."
    }
  ]
}

for (var key in botDialogues) {
  if (botDialogues.hasOwnProperty(key)) {
    var dialogue = botDialogues[key];
    initDialogue(dialogue);
  }
}

function initDialogue(dialogue) {
  dialogue.hasSeen = false;
  dialogue.isPassed = null;
  if(dialogue.responses) {
    dialogue.responses.forEach(function(subdialogue, index) {
      initDialogue(subdialogue);
    });
  }
}
