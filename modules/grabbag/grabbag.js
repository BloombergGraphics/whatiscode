!(function(){

  var module = {sel: d3.select('[data-module="grabbag"]')}
  addModule(module)

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "I am made of code and I have a standard library of functions of my own. I can speak, run code, make sliders, and give you options."
    },
    {"prompts": [
      {"prompt": "Destroy the page", do: destroyPage },
      {"prompt": "Mess with styles", do: roulette },
      {"prompt": "Rewrite the article", do: rewrite },
    ]}
  ]

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  module.oninit = function() {
    module.bot.mode("on").dialogue(dialogue);
  }

  function destroyPage() {
    // setInterval(function() {
    //   var $el = $('body');
    //   while($el.children().length > 0) {
    //     $el = $el.children().eq(0);
    //   }
    //   $el.remove();
    // },100);

    var firstDestroy = d3.select('#outline-container-sec-3-4').node()
    d3.selectAll('#outline-container-sec-3-4').selectAll('h3, p, img, svg, table, .figureInline, .org-src-container, dl, .bot, .screen')
        .transition().delay(function(d, i){ return i*50 })
          .style('display', 'none')
          .style('opacity', '0')

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
