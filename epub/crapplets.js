!(function(){

  var module = {sel: d3.select('[data-module="crapplets"]')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var alertIntervals = [],
      container = module.sel.append("div").classed("crapplets", true),
      n = 0;

  var alerts = ["1.jpg", "14.png", "19.jpeg", "23.jpg", "28.jpg", "32.jpg", "37.jpg", "41.png", "7.png",
    "10.gif", "15.jpg", "2.png", "24.png", "29.jpg", "33.png", "38.png", "42.png", "8.jpg", "11.png",
    "16.jpg", "20.jpg", "25.png", "3.png", "34.png", "39.png", "43.png", "9.png", "12.jpeg", "17.png",
    "21.png", "26.png", "30.png", "35.png", "4.png", "5.jpg", "13.png", "18.png", "22.JPG", "27.PNG",
    "31.jpg", "36.PNG", "40.png", "6.jpg"];

  var introDialogue = [
    {
      "emote": "explaining",
      "speak": "Welcome to our Java simulator, or JVMVM—all the fun with none of the genuine security risks! Click the loading screen to begin."
    }
  ];

  var dialogues = [
    [{
      "speak": "Oops, looks like you gotta update something! Double-click to escape. Not that you’d want to.",
      "prompts": [{"prompt": "Make it stop, please.", "dialogue": [{"do": cleanUp}] }]
    }],
    [{
      "speak": "Hope it doesn’t require a restart!",
      "prompts": [{"prompt": "Please, make it all go away.", "dialogue": [{"do": cleanUp}] }]
    }],
    [{
      "speak": "Honestly, let’s just forget this ever happened.",
      "prompts": [{"prompt": "Jeepers, get rid of this!", "dialogue": [{"do": cleanUp}] }]
    }]
  ];

  var outroDialogue = [
    {
      "emote": "no_2",
      "speak": "Phew."
    }
  ];

  module.oninit = welcome;
  container.on("click", makeItWorse);
  container.on("dblclick", cleanUp);
  module.onunload = cleanUp;

  function welcome() {
    module.bot.dialogue(introDialogue);
  }

  function makeItWorse() {
    n++;
    // add one immediately
    addAlert();
    // add timer to add more
    alertIntervals.push(setInterval(addAlert, 2000));
    // narrate
    if(dialogues.length) module.bot.dialogue(dialogues.shift());
    // make escape hatch increasingly obvious
    module.sel.selectAll(".bot .response").style("font-size", Math.min(n,3)+"em");
  }

  function cleanUp() {
    if(!n) return;
    // remove all alerts
    container.selectAll('img').remove();
    // clear all intervals
    alertIntervals.forEach(function(value, index) {
      clearInterval(value);
    });
    // phew
    module.bot.dialogue(outroDialogue);
    // detach 
    container.on("click", null);
  }

  function addAlert() {

    var x = d3.random.normal(module.sel.node().offsetWidth / 2, module.sel.node().offsetWidth / 5);
    var y = d3.random.normal(module.sel.node().offsetHeight / 2, module.sel.node().offsetHeight / 5);

    container.append("img").attr("src", "modules/crapplets/img/alerts/" + _.sample(alerts))
      .style("left", x() + "px")
      .style("top", y() + "px");
  }

})();
