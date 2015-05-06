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
      "values": ["helvetica", "garamond", "times new roman", "comic sans", "verdana", "georgia", "palatino", "courier"]
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
      "values": ["rotate(0deg)","rotate(0deg)","rotate(0deg)","rotate(5deg)","rotate(-5deg)","rotate(-10deg)","rotate(10deg)","rotate(15deg)"]
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

$('#preroll').click(function() {
  $('#preroll').hide();
});

$("body").on("click", ".progress-meter", function() {
  $('#postlude').addClass('visible');
  $('#postlude video')[0].play();
});

function rewrite() {

  var speed = 1,
      n = 0;

  var articleTemplate = $("article").html(),
      styleTemplate = $("style").html();

  var article = $("article"),
      style = $("style");

  var timer = setInterval(function() {
    if(read(n,n)) {
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

  $("body").addClass("log");

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

  ["mousemove", "click"].forEach(function(eventName) {
    $("body").on(eventName, function(e) {
      d3.select("body")
        .append("div")
        .classed("event-log", true)
        .classed(eventName, true)
        .style("position", "fixed")
        .style("left", e.clientX+"px")
        .style("top", e.clientY+"px")
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
