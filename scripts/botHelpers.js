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

function keyboardEvents(bool) {

  if(this.state === bool) {
    return;
  } else {
    this.state = bool;
  }

  var eventHandlers = {
    "keydown": drawKey,
    "keypress": drawKey,
    "keyup": drawKey,
  };

  for(var eventName in eventHandlers) {
    if(bool) {
      d3.select(window).on(eventName+".logger", eventHandlers[eventName]);
    } else {
      d3.select(window).on(eventName+".logger", null);
    }
  }

  var scanCodes = [
    {"key":"A","make":"1C","break":"F0,1C","y":3,"x":1,"dx":1},
    {"key":"B","make":"32","break":"F0,32","y":4,"x":5,"dx":1},
    {"key":"C","make":"21","break":"F0,21","y":4,"x":3,"dx":1},
    {"key":"D","make":"23","break":"F0,23","y":3,"x":3,"dx":1},
    {"key":"E","make":"24","break":"F0,24","y":2,"x":3,"dx":1},
    {"key":"F","make":"2B","break":"F0,2B","y":3,"x":4,"dx":1},
    {"key":"G","make":"34","break":"F0,34","y":3,"x":5,"dx":1},
    {"key":"H","make":"33","break":"F0,33","y":3,"x":6,"dx":1},
    {"key":"I","make":"43","break":"F0,43","y":2,"x":8,"dx":1},
    {"key":"J","make":"3B","break":"F0,3B","y":3,"x":7,"dx":1},
    {"key":"K","make":"42","break":"F0,42","y":3,"x":8,"dx":1},
    {"key":"L","make":"4B","break":"F0,4B","y":3,"x":9,"dx":1},
    {"key":"M","make":"3A","break":"F0,3A","y":4,"x":7,"dx":1},
    {"key":"N","make":"31","break":"F0,31","y":4,"x":6,"dx":1},
    {"key":"O","make":"44","break":"F0,44","y":2,"x":9,"dx":1},
    {"key":"P","make":"4D","break":"F0,4D","y":2,"x":10,"dx":1},
    {"key":"Q","make":"15","break":"F0,15","y":2,"x":1,"dx":1},
    {"key":"R","make":"2D","break":"F0,2D","y":2,"x":4,"dx":1},
    {"key":"S","make":"1B","break":"F0,1B","y":3,"x":2,"dx":1},
    {"key":"T","make":"2C","break":"F0,2C","y":2,"x":5,"dx":1},
    {"key":"U","make":"3C","break":"F0,3C","y":2,"x":7,"dx":1},
    {"key":"V","make":"2A","break":"F0,2A","y":4,"x":4,"dx":1},
    {"key":"W","make":"1D","break":"F0,1D","y":2,"x":2,"dx":1},
    {"key":"X","make":"22","break":"F0,22","y":4,"x":2,"dx":1},
    {"key":"Y","make":"35","break":"F0,35","y":2,"x":6,"dx":1},
    {"key":"Z","make":"1A","break":"F0,1A","y":4,"x":1,"dx":1},
    {"key":"0","make":"45","break":"F0,45","y":1,"x":10,"dx":1},
    {"key":"1","make":"16","break":"F0,16","y":1,"x":1,"dx":1},
    {"key":"2","make":"1E","break":"F0,1E","y":1,"x":2,"dx":1},
    {"key":"3","make":"26","break":"F0,26","y":1,"x":3,"dx":1},
    {"key":"4","make":"25","break":"F0,25","y":1,"x":4,"dx":1},
    {"key":"5","make":"2E","break":"F0,2E","y":1,"x":5,"dx":1},
    {"key":"6","make":"36","break":"F0,36","y":1,"x":6,"dx":1},
    {"key":"7","make":"3D","break":"F0,3D","y":1,"x":7,"dx":1},
    {"key":"8","make":"3E","break":"F0,3E","y":1,"x":8,"dx":1},
    {"key":"9","make":"46","break":"F0,46","y":1,"x":9,"dx":1},
    {"key":"`","make":"0E","break":"F0,0E","y":1,"x":0,"dx":1},
    {"key":"-","make":"4E","break":"F0,4E","y":1,"x":11,"dx":1},
    {"key":"=","make":"55","break":"FO,55","y":1,"x":12,"dx":1},
    {"key":"\\","make":"5D","break":"F0,5D","y":2,"x":13,"dx":1},
    {"key":"BKSP","make":"66","break":"F0,66","y":1,"x":13,"dx":1.5},
    {"key":"SPACE","make":"29","break":"F0,29","y":5,"x":3,"dx":5},
    {"key":"TAB","make":"0D","break":"F0,0D","y":2,"x":0,"dx":1.5},
    {"key":"CAPS","make":"58","break":"F0,58","y":3,"x":0,"dx":1.75},
    {"key":"L SHFT","make":"12","break":"FO,12","y":4,"x":0,"dx":2.25},
    {"key":"L CTRL","make":"14","break":"FO,14","y":5,"x":0,"dx":2},
    {"key":"L GUI","make":"E0,1F","break":"E0,F0,1F","y":null,"x":null,"dx":null},
    {"key":"L ALT","make":"11","break":"F0,11","y":5,"x":1,"dx":2},
    {"key":"R SHFT","make":"59","break":"F0,59","y":4,"x":11,"dx":2.25},
    {"key":"R CTRL","make":"E0,14","break":"E0,F0,14","y":null,"x":null,"dx":null},
    {"key":"R GUI","make":"E0,27","break":"E0,F0,27","y":null,"x":null,"dx":null},
    {"key":"R ALT","make":"E0,11","break":"E0,F0,11","y":5,"x":5,"dx":1.5},
    {"key":"APPS","make":"E0,2F","break":"E0,F0,2F","y":null,"x":null,"dx":null},
    {"key":"ENTER","make":"5A","break":"F0,5A","y":3,"x":12,"dx":1.75},
    {"key":"ESC","make":"76","break":"F0,76","y":0,"x":0,"dx":1.5},
    {"key":"F1","make":"5","break":"F0,05","y":0,"x":1,"dx":1},
    {"key":"F2","make":"6","break":"F0,06","y":0,"x":2,"dx":1},
    {"key":"F3","make":"4","break":"F0,04","y":0,"x":3,"dx":1},
    {"key":"F4","make":"0C","break":"F0,0C","y":0,"x":4,"dx":1},
    {"key":"F5","make":"3","break":"F0,03","y":0,"x":5,"dx":1},
    {"key":"F6","make":"0B","break":"F0,0B","y":0,"x":6,"dx":1},
    {"key":"F7","make":"83","break":"F0,83","y":0,"x":7,"dx":1},
    {"key":"F8","make":"0A","break":"F0,0A","y":0,"x":8,"dx":1},
    {"key":"F9","make":"1","break":"F0,01","y":0,"x":9,"dx":1},
    {"key":"F10","make":"9","break":"F0,09","y":0,"x":10,"dx":1},
    {"key":"F11","make":"78","break":"F0,78","y":0,"x":11,"dx":1},
    {"key":"F12","make":"7","break":"F0,07","y":0,"x":12,"dx":1},
    {"key":"PRNT ","make":"E0,12, ","break":"E0,F0, ","y":null,"x":null,"dx":null},
    {"key":"SCRN","make":"E0,7C ","break":"7C,E0, F0,12 ","y":null,"x":null,"dx":null},
    {"key":"SCROLL","make":"7E","break":"F0,7E","y":null,"x":null,"dx":null},
    {"key":"PAUSE","make":"E1,14,77, E1,F0,14, F0,77","break":"","y":null,"x":null,"dx":null},
    {"key":"[","make":"54","break":"FO,54","y":2,"x":11,"dx":1},
    {"key":"INSERT","make":"E0,70","break":"E0,F0,70","y":null,"x":null,"dx":null},
    {"key":"HOME","make":"E0,6C","break":"E0,F0,6C","y":null,"x":null,"dx":null},
    {"key":"PG UP","make":"E0,7D","break":"E0,F0,7D","y":null,"x":null,"dx":null},
    {"key":"DELETE","make":"E0,71","break":"E0,F0,71","y":null,"x":null,"dx":null},
    {"key":"END","make":"E0,69","break":"E0,F0,69","y":null,"x":null,"dx":null},
    {"key":"PG DN","make":"E0,7A","break":"E0,F0,7A","y":null,"x":null,"dx":null},
    {"key":"U ARROW","make":"E0,75","break":"E0,F0,75","y":5,"x":6,"dx":1},
    {"key":"L ARROW","make":"E0,6B","break":"E0,F0,6B","y":5,"x":8,"dx":1},
    {"key":"D ARROW","make":"E0,72","break":"E0,F0,72","y":5,"x":7,"dx":1},
    {"key":"R ARROW","make":"E0,74","break":"E0,F0,74","y":5,"x":9,"dx":1},
    {"key":"NUM","make":"77","break":"F0,77","y":null,"x":null,"dx":null},
    {"key":"KP /","make":"E0,4A","break":"E0,F0,4A","y":null,"x":null,"dx":null},
    {"key":"KP *","make":"7C","break":"F0,7C","y":null,"x":null,"dx":null},
    {"key":"KP -","make":"7B","break":"F0,7B","y":null,"x":null,"dx":null},
    {"key":"KP +","make":"79","break":"F0,79","y":null,"x":null,"dx":null},
    {"key":"KP EN","make":"E0,5A","break":"E0,F0,5A","y":null,"x":null,"dx":null},
    {"key":"KP .","make":"71","break":"F0,71","y":null,"x":null,"dx":null},
    {"key":"KP 0","make":"70","break":"F0,70","y":null,"x":null,"dx":null},
    {"key":"KP 1","make":"69","break":"F0,69","y":null,"x":null,"dx":null},
    {"key":"KP 2","make":"72","break":"F0,72","y":null,"x":null,"dx":null},
    {"key":"KP 3","make":"7A","break":"F0,7A","y":null,"x":null,"dx":null},
    {"key":"KP 4","make":"6B","break":"F0,6B","y":null,"x":null,"dx":null},
    {"key":"KP 5","make":"73","break":"F0,73","y":null,"x":null,"dx":null},
    {"key":"KP 6","make":"74","break":"F0,74","y":null,"x":null,"dx":null},
    {"key":"KP 7","make":"6C","break":"F0,6C","y":null,"x":null,"dx":null},
    {"key":"KP 8","make":"75","break":"F0,75","y":null,"x":null,"dx":null},
    {"key":"KP 9","make":"7D","break":"F0,7D","y":null,"x":null,"dx":null},
    {"key":"]","make":"5B","break":"F0,5B","y":2,"x":12,"dx":1},
    {"key":";","make":"4C","break":"F0,4C","y":3,"x":10,"dx":1},
    {"key":"'","make":"52","break":"F0,52","y":3,"x":11,"dx":1},
    {"key":",","make":"41","break":"F0,41","y":4,"x":8,"dx":1},
    {"key":".","make":"49","break":"F0,49","y":4,"x":9,"dx":1},
    {"key":"/","make":"4A","break":"F0,4A","y":4,"x":10,"dx":1}];


  if(!bool) {
    d3.select("body").selectAll("div.keyboard").remove();
    return;
  }

  var keyboardKeys = scanCodes.filter(function(d) { return d.x !== null && d.y !== null });
  var rows = _.groupBy(keyboardKeys, 'y');
  rows = Object.keys(rows).map(function(y) { return _.sortBy(rows[y], 'x'); })
  var keyboardWidth = _.max(rows.map(function(y) {
      return y.reduce(function(mem, key) {
        return mem + key.dx;
      }, 0);
    }));

  var xScale = d3.scale.linear().range(["0px", (window.innerWidth / keyboardWidth)+"px"]);

  // create or select existing keyboard
  var keyboard = d3.select("body").selectAll("div.keyboard").data([keyboardKeys])
  keyboard.enter().append("div.keyboard")
    .selectAll(".keyRow")
      .data(rows)
      .enter()
      .append("div.keyRow")
    .selectAll(".key")
      .data(_.identity)
      .enter()
      .append("div.key")
      .style("display", "inline-block")
      .style("width", _.compose(xScale, ƒ('dx')))
      .style("height", xScale.range()[1])
      .append("div.key-inner")
      // .text(ƒ('key'));

  function drawKey(e) {

    // get the key
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);
    var keySel = d3.selectAll(".key").filter(function(d) { return d.key === String.fromCharCode(key) });
    var scanType = (d3.event.type == "keydown" || d3.event.type == "keypress" ? "make" : "break");

    // random path for scancode to spin out
    var driftX = (Math.random()*300).toFixed();
    var driftY = (Math.random()*300).toFixed();
    var driftθ = (Math.random()*360-180).toFixed();

    // color is random shade of green for make, red for break
    var colors = {
      "make": d3.scale.linear().range(["#006600", "#33FF66"]),
      "break": d3.scale.linear().range(["#990000","#FF3366"])
    };
    var color = colors[scanType](Math.random());

    // scancodes pour out of the keys
    keySel.append("div.key-event").text(ƒ(scanType))
      .style("color", color)
      .transition()
      .duration(2000)
      .style("transform", "rotate(" + driftθ + "deg) translate("+ driftX +"px, " + driftY + "px)")
      .style("opacity",0)
      .remove();

    // light up key background for a moment w/ a random pretty color
    keySel.style("background-color", d3.hsl(Math.floor(Math.random()*180), .8, .8))
      .transition()
      .duration(300)
      .style("background-color", "rgba(255,255,255,0)");

  }

}

