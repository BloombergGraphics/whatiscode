function destroyPage() {
  setInterval(function() {
    var $el = $('body');
    while($el.children().length > 0) {
      $el = $el.children().eq(0);
    }
    $el.remove();
  },100);
}

function randomize() {
  var selectors = ["h1", "h2", "p"];
  var properties = [
    {
      "name": "background",
      "values": ["none", "#d5cdfb", "#fdc8d8", "#fae665", "#fbba7d", "#94e1bb"]
    },
    {
      "name": "font-family",
      "values": ["helvetica, arial", "garamond", "times new roman", "comic sans ms", "verdana", "georgia", "palatino", "courier"]
    },
    {
      "name": "font-size",
      "values": ["1em", ".7em", "1.3em", "2em"]
    },
    {
      "name": "padding",
      "values": ["0","5px","10px","15px"]
    },
    {
      "name": "margin",
      "values": ["0","5px","10px","15px"]
    },
    {
      "name": "border-radius",
      "values": ["0", "2px", "3px", "4px", "5px"]
    },
    {
      "name": "text-align",
      "values": ["left", "center", "right"]
    },
    {
      "name": "transform",
      "values": ["rotate(0deg)","rotate(0deg)","rotate(0deg)","rotate(0deg)","rotate(0deg)","rotate(0deg)","rotate(5deg)","rotate(-5deg)","rotate(-10deg)","rotate(10deg)","rotate(15deg)"]
    }
  ];

  $els = $("article").find(_.sample(selectors));
  var prop = _.sample(properties);
  $els.css(prop.name, _.sample(prop.values));
}

function roulette(time) {
  if (!time) time = 1;
  if (time>500) return;
  randomize();
  setTimeout(function() {roulette(time*1.1)}, time);
}

function resetArticle() {
  $("article").html(originalArticle);
  d3.select("body").style("background-color", "inherit");
  d3.select("body").style("color", "inherit");
}

function rewrite() {

  var speed = 1,
      n = 0;

  var articleTemplate = $("article").html(),
      styleTemplate = $("style").html();

  var article = $("article"),
      style = $("style");

  var timer = setInterval(function() {
    if(read(n,n)) {
      speed *= 1.01;
      n += speed;
    } else {
      clearInterval(timer);
    }
  });

  function read(n_article, n_style) {
    article.html(articleTemplate.substr(0,n_article));
    style.html(styleTemplate.substr(0,n_style));
    return n_article <= articleTemplate.length || n_style <= styleTemplate.length;
  }

}

function mouseEvents(bool) {

  if(this.state === bool) {
    return;
  } else {
    this.state = bool;
  }

  var eventHandlers = {
    "mousemove": drawMouse,
    "click": drawMouse
  };

  for(var eventName in eventHandlers) {
    if(bool) {
      d3.select(window).on(eventName+".logger", eventHandlers[eventName]);
    } else {
      d3.select(window).on(eventName+".logger", null);
    }
  }

  function drawMouse(e) {

    var xScale = d3.scale.linear().domain([0,$(window).width()]).range([0, 255]);
    var xScale2 = d3.scale.linear().domain([0,$(window).width()]).range([255, 0]);
    var yScale = d3.scale.linear().domain([0,$(window).height()]).range([0, 255]);
    var color = "rgb("+ xScale(d3.event.clientX).toFixed() + "," + yScale(d3.event.clientY).toFixed() + "," + xScale2(d3.event.clientX).toFixed() +")";

    d3.select("body")
      .append("div")
      .classed("event-log", true)
      .classed(d3.event.type, true)
      .style("position", "fixed")
      .style("left", d3.event.clientX+"px")
      .style("top", d3.event.clientY+"px")
      .style("transform", "translate(-50%,-50%) rotate("+ (Math.random()*60-30).toFixed() +"deg)")
      .style("color", color)
      .html(d3.event.type + "<br/><small>(" + d3.event.clientX + ", " + d3.event.clientY + ")</small>")
      .transition()
      .ease("exp-out")
      .duration(10000)
      .style("opacity", 0)
      .remove();
  }
}




console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");
