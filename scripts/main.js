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
  console.log(time);
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
