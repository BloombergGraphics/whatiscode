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
setInterval(function() {
  var scrollTop = document.getElementsByTagName("body")[0].scrollTop;
  scrollLog.push({
    "scrollTop": scrollTop,
    "timestamp": +(new Date())
  });

  var scrollSpeed =
    (scrollLog[scrollLog.length-1].scrollTop - scrollLog[scrollLog.length-2].scrollTop) /
    (scrollLog[scrollLog.length-1].timestamp - scrollLog[scrollLog.length-2].timestamp)


  if(scrollSpeed > 4) {
    paulbot.mode("on");
    paulbot.emote('troll');
    paulbot.speak(function() { return "You're scrolling so fast! Sloooowww dowwnnnn!" });
    paulbot.wait(3000).then(function() { paulbot.mode("off"); });
  }

}, 1000);

window.onunload = window.onbeforeunload = function(event) {
  localStorage.setItem('scrollTop', document.getElementsByTagName("body")[0].scrollTop);
  return;
}
