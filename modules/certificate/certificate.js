!(function(){

  var module = {sel: d3.select('[data-module="certificate"]')}
  addModule(module)

  module.bot = bot();
  module.sel.insert("div.bot", ":first-child").call(module.bot);

  module.onload = function() {
    var wordCount = d3.select("article").text().trim().replace(/\s+/gi, ' ').split(' ').length;
    var timeOnPage = (+new Date()) - loadTime;
    if(localStorage.getItem('timeOnPage')) {
      timeOnPage += parseInt(localStorage.getItem('timeOnPage'));
    }
    var wpm = wordCount / (timeOnPage / 1000 / 60);

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

    var message = "Congratulations! You read " + wordCount + " words in " + (timeOnPage/1000/60).toFixed() + " minutes, which is " + wpm.toFixed() + " words per minute. " + readPerformance(wpm);

    var dialogue = [
      {
        "emote": "explaining",
        "speak": message
      },
      { "emote": "chill" }
    ];

    module.bot.dialogue(dialogue);

  }


})();
