var paulbot;

!(function(){

  var module = {sel: d3.select('#paulbot')}
  addModule(module)

  // create sticky fixed paulbot
  paulbot = module.bot = bot();
  module.sel.call(paulbot);

  setTimeout(function() {
    if(localStorage.getItem('visitCount') && parseInt(localStorage.getItem('visitCount')) > 1) {
      var message = "Hey, welcome back" +
        (document.referrer ? " from " + document.referrer + " " : "") +
        "! You've visited " +
        localStorage.getItem('visitCount') + " times and spent " + (localStorage.getItem('timeOnPage')/1000/60).toFixed() +
        " minutes here.";
    } else {
      var message = "Hey, welcome" +
        (document.referrer ? " from " + document.referrer + " " : "") +
        "! Look for me throughout the article for moments where you can play along.";
    }

    var dialogue = [
      {
        "speak": message
      }
    ];
    if(localStorage.getItem('scrollTop')) {
      dialogue[0]["prompts"] =
        [
          {
            "prompt": "Continue reading from last spot",
            "do": function() { document.getElementsByTagName('body')[0].scrollTop = parseInt(localStorage.getItem('scrollTop')); }
          },
          {
            "prompt": "Please go away."
          }
        ];
    } else {
      dialogue.push({
        "wait": 6000
      });
    }
    dialogue.push({
      "mode": "off"
    });

    paulbot.dialogue(dialogue);

  }, 5000);

  var hasTriggered = false;
  $(window).on('scroll', function(e) {

    // when you hit the bottom of the page
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && !hasTriggered) {

      hasTriggered = true;

      var bottomTime = new Date();
      var timeDiff = (((bottomTime - loadTime) / 1000 / 60)*100).toFixed()/100;
      paulbot.mode("on");
      paulbot.emote('troll');
      paulbot.speak(function() { return "So you read 38,000 words in " + timeDiff + " minutes." });
      paulbot.wait(3000).then(function() { paulbot.mode("off"); });
    }
  })

  var scrollLog = [];

  var fastSass = _.shuffle([
    "You're scrolling too fast! Sloooowww dowwnnnn!",
    "Wow you can read so quickly!",
    "This is like a zillion wpm.",
    "Are you reading my article or are you looking at my article.",
    "Hey Barbecue, where's the fire?",
    "Trying to skip to the bottom?",
    "Are you just looking for fancy Snowfally things to jump out at you? Read more words. They're good.",
    "Excuse me, my words are up here."
  ]);

  $(window).on("scroll", _.throttle(logScroll, 1000));
  logScroll();

  function alertTooFast() {
    var dialogue = [
      {
        "emote": "jumps",
        "speak": fastSass.pop(),
        "wait": 5000
      },
      {
        "mode": "off",
        "emote": "chill"
      }
    ]
    paulbot.dialogue(dialogue);
  }
  var alertTooFastThrottled = _.throttle(alertTooFast, 10000);

  function logScroll() {
    var scrollTop = document.getElementsByTagName("body")[0].scrollTop;
    scrollLog.push({
      "scrollTop": scrollTop,
      "timestamp": +(new Date())
    });

    if(scrollLog.length < 2) return;

    var scrollSpeed =
      (scrollLog[scrollLog.length-1].scrollTop - scrollLog[scrollLog.length-2].scrollTop) /
      (scrollLog[scrollLog.length-1].timestamp - scrollLog[scrollLog.length-2].timestamp)

    if(scrollSpeed > 4 && fastSass.length) {
      alertTooFastThrottled();
    }
  }

})();
