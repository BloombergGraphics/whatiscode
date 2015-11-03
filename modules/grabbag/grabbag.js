!(function(){

  //check on load to see if you need to be dragged back after wrecking
  if (location.hash.indexOf('grabbag') > 0){
    setTimeout(function(){
      scrollTo(0, d3.select('#grabbag').node().getBoundingClientRect().top + pageYOffset - 100)
    }, 1500)
  }

  var module = {sel: d3.select('[data-module="grabbag"]')}
  addModule(module)

  var prompts = [
        {"prompt": "Colors", do: colors },
        {"prompt": "Emotions", do: emotions },
        {"prompt": "Cowboys", do: cowboys },
        {"prompt": "Old skeletons", do: skeletons },
        {"prompt": "Wreck it all", do: mess },
        {"prompt": "Reset", do: reset },
      ];

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "I am made of code, and I have a standard library of functions of my own. Sliders and buttons and timers can get wired up to anything on the page, because the page and every object on it is code, too. Here, mess with the page:",
      "prompts": prompts
    }
  ];

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  module.oninit = function() {
    module.bot.mode("on").dialogue(dialogue);
  }

  function colors(direction) {

    if(!arguments.length) direction = true;
    // for undo
    if(!direction) {
      d3.selectAll("section").style("background-color", "#fff");
      return;
    }

    module.bot.dialogue([
      {
        "speak": "Everything on the page has style attributes, like background-color.",
        "slider": {
          "onbrush": function(value) {
            d3.selectAll("section").style("background-color", d3.hsl(value, .8, .8));
            return true;
          },
          "domain": [0, 180]
        },
        "prompts": prompts
      }
    ]);
  }

  function emotions() {
    module.bot.dialogue([
      {
        "speak": "Even my emotions are variables!",
        "slider": {
          "onbrush": function(value) {
            var scale = d3.scale.threshold()
              .domain([1/8,2/8,3/8,4/8,5/8,6/8,7/8])
              .range(['love', 'jumps', 'waving', 'chill', 'angry', 'angry2', 'angry3', 'angry4']);
            module.bot.emote(scale(value));
            return true;
          },
          "domain": [0, 1]
        },
        "prompts": prompts
      }
    ]);
  }

  function mess() {

    module.bot.dialogue([
      {
        "speak": "Now you’ve done it...",
      }
    ]);

    d3.select('article')
      .style("-ms-transform","scale(1)")
      .style("-moz-transform","scale(1)")
      .style("-webkit-transform","scale(1)")
      .style("transform","scale(1)")
      .transition()
      .duration(20000)
      .style("-ms-transform","scale(.01)")
      .style("-moz-transform","scale(.01)")
      .style("-webkit-transform","scale(.01)")
      .style("transform","scale(.01)");
    d3.selectAll('article p')
      .style("-ms-transform","rotate(0deg)")
      .style("-moz-transform","rotate(0deg)")
      .style("-webkit-transform","rotate(0deg)")
      .style("transform","rotate(0deg)")
      .transition()
      .duration(15000)
      .style("transform",function(d) { return "rotate(" + (Math.random()*360).toFixed() + "deg)"; });
    d3.selectAll('article img')
      .style("transform","rotate(0deg)")
      .transition()
      .duration(15000)
      .style("transform",function(d) { return "rotate(" + (Math.random()* -360).toFixed() + "deg)"; });
    d3.selectAll('article h2, article h3')
      .style("transform","scale(1)")
      .transition()
      .duration(15000)
      .style("transform",function(d) { return "scale(10)"; })
      .style("opacity",0);
    setTimeout(function() {
      window.location.hash = "#grabbag";
      location.reload();
    },10000)
  }

  function cowboys(direction) {
    if(!arguments.length) direction = true;
    // for undo
    if(!direction) {
      d3.selectAll("img")
        .attr("src", function(d){
          return this.getAttribute('data-src') || this.getAttribute('src')
        }).attr("data-src", null);

      return;
    }

    d3.selectAll("img")
      .attr("data-src", function(d) {return this.getAttribute('data-src') || this.getAttribute('src'); })
      .attr("src", "images/cowboy_on_computer.gif");

    module.bot.dialogue([
      {
        "speak": "Images are objects with source attributes. They’re code, and there’s code to change that! All of it.",
        "prompts": prompts
      }
    ]);
  }

  function skeletons(direction) {

    if(!arguments.length) direction = true;

    walk(document.body, direction);

    if(direction) {
      module.bot.dialogue([
        {
          "speak": "Text is variable, too! Hmm, something’s subtly different in here...",
          "prompts": prompts
        }
      ]);
    }

    // I stole this function from here:
    // https://github.com/ericwbailey/millennials-to-snake-people/blob/master/Source/content_script.js
    function walk(node, direction)
    {
      // I stole this function from here:
      // http://is.gd/mwZp7E

      var child, next;

      switch ( node.nodeType )
      {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
          child = node.firstChild;
          while ( child )
          {
            next = child.nextSibling;
            walk(child, direction);
            child = next;
          }
          break;

        case 3: // Text node
          handleText(node);
          break;
      }
    }

    function handleText(textNode) {
      if(direction) {
        textNode.nodeValue = replaceText(textNode.nodeValue);
      } else {
        textNode.nodeValue = fixText(textNode.nodeValue);
      }

    }

    function replaceText(v)
    {
      // A programmer -> An old...
      v = v.replace(/\bA\sprogrammer\b/g, "An programmer");
      v = v.replace(/\ba\sprogrammer\b/g, "an programmer");

      // Programmer
      v = v.replace(/\bProgrammer\b/g, "Old Skeleton");
      v = v.replace(/\bprogrammer\b/g, "old skeleton");
      v = v.replace(/\bProgrammers\b/g, "Old Skeletons");
      v = v.replace(/\bprogrammers\b/g, "old skeletons");
      v = v.replace(/\bProgrammers'\b/g, "Old Skeleton's");
      v = v.replace(/\bprogrammers'\b/g, "old skeleton's");

      // Coder
      v = v.replace(/\bCoder\b/g, "Bag of bones");
      v = v.replace(/\bcoder\b/g, "bag of bones");
      v = v.replace(/\bCoders\b/g, "Bags of Bones");
      v = v.replace(/\bcoders\b/g, "bags of bones");
      v = v.replace(/\bCoders'\b/g, "Bags of Bones's");
      v = v.replace(/\bcoders'\b/g, "bags of bones's");

      return v;
    }

    function fixText(v) {
      // Programmer
      v = v.replace(/\bOld\sSkeleton\b/g, "Programmer");
      v = v.replace(/\bold\sskeleton\b/g, "programmer");
      v = v.replace(/\bOld\sSkeletons\b/g, "Programmers");
      v = v.replace(/\bold\sskeletons\b/g, "programmers");
      v = v.replace(/\bOld\sSkeleton's'\b/g, "Programmers");
      v = v.replace(/\bold\sskeleton's\b/g, "programmers'");

      // Coder
      v = v.replace(/\bBag\sof\sbones\b/g, "Coder");
      v = v.replace(/\bbag\sof\sbones\b/g, "coder");
      v = v.replace(/\bBags\sof\sBones\b/g, "Coders");
      v = v.replace(/\bbags\sof\sbones\b/g, "coders");
      v = v.replace(/\bBags\sof\sBones's\b/g, "Coders'");
      v = v.replace(/\bbags\sof\sbones's\b/g, "coders'");

      // An old... -> A programmer
      v = v.replace(/\bAn\sprogrammer\b/g, "A programmer");
      v = v.replace(/\ban\sprogrammer\b/g, "a programmer");

      return v;
    }

  }

  function reset() {
    skeletons(false);
    cowboys(false);
    colors(false);

    module.bot.dialogue([
      {
        "speak": "As you were.",
        "prompts": prompts
      }
    ]);
  }

  // vestigial, half-redone...
  function destroyPage() {
    // setInterval(function() {
    //   var $el = $('body');
    //   while($el.children().length > 0) {
    //     $el = $el.children().eq(0);
    //   }
    //   $el.remove();
    // },100);

    d3.select('body').style('overflow', 'hidden')

    var firstDestroy = d3.select('#outline-container-sec-3-4').node()
    d3.selectAll('#outline-container-sec-3-4').selectAll('h3, p, img, svg, table, .bot')
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
