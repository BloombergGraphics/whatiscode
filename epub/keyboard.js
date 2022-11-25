!(function(){

  var module = {sel: d3.select('[data-module="keyboard"]')}
  addModule(module)

  var dialogue = [
    {
      "emote": "keyboardmash_rest",
      "speak": "Try mashing the keys on your keyboard and see what “make” and “break” codes emerge. Every key makes a code. The computer interprets these codes. There are many steps between pressing the “a” key and seeing an “a” on the screen."
    }
  ];

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  module.oninit = function() { module.bot.dialogue(dialogue); };
  module.onload = function() { keyboardEvents(true); };
  module.onunload = function() { keyboardEvents(false); };

  function keyboardEvents(bool) {
    if(this.state === bool) {
      return;
    } else {
      this.state = bool;
    }

    var eventHandlers = {
      "keydown": typeKey,
      "keyup": typeKey,
    };

    for(var eventName in eventHandlers) {
      if(bool) {
        d3.select(window).on(eventName+".logger", eventHandlers[eventName]);
      } else {
        d3.select(window).on(eventName+".logger", null);
      }
    }

    var scanCodes = [
      {"key":"A","make":"1C","break":"F0,1C","y":3,"x":1,"dx":1, "keycode":65},
      {"key":"B","make":"32","break":"F0,32","y":4,"x":5,"dx":1, "keycode":66},
      {"key":"C","make":"21","break":"F0,21","y":4,"x":3,"dx":1, "keycode":67},
      {"key":"D","make":"23","break":"F0,23","y":3,"x":3,"dx":1, "keycode":68},
      {"key":"E","make":"24","break":"F0,24","y":2,"x":3,"dx":1, "keycode":69},
      {"key":"F","make":"2B","break":"F0,2B","y":3,"x":4,"dx":1, "keycode":70},
      {"key":"G","make":"34","break":"F0,34","y":3,"x":5,"dx":1, "keycode":71},
      {"key":"H","make":"33","break":"F0,33","y":3,"x":6,"dx":1, "keycode":72},
      {"key":"I","make":"43","break":"F0,43","y":2,"x":8,"dx":1, "keycode":73},
      {"key":"J","make":"3B","break":"F0,3B","y":3,"x":7,"dx":1, "keycode":74},
      {"key":"K","make":"42","break":"F0,42","y":3,"x":8,"dx":1, "keycode":75},
      {"key":"L","make":"4B","break":"F0,4B","y":3,"x":9,"dx":1, "keycode":76},
      {"key":"M","make":"3A","break":"F0,3A","y":4,"x":7,"dx":1, "keycode":77},
      {"key":"N","make":"31","break":"F0,31","y":4,"x":6,"dx":1, "keycode":78},
      {"key":"O","make":"44","break":"F0,44","y":2,"x":9,"dx":1, "keycode":79},
      {"key":"P","make":"4D","break":"F0,4D","y":2,"x":10,"dx":1, "keycode":80},
      {"key":"Q","make":"15","break":"F0,15","y":2,"x":1,"dx":1, "keycode":81},
      {"key":"R","make":"2D","break":"F0,2D","y":2,"x":4,"dx":1, "keycode":82},
      {"key":"S","make":"1B","break":"F0,1B","y":3,"x":2,"dx":1, "keycode":83},
      {"key":"T","make":"2C","break":"F0,2C","y":2,"x":5,"dx":1, "keycode":84},
      {"key":"U","make":"3C","break":"F0,3C","y":2,"x":7,"dx":1, "keycode":85},
      {"key":"V","make":"2A","break":"F0,2A","y":4,"x":4,"dx":1, "keycode":86},
      {"key":"W","make":"1D","break":"F0,1D","y":2,"x":2,"dx":1, "keycode":87},
      {"key":"X","make":"22","break":"F0,22","y":4,"x":2,"dx":1, "keycode":88},
      {"key":"Y","make":"35","break":"F0,35","y":2,"x":6,"dx":1, "keycode":89},
      {"key":"Z","make":"1A","break":"F0,1A","y":4,"x":1,"dx":1, "keycode":90},
      {"key":"0","make":"45","break":"F0,45","y":1,"x":10,"dx":1, "keycode":48},
      {"key":"1","make":"16","break":"F0,16","y":1,"x":1,"dx":1, "keycode":49},
      {"key":"2","make":"1E","break":"F0,1E","y":1,"x":2,"dx":1, "keycode":50},
      {"key":"3","make":"26","break":"F0,26","y":1,"x":3,"dx":1, "keycode":51},
      {"key":"4","make":"25","break":"F0,25","y":1,"x":4,"dx":1, "keycode":52},
      {"key":"5","make":"2E","break":"F0,2E","y":1,"x":5,"dx":1, "keycode":53},
      {"key":"6","make":"36","break":"F0,36","y":1,"x":6,"dx":1, "keycode":54},
      {"key":"7","make":"3D","break":"F0,3D","y":1,"x":7,"dx":1, "keycode":55},
      {"key":"8","make":"3E","break":"F0,3E","y":1,"x":8,"dx":1, "keycode":56},
      {"key":"9","make":"46","break":"F0,46","y":1,"x":9,"dx":1, "keycode":57},
      {"key":"`","make":"0E","break":"F0,0E","y":1,"x":0,"dx":1, "keycode":192},
      {"key":"-","make":"4E","break":"F0,4E","y":1,"x":11,"dx":1, "keycode":189},
      {"key":"=","make":"55","break":"FO,55","y":1,"x":12,"dx":1, "keycode":187},
      {"key":"\\","make":"5D","break":"F0,5D","y":2,"x":13,"dx":1, "keycode":220},
      {"key":"BKSP","make":"66","break":"F0,66","y":1,"x":13,"dx":1.5,"keycode":8},
      {"key":"SPACE","make":"29","break":"F0,29","y":5,"x":3,"dx":5,"keycode":32},
      {"key":"TAB","make":"0D","break":"F0,0D","y":2,"x":0,"dx":1.5,"keycode":9},
      {"key":"CAPS","make":"58","break":"F0,58","y":3,"x":0,"dx":1.75,"keycode":20},
      {"key":"L SHFT","make":"12","break":"FO,12","y":4,"x":0,"dx":2.25,"keycode":16},
      {"key":"L CTRL","make":"14","break":"FO,14","y":5,"x":0,"dx":2,"keycode":17},
      {"key":"L GUI","make":"E0,1F","break":"E0,F0,1F","y":null,"x":null,"dx":null},
      {"key":"L ALT","make":"11","break":"F0,11","y":5,"x":1,"dx":2,"keycode":18},
      {"key":"R SHFT","make":"59","break":"F0,59","y":4,"x":11,"dx":2.25},
      {"key":"R CTRL","make":"E0,14","break":"E0,F0,14","y":null,"x":null,"dx":null},
      {"key":"R GUI","make":"E0,27","break":"E0,F0,27","y":null,"x":null,"dx":null},
      {"key":"R ALT","make":"E0,11","break":"E0,F0,11","y":5,"x":5,"dx":1.5},
      {"key":"APPS","make":"E0,2F","break":"E0,F0,2F","y":null,"x":null,"dx":null},
      {"key":"ENTER","make":"5A","break":"F0,5A","y":3,"x":12,"dx":1.75,"keycode":13},
      {"key":"ESC","make":"76","break":"F0,76","y":0,"x":0,"dx":1.5,"keycode":27},
      {"key":"F1","make":"5","break":"F0,05","y":0,"x":1,"dx":1,"keycode":112},
      {"key":"F2","make":"6","break":"F0,06","y":0,"x":2,"dx":1,"keycode":113},
      {"key":"F3","make":"4","break":"F0,04","y":0,"x":3,"dx":1,"keycode":114},
      {"key":"F4","make":"0C","break":"F0,0C","y":0,"x":4,"dx":1,"keycode":115},
      {"key":"F5","make":"3","break":"F0,03","y":0,"x":5,"dx":1,"keycode":116},
      {"key":"F6","make":"0B","break":"F0,0B","y":0,"x":6,"dx":1,"keycode":117},
      {"key":"F7","make":"83","break":"F0,83","y":0,"x":7,"dx":1,"keycode":118},
      {"key":"F8","make":"0A","break":"F0,0A","y":0,"x":8,"dx":1,"keycode":119},
      {"key":"F9","make":"1","break":"F0,01","y":0,"x":9,"dx":1,"keycode":120},
      {"key":"F10","make":"9","break":"F0,09","y":0,"x":10,"dx":1,"keycode":121},
      {"key":"F11","make":"78","break":"F0,78","y":0,"x":11,"dx":1,"keycode":122},
      {"key":"F12","make":"7","break":"F0,07","y":0,"x":12,"dx":1,"keycode":123},
      {"key":"PRNT ","make":"E0,12, ","break":"E0,F0, ","y":null,"x":null,"dx":null},
      {"key":"SCRN","make":"E0,7C ","break":"7C,E0, F0,12 ","y":null,"x":null,"dx":null},
      {"key":"SCROLL","make":"7E","break":"F0,7E","y":null,"x":null,"dx":null,"keycode":145},
      {"key":"PAUSE","make":"E1,14,77, E1,F0,14, F0,77","break":"","y":null,"x":null,"dx":null,"keycode":19},
      {"key":"[","make":"54","break":"FO,54","y":2,"x":11,"dx":1, "keycode":219},
      {"key":"INSERT","make":"E0,70","break":"E0,F0,70","y":null,"x":null,"dx":null,"keycode":45},
      {"key":"HOME","make":"E0,6C","break":"E0,F0,6C","y":null,"x":null,"dx":null,"keycode":36},
      {"key":"PG UP","make":"E0,7D","break":"E0,F0,7D","y":null,"x":null,"dx":null,"keycode":33},
      {"key":"DELETE","make":"E0,71","break":"E0,F0,71","y":null,"x":null,"dx":null,"keycode":46},
      {"key":"END","make":"E0,69","break":"E0,F0,69","y":null,"x":null,"dx":null,"keycode":35},
      {"key":"PG DN","make":"E0,7A","break":"E0,F0,7A","y":null,"x":null,"dx":null,"keycode":34},
      {"key":"↑","make":"E0,75","break":"E0,F0,75","y":5,"x":6,"dx":1,"keycode":38},
      {"key":"←","make":"E0,6B","break":"E0,F0,6B","y":5,"x":8,"dx":1,"keycode":37},
      {"key":"↓","make":"E0,72","break":"E0,F0,72","y":5,"x":7,"dx":1,"keycode":40},
      {"key":"→","make":"E0,74","break":"E0,F0,74","y":5,"x":9,"dx":1,"keycode":39},
      {"key":"NUM","make":"77","break":"F0,77","y":null,"x":null,"dx":null,"keycode":144},
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
      {"key":"]","make":"5B","break":"F0,5B","y":2,"x":12,"dx":1, "keycode":221},
      {"key":";","make":"4C","break":"F0,4C","y":3,"x":10,"dx":1, "keycode":186},
      {"key":"'","make":"52","break":"F0,52","y":3,"x":11,"dx":1, "keycode":222},
      {"key":",","make":"41","break":"F0,41","y":4,"x":8,"dx":1, "keycode":188},
      {"key":".","make":"49","break":"F0,49","y":4,"x":9,"dx":1, "keycode":190},
      {"key":"/","make":"4A","break":"F0,4A","y":4,"x":10,"dx":1, "keycode":191}];


    var keyboardKeys = scanCodes.filter(function(d) { return d.x !== null && d.y !== null });
    var rows = _.groupBy(keyboardKeys, 'y');
    rows = Object.keys(rows).map(function(y) { return _.sortBy(rows[y], 'x'); })
    var keyboardWidth = _.max(rows.map(function(y) {
        return y.reduce(function(mem, key) {
          return mem + key.dx;
        }, 0);
      }));

    var xScale = d3.scale.linear().range(["0px", (module.sel.node().offsetWidth / keyboardWidth)+"px"]);

    // create or select existing keyboard
    var keyboard = module.sel.selectAll("div.keyboard").data([keyboardKeys])
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
        .on("mousedown", clickKey)
        .on("mouseup", clickKey)
        .append("div.key-inner")
        .text(ƒ('key'));

    d3.select(window).on('resize.keyboard', redrawKeyboard)
    function redrawKeyboard() {
      xScale = d3.scale.linear().range(["0px", (module.sel.node().offsetWidth / keyboardWidth)+"px"]);
      keyboard.selectAll(".key")
        .style("width", _.compose(xScale, ƒ('dx')))
        .style("height", xScale.range()[1]);
    }

    function typeKey(e) {
      // Get the key code
      var key = d3.event.keyCode || d3.event.which;
      
      //Overriding Firefox key codes and setting them to those of other browsers.
      if (key === 59) key = 186;
      else if (key === 61) key = 187;
      else if (key === 173) key = 189;

      var keySel = module.sel.selectAll(".key").filter(function(d) { return d.keycode === key });
      var scanType = d3.event.type == "keydown" ? "make" : "break";
      drawKey(keySel, scanType);
    }

    function clickKey(e) {
      var scanType = (d3.event.type == "mousedown" ? "make" : "break");
      drawKey(d3.select(this), scanType);
    }

    var timeSinceLastKeyTimeout;
    function drawKey(keySel, scanType) {

      module.bot.emote("keyboardmash");
      clearInterval(timeSinceLastKeyTimeout);
      timeSinceLastKeyTimeout = setTimeout(function () {
        module.bot.emote("keyboardmash_rest");
      }, 500);

      // random path for scancode to spin out
      var driftX = (Math.random()*300).toFixed();
      var driftY = (Math.random()*300).toFixed();
      var driftθ = (Math.random()*360-180).toFixed();

      // color is random shade of green for make, red for break
      var colors = {
        "make": d3.scale.linear().range(["#00c770", "#91f29b"]),
        "break": d3.scale.linear().range(["#f94600","#fec343"])
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

})();
