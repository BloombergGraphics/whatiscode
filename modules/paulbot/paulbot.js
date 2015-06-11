var paulbot;

!(function(){

  var module = {sel: d3.select('#paulbot')}
  addModule(module)

  // create sticky fixed paulbot
  paulbot = module.bot = bot();
  module.sel.call(paulbot);

  if(stats && stats.visits > 1) {
    var message = "Welcome back! You’ve visited " +
      stats.visits + " times and spent " + 
      (stats.timeOnPage/1000/60).toFixed() + " minutes here.";
  } else {
    var message = "Hi! I am the bot! I am here to help you learn about CODE. I will dance for you. You cannot stop me from dancing. I will see you again in some words.";
  }

  var dialogue = [
    { "speak": message },
    { "mode": "off" }
  ];

  if(stats && stats.windows.previous) {
    dialogue[0].prompts = [
      {
        "prompt": "Continue reading from last spot",
        "do": function() { document.getElementsByTagName('body')[0].scrollTop = stats.windows.previous; }
      },
      {
        "prompt": "Go away"
      }
    ]
    setTimeout(function() {
      paulbot.mode("off");
    }, 15000)
  } else {
    dialogue[0].wait = 15000;
  }

  paulbot.dialogue(dialogue);

  var scrollLog = [],
  alertTooFastThrottled = _.throttle(alertTooFast, 10000),
  fastSass = _.shuffle([
    "You're scrolling too fast! Sloooowww dowwnnnn!",
    "Wow you can read so quickly!",
    "This is like a zillion wpm.",
    "Are you reading my article or are you looking at my article?",
    "Hey Barbecue, where's the fire?",
    "Trying to skip to the bottom?",
    "Are you just looking for fancy Snowfally things to jump out at you? Read more words. They're good.",
    "Excuse me, my words are up here.",
    "Speed demon, huh?",
    "Wow, don’t burn your mouse finger.",
    "You are the fastest reader I’ve ever seen."
  ]);

  d3.select(window).on("scroll.stickybot", _.throttle(logScroll, 1000));
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

  // https://css-tricks.com/snippets/jquery/konomi-code/
  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
  $(document).keydown(function(e) {
    kkeys.push( e.keyCode );
    if ( kkeys.toString().indexOf( konami ) >= 0 ) {
      $(document).unbind('keydown',arguments.callee);
      // do something
      var dialogue = [
        {
          "emote": "jumps",
          "speak": "EASTER EGG",
          "wait": 5000
        },
        {
          "mode": "off",
          "emote": "chill"
        }
      ]
      paulbot.dialogue(dialogue);
    }
  });

})();
