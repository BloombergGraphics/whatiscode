setTimeout(function() {
  if(localStorage.getItem('visitCount') == 1) {
    var message = "Hey, welcome" +
      (document.referrer ? " from " + document.referrer + " " : "") +
      "! Have you noticed me?";
  } else {
    var message = "Hey, welcome back" +
      (document.referrer ? " from " + document.referrer + " " : "") +
      "! You've visited " +
      localStorage.getItem('visitCount') +
      " times. Remember, I'm here for you!";
  }
  paulbot.tease({
    "message": message,
    "buttons": [
      {"text": "Start a tutorial", "click": function() { paulbot.mode("on"); }},
      {"text": "Go away", "click": function() { paulbot.mode("off"); }}
    ]
  })
}, 0);

// those yellow-highlighted paulbot prompts launch teases which launch tutorials
$('body').on('mouseover', '.paulbot-prompt', function(e) {
  paulbot.emote('wiggle');
}).on('mouseout', '.paulbot-prompt', function(e) {
  paulbot.emote('restface');
}).on('click', '.paulbot-prompt[data-tease]', function(e) {
  paulbot.tease(botTeases[this.dataset.tease])
});

$(window).on('scroll', function(e) {
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    var bottomTime = new Date();
    var timeDiff = (((bottomTime - loadTime) / 1000 / 60)*100).toFixed()/100;
    paulbot.emote('troll');
    paulbot.tease({
      "message": function() { return "Oh so you read 38,000 words in only " + timeDiff + " minutes, did you? Stop and smell the roses." },
      "buttons": [
        {"text": "Guilty!", "click": function() { paulbot.emote('restface'); paulbot.mode("off"); }}
      ]
    });
  }
})
