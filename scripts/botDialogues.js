var botDialogues = {};

var myName = null,
    dogs;

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
          "prompt": "OK, done",
          "speak": function() { return "You got it! Thanks " + myName +". Now, many things in a computer are saved in a LIST form. Many of the tasks that a programmer does involve creating and modifying lists. Let’s create a list. This is the code to make a list of dogs."; },
          "eval": "dogs = ['black lab', 'tabby', 'golden retriever', 'corgi', 'pug'];",
          "responses": [
            {
              "prompt": "OK, I'm with you.",
              "speak": "First of all, one of these does not belong. So you should replace it with “boston terrier”. In Javascript arrays start at ZERO which is weird and confusing but you need to work with it, that’s life. So starting at ZERO what number is ‘tabby’?",
              "eval": "dogs[1] = 'dolphin';",
              "test": function() { return dogs[1] == "boston terrier"; },
              "responses": [
                {
                  "prompt": "But a dolphin isn't... OK, got it, I did it.",
                  "speak": "Great! Now you have done it. You have replaced the dogs. Now get rid of the pug. The way you do that is by calling the pop method: dogs.pop();",
                  "test": function() { return dogs.indexOf("pug") === -1; },
                  "responses": [
                {
                  "prompt": "OK done, I popped the pug.",
                  "speak": "Now add ‘mutt’ but PUSHING into the end of the array: dogs.push('mutt');",
                  "test": function() { return dogs.indexOf("mutt") !== -1; },
                  "responses": [
                    {
                      "prompt": "Done.",
                      "speak": "Awesome, you did it! You've learned how to make and manipulate a list. You can just type dogs and hit enter to see your list.",
                      "do": function() { d3.select(learninal.el).classed("open",false); }
                    }
                  ]
                }
                  ]
                }
              ]
            }
          ]
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

/*
if(!choices) choices = [{
"prompt": _.sample([
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
]),
"speak": _.sample([
"Bye!",
"Peace out!",
"Till next time!",
"Keep codin'!",
"Yup, cheers!",
"So long, sucka!",
"Stay classy."
]),
"eval": "paulbot.hide();",
"responses": []
}];
*/