// based on http://bl.ocks.org/mbostock/1005873
// & http://mbostock.github.io/d3/talk/20111018/partition.html
function treeMe(sel, node) {

  var w = 1120,
      h = 600,
      x = d3.scale.linear().range([0, w]),
      y = d3.scale.linear().range([0, h]);

  var tree = sel.append("div")
      .attr("class", "dom-tree")
      .style("width", w + "px")
      .style("height", h + "px");

  var partition = d3.layout.partition()
      .sort(null)
      .value(function(d) { return d.size; });

  var root = getDomTree(node);

  var rect = tree.selectAll("div");

  rect = rect
      .data(partition.nodes(root))
    .enter().append("div")
      .style("left", function(d) { return x(d.y) + "px"; })
      .style("top", function(d) { return y(d.x) + "px"; })
      .style("width", function(d) { return x(d.dy) + "px"; })
      .style("height", function(d) { return y(d.dx) + "px"; })
      .classed("node", true)
      .classed("child", function(d) { return !d.children; })
      .classed("parent", function(d) { return d.children; })
      .text(function(d) { return d.children ? d.name : d.name + d.ref.innerHTML })
      .on("click", clicked);

  function clicked(d) {
    y.domain([d.x, d.x + d.dx]);
    x.domain([d.y, 1]).range([d.y ? 20 : 0, w]);

    rect
        .transition()
        .duration(750)
        .style("left", function(d) { return x(d.y) + "px"; })
        .style("top", function(d) { return y(d.x) + "px"; })
        .style("width", function(d) { return x(d.y + d.dy) - x(d.y) + "px"; })
        .style("height", function(d) { return y(d.x + d.dx) - y(d.x) + "px"; });
  }

  function getDomTree(node) {
    return {
      "name": "<"+node.nodeName+">",
      "ref": node,
      "size": node.innerHTML.length,
      "children": Array.prototype.slice.call(node.children).map(getDomTree)
    };
  }

}
treeMe(d3.select("#put-tree-here"), document.getElementById("text-2-8"));


console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");
