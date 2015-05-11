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

var log = {
  "mouse": [],
  "scroll": []
}
function logger() {

  $(window).scroll(function(e) {
    d3.select("body")
      .append("div")
      .classed("event-log", true)
      .classed("scroll", true)
      .style("position", "fixed")
      .style("right", "10px")
      .style("top", (100*$("body").scrollTop()/($("body").height()-$(window).height())) + "%")
      .html("scroll" + "<br/><small>(" + (100*$("body").scrollTop()/($("body").height()-$(window).height())).toFixed() + "%" + ")</small>")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();

    log.scroll.push({
      "time": new Date(),
      "scrollTop": $("body").scrollTop()
    });
  });

  ["keydown", "keypress", "keydown", "keypress", "keyup"].forEach(function(eventName) {
    $(window).on(eventName, function(e) {
      var key = event.keyCode || event.which;
      var keychar = String.fromCharCode(key);

      var x = Math.random()*$(window).width();
      var y = Math.random()*$(window).height();
      var color = d3.scale.linear().domain([0,25,50,75,100]).range(["red", "orange", "green", "blue", "purple"]);

      d3.select("body")
        .append("div")
        .classed("event-log", true)
        .classed("keyboard", true)
        .style("position", "fixed")
        .style("left", x+"px")
        .style("top", y+"px")
        .style("color", color(key%100))
        .html(keychar + "<br/><small>" + eventName + "</small>")
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();

    })
  });

  ["mousemove", "click"].forEach(function(eventName) {
    $("body").on(eventName, function(e) {

      var xScale = d3.scale.linear().domain([0,$(window).width()]).range([0, 255]);
      var xScale2 = d3.scale.linear().domain([0,$(window).width()]).range([255, 0]);
      var yScale = d3.scale.linear().domain([0,$(window).height()]).range([0, 255]);
      var color = "rgb("+ xScale(e.clientX).toFixed() + "," + yScale(e.clientY).toFixed() + "," + xScale2(e.clientX).toFixed() +")";

      d3.select("body")
        .append("div")
        .classed("event-log", true)
        .classed(eventName, true)
        .style("position", "fixed")
        .style("left", e.clientX+"px")
        .style("top", e.clientY+"px")
        .style("transform", "translate(-50%,-50%) rotate("+ (Math.random()*60-30).toFixed() +"deg)")
        .style("color", color)
        .html(eventName + "<br/><small>(" + e.clientX + ", " + e.clientY + ")</small>")
        .transition()
        .ease("exp-out")
        .duration(10000)
        .style("opacity", 0)
        .remove();

      log.mouse.push({
        "time": new Date(),
        "event": eventName,
        "clientX": e.clientX,
        "clientY": e.clientY,
        "offsetX": e.offsetX,
        "offsetY": e.offsetY,
        "pageX": e.pageX,
        "pageY": e.pageY,
        "screenX": e.screenX,
        "screenY": e.screenY
      });
    })
  })
}

//http://www.bloomberg.com/api/topics/graphics


console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");
