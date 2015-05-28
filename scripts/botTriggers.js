jQuery(document).ready(function($) {
  setTimeout(function() {
    if(localStorage.getItem('visitCount') == 1) {
      var message = "Hey, welcome" +
        (document.referrer ? " from " + document.referrer + " " : "") +
        "! Look for me throughout the article for moments where you can play along.";
    } else {
      var message = "Hey, welcome back" +
        (document.referrer ? " from " + document.referrer + " " : "") +
        "! You've visited " +
        localStorage.getItem('visitCount') +
        " times. Remember to look for me throughout the article for moments where you can play along.";
    }

    var dialogue = [
      {
        "mode": "on",
        "speak": message
      }
    ];
    if(localStorage.getItem('scrollTop')) {
      dialogue.push({
        "prompts": [
          {"prompt": "Continue reading from last spot","dialogue": [{
            "eval": "document.getElementsByTagName('body')[0].scrollTop = parseInt(localStorage.getItem('scrollTop'))"
          }]},
          {"prompt": "No thanks"}
        ]
      })
    } else {
      dialogue.push({
        "wait": 5000
      })
    }
    dialogue.push({
      "mode": "off"
    });

    paulbot.dialogue(dialogue);

  }, 500);
})

var hasTriggered = false;
$(window).on('scroll', function(e) {

  // when you hit the bottom of the page
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && !hasTriggered) {

    hasTriggered = true;

    var bottomTime = new Date();
    var timeDiff = (((bottomTime - loadTime) / 1000 / 60)*100).toFixed()/100;
    paulbot.mode("on");
    paulbot.emote('troll');
    paulbot.speak(function() { return "Oh so you read 38,000 words in only " + timeDiff + " minutes, did you? Stop and smell the roses." });
    paulbot.wait(3000).then(function() { paulbot.mode("off"); });
  }
})

var scrollLog = [];
var fastSass = _.shuffle([
  "You're scrolling so fast! Sloooowww dowwnnnn!",
  "Wow you can read so quickly!",
  "This is like a zillion wpm.",
  "Are you reading my article or are you looking at my article.",
  "Hey Barbecue, where's the fire?",
  "Trying to skip to the bottom?",
  "Are you just looking for fancy Snowfally things to jump out at you? Read more words. They're good.",
  "Excuse me, my words are up here."
]);
var throttler = $.throttle(6000, alertTooFast);
function alertTooFast() {
  console.log("alerting too fast...");
  paulbot.mode("on");
  paulbot.emote('troll');
  paulbot.speak(function() { return fastSass.pop(); });
  paulbot.wait(3000).then(function() { paulbot.mode("off"); });
}
setInterval(function() {
  var scrollTop = document.getElementsByTagName("body")[0].scrollTop;
  scrollLog.push({
    "scrollTop": scrollTop,
    "timestamp": +(new Date())
  });

  var scrollSpeed =
    (scrollLog[scrollLog.length-1].scrollTop - scrollLog[scrollLog.length-2].scrollTop) /
    (scrollLog[scrollLog.length-1].timestamp - scrollLog[scrollLog.length-2].timestamp)

  console.log("logging scroll...");
  if(scrollSpeed > 4 && fastSass.length) {
    console.log("too fast...");
    throttler();
  }

}, 1000);

window.onunload = window.onbeforeunload = function(event) {
  localStorage.setItem('scrollTop', document.getElementsByTagName("body")[0].scrollTop);
  return;
}
