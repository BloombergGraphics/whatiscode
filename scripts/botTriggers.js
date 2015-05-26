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
    paulbot.mode("on");
    paulbot.speak(message);
    paulbot.wait(5000).then(function() { paulbot.mode("off"); });
  }, 500);
})

$(window).on('scroll', function(e) {

  // when you hit the bottom of the page
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    var bottomTime = new Date();
    var timeDiff = (((bottomTime - loadTime) / 1000 / 60)*100).toFixed()/100;
    paulbot.mode("on");
    paulbot.emote('troll');
    paulbot.speak(function() { return "Oh so you read 38,000 words in only " + timeDiff + " minutes, did you? Stop and smell the roses." });
    paulbot.wait(3000).then(function() { paulbot.mode("off"); });
  }
})
