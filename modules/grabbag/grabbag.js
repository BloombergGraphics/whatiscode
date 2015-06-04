!(function(){

  var module = {sel: d3.select('[data-module="grabbag"]')}
  addModule(module)

  var dialogue = [
    {"speak": "In the process of building this page, we built Paulbot with a 'standard library' of his own. I can speak, run code, make sliders, test conditions, and give you options."},
    {"prompts": [
      {"prompt": "Destroy the page", do: destroyPage },
      {"prompt": "Mess with styles", do: roulette },
      {"prompt": "Rewrite the article", do: rewrite },
    ]}
  ]

  module.bot = bot();
  module.sel.append("div.bot.aside").call(module.bot);

  module.onload = function() {
    module.bot.mode("on").dialogue(dialogue);
  }

  function destroyPage() {
    setInterval(function() {
      var $el = $('body');
      while($el.children().length > 0) {
        $el = $el.children().eq(0);
      }
      $el.remove();
    },100);
  }

  function roulette(time) {
    if (!time) time = 1;
    if (time>500) return;
    randomize();
    setTimeout(function() {roulette(time*1.1)}, time);

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

})();
