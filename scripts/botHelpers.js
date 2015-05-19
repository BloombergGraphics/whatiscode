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

var log = {
  "mouse": [],
  "scroll": []
}
function logger(bool) {

  if(this.state === bool) {
    return;
  } else {
    this.state = bool;
  }

  var eventHandlers = {
    "scroll": drawScroll,
    "keydown": drawKey,
    "keypress": drawKey,
    "keyup": drawKey,
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

  function drawScroll(e) {

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
  }

  function drawKey(e) {

  var scanCodes = [
    {"key":"A","make":"1C","break":"F0,1C"},
    {"key":"B","make":"32","break":"F0,32"},
    {"key":"C","make":"21","break":"F0,21"},
    {"key":"D","make":"23","break":"F0,23"},
    {"key":"E","make":"24","break":"F0,24"},
    {"key":"F","make":"2B","break":"F0,2B"},
    {"key":"G","make":"34","break":"F0,34"},
    {"key":"H","make":"33","break":"F0,33"},
    {"key":"I","make":"43","break":"F0,43"},
    {"key":"J","make":"3B","break":"F0,3B"},
    {"key":"K","make":"42","break":"F0,42"},
    {"key":"L","make":"4B","break":"F0,4B"},
    {"key":"M","make":"3A","break":"F0,3A"},
    {"key":"N","make":"31","break":"F0,31"},
    {"key":"O","make":"44","break":"F0,44"},
    {"key":"P","make":"4D","break":"F0,4D"},
    {"key":"Q","make":"15","break":"F0,15"},
    {"key":"R","make":"2D","break":"F0,2D"},
    {"key":"S","make":"1B","break":"F0,1B"},
    {"key":"T","make":"2C","break":"F0,2C"},
    {"key":"U","make":"3C","break":"F0,3C"},
    {"key":"V","make":"2A","break":"F0,2A"},
    {"key":"W","make":"1D","break":"F0,1D"},
    {"key":"X","make":"22","break":"F0,22"},
    {"key":"Y","make":"35","break":"F0,35"},
    {"key":"Z","make":"1A","break":"F0,1A"},
    {"key":"0","make":"45","break":"F0,45"},
    {"key":"1","make":"16","break":"F0,16"},
    {"key":"2","make":"1E","break":"F0,1E"},
    {"key":"3","make":"26","break":"F0,26"},
    {"key":"4","make":"25","break":"F0,25"},
    {"key":"5","make":"2E","break":"F0,2E"},
    {"key":"6","make":"36","break":"F0,36"},
    {"key":"7","make":"3D","break":"F0,3D"},
    {"key":"8","make":"3E","break":"F0,3E"},
    {"key":"9","make":"46","break":"F0,46"},
    {"key":"`","make":"0E","break":"F0,0E"},
    {"key":"-","make":"4E","break":"F0,4E"},
    {"key":"=","make":"55","break":"FO,55"},
    {"key":"\\","make":"5D","break":"F0,5D"},
    {"key":"BKSP","make":"66","break":"F0,66"},
    {"key":"SPACE","make":"29","break":"F0,29"},
    {"key":"TAB","make":"0D","break":"F0,0D"},
    {"key":"CAPS","make":"58","break":"F0,58"},
    {"key":"L SHFT","make":"12","break":"FO,12"},
    {"key":"L CTRL","make":"14","break":"FO,14"},
    {"key":"L GUI","make":"E0,1F","break":"E0,F0,1F"},
    {"key":"L ALT","make":"11","break":"F0,11"},
    {"key":"R SHFT","make":"59","break":"F0,59"},
    {"key":"R CTRL","make":"E0,14","break":"E0,F0,14"},
    {"key":"R GUI","make":"E0,27","break":"E0,F0,27"},
    {"key":"R ALT","make":"E0,11","break":"E0,F0,11"},
    {"key":"APPS","make":"E0,2F","break":"E0,F0,2F"},
    {"key":"ENTER","make":"5A","break":"F0,5A"},
    {"key":"ESC","make":"76","break":"F0,76"},
    {"key":"F1","make":"5","break":"F0,05"},
    {"key":"F2","make":"6","break":"F0,06"},
    {"key":"F3","make":"4","break":"F0,04"},
    {"key":"F4","make":"0C","break":"F0,0C"},
    {"key":"F5","make":"3","break":"F0,03"},
    {"key":"F6","make":"0B","break":"F0,0B"},
    {"key":"F7","make":"83","break":"F0,83"},
    {"key":"F8","make":"0A","break":"F0,0A"},
    {"key":"F9","make":"1","break":"F0,01"},
    {"key":"F10","make":"9","break":"F0,09"},
    {"key":"F11","make":"78","break":"F0,78"},
    {"key":"F12","make":"7","break":"F0,07"},
    {"key":"PRNT ","make":"E0,12, ","break":"E0,F0, "},
    {"key":"SCRN","make":"E0,7C ","break":"7C,E0, F0,12 "},
    {"key":"SCROLL","make":"7E","break":"F0,7E"},
    {"key":"PAUSE","make":"E1,14,77, E1,F0,14, F0,77","break":""},
    {"key":"[","make":"54","break":"FO,54"},
    {"key":"INSERT","make":"E0,70","break":"E0,F0,70"},
    {"key":"HOME","make":"E0,6C","break":"E0,F0,6C"},
    {"key":"PG UP","make":"E0,7D","break":"E0,F0,7D"},
    {"key":"DELETE","make":"E0,71","break":"E0,F0,71"},
    {"key":"END","make":"E0,69","break":"E0,F0,69"},
    {"key":"PG DN","make":"E0,7A","break":"E0,F0,7A"},
    {"key":"U ARROW","make":"E0,75","break":"E0,F0,75"},
    {"key":"L ARROW","make":"E0,6B","break":"E0,F0,6B"},
    {"key":"D ARROW","make":"E0,72","break":"E0,F0,72"},
    {"key":"R ARROW","make":"E0,74","break":"E0,F0,74"},
    {"key":"NUM","make":"77","break":"F0,77"},
    {"key":"KP /","make":"E0,4A","break":"E0,F0,4A"},
    {"key":"KP *","make":"7C","break":"F0,7C"},
    {"key":"KP -","make":"7B","break":"F0,7B"},
    {"key":"KP +","make":"79","break":"F0,79"},
    {"key":"KP EN","make":"E0,5A","break":"E0,F0,5A"},
    {"key":"KP .","make":"71","break":"F0,71"},
    {"key":"KP 0","make":"70","break":"F0,70"},
    {"key":"KP 1","make":"69","break":"F0,69"},
    {"key":"KP 2","make":"72","break":"F0,72"},
    {"key":"KP 3","make":"7A","break":"F0,7A"},
    {"key":"KP 4","make":"6B","break":"F0,6B"},
    {"key":"KP 5","make":"73","break":"F0,73"},
    {"key":"KP 6","make":"74","break":"F0,74"},
    {"key":"KP 7","make":"6C","break":"F0,6C"},
    {"key":"KP 8","make":"75","break":"F0,75"},
    {"key":"KP 9","make":"7D","break":"F0,7D"},
    {"key":"]","make":"5B","break":"F0,5B"},
    {"key":";","make":"4C","break":"F0,4C"},
    {"key":"'","make":"52","break":"F0,52"},
    {"key":",","make":"41","break":"F0,41"},
    {"key":".","make":"49","break":"F0,49"},
    {"key":"/","make":"4A","break":"F0,4A"}];

    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);

    // make or break
    var scancode = _.findWhere(scanCodes, {"key": keychar.toUpperCase()});
    scancode = scancode ? scancode[(d3.event.type == "keydown" || d3.event.type == "keypress" ? "make" : "break")] : '';

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
    .html("<strong>" + keychar + "</strong> " + scancode + "<br/><small>" + d3.event.type + "</small>")
    .transition()
    .duration(1000)
    .style("opacity", 0)
    .remove();
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

    log.mouse.push({
      "time": new Date(),
      "type": d3.event.type,
      "clientX": d3.event.clientX,
      "clientY": d3.event.clientY,
      "offsetX": d3.event.offsetX,
      "offsetY": d3.event.offsetY,
      "pageX": d3.event.pageX,
      "pageY": d3.event.pageY,
      "screenX": d3.event.screenX,
      "screenY": d3.event.screenY
    });
  }
}



console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");
