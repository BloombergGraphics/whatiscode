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
    { "emote": "waving", "speak": message },
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
      alertTooFastThrottled = _.throttle(alertTooFast, 60*1000),
      completionThrottled = _.throttle(completion, 5*60*1000),
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
        "emote": "dizzy",
        "speak": fastSass.pop(),
        "wait": 7000
      },
      {
        "mode": "off"
      }
    ]
    paulbot.dialogue(dialogue);
  }

  function logScroll() {
    scrollLog.push({
      "scrollTop": pageYOffset,
      "timestamp": +(new Date())
    });

    if(scrollLog.length < 2) return;

    var scrollSpeed =
      (scrollLog[scrollLog.length-1].scrollTop - scrollLog[scrollLog.length-2].scrollTop) /
      (scrollLog[scrollLog.length-1].timestamp - scrollLog[scrollLog.length-2].timestamp)

    if(pageYOffset + innerHeight > $(document).height() - 400) {
      completionThrottled();
    } else if(scrollSpeed > 4 && fastSass.length) {
      alertTooFastThrottled();
    }
  }

  function completion() {
    var timeOnPage = ((+new Date()) - loadTime) + stats.timeOnPage;
    var wpm = stats.wordCount / (timeOnPage / 1000 / 60);

    var comments = [
      [0, "That’s insanely slow. How many times have you read it? So thorough! So proud. Or did you just leave the tab open?"],
      [180, "That’s nice and thorough!"],
      [250, "That’s the low end of average."],
      [275, "That’s about average."],
      [300, "That’s the high end of average."],
      [350, "That’s pretty fast."],
      [400, "That’s too fast. You skimmed some, didn’t you?"],
      [500, "OK that’s just a lie. That cannot be true. You cheated."],
      [1000, "Hahahahah as if. Nice. Cool. Frankly we expected no more of you."]
    ];

    var readPerformance = d3.scale.threshold()
      .domain(comments.map(ƒ(0)).slice(1))
      .range(comments.map(ƒ(1)));

    var message = "Congratulations! You read " + stats.wordCount + " words in " + (timeOnPage/1000/60).toFixed() + " minutes, which is " + wpm.toFixed() + " words per minute. " + readPerformance(wpm);

    var dialogue = [
      {
        "emote": "explaining",
        "speak": message,
        "wait": 20000
      },
      {
        "mode": "off"
      }
    ];

    module.bot.dialogue(dialogue);
  }

  // https://css-tricks.com/snippets/jquery/konomi-code/
  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
  $(document).keydown(function(e) {
    kkeys.push( e.keyCode );
    if ( kkeys.toString().indexOf( konami ) >= 0 ) {
      
      kkeys = [];

      if(d3.select("#reggaegg").empty()) {
        d3.select("body").append("iframe")
          .attr("id", "reggaegg")
          .attr("src", "reggaegg.html");
      } else {
        d3.select("#reggaegg").remove();
      }
    }
  });

})();
