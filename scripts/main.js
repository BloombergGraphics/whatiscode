var originalArticle;
var loadTime = new Date();
var baseUrl = "http://sites.localhost/code";
var modules;

// local storage stuff
(function() {

  // increment visit count
  localStorage.setItem('visitCount',
    localStorage.getItem('visitCount')
    ? parseInt(localStorage.getItem('visitCount')) + 1 : 1);

  // remember time on page and last read position
  window.onunload = window.onbeforeunload = function(event) {
    localStorage.setItem('scrollTop', document.getElementsByTagName("body")[0].scrollTop);

    var timeOnPage = (+new Date()) - loadTime;
    if(localStorage.getItem('timeOnPage')) {
      timeOnPage += parseInt(localStorage.getItem('timeOnPage'));
    }
    localStorage.setItem('timeOnPage', timeOnPage);

    return;
  }
})();

// insert modules
(function() {
  modules = [
    {
      "name": "certificate",
      "string": null,
      "tweet": "Something something click this interactive"
    },
    {
      "name": "circuit",
      "string": "A computer is a clock with benefits",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "crapplets",
      "string": "soon called “crapplets”",
      "tweet": ""
    },
    {
      "name": "debug",
      "string": "I felt that each time the program crashed",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "gcd",
      "string": "Euclid’s algorithm, for example",
      "tweet": ""
    },
    {
      "name": "grabbag",
      "string": "standard library has functions",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "keyboard",
      "string": "strike a key on your keyboard",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "languages",
      "string": null,
      "tweet": ""
    },
    {
      "name": "learninal",
      "string": "Programming as a career can lead to a rewarding",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "livehtml",
      "string": "To gather an e-mail address and a name",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "maps",
      "string": "By the time a language breaks through to the top 10 or 20",
      "tweet": ""
    },
    {
      "name": "mouse",
      "string": "A mouse moves",
      "tweet": ""
    },
    {
      "name": "paperclip",
      "string": null,
      "tweet": ""
    },
    {
      "name": "paulbot",
      "string": null,
      "tweet": ""
    },
    {
      "name": "recirc",
      "string": null,
      "tweet": ""
    },
    {
      "name": "shoppingcart",
      "string": null,
      "tweet": ""
    },
    {
      "name": "text-diff",
      "string": "In my opinion, version control",
      "tweet": ""
    },
    {
      "name": "tinder",
      "string": "even if the code starts to look ugly",
      "tweet": "Something something click this interactive"
    },
    {
      "name": "toc",
      "string": null,
      "tweet": ""
    },
    {
      "name": "tree",
      "string": "Arbor Day",
      "tweet": "Something something click this interactive"
    }
  ];

  // modules.forEach(function(value, index) {
  //   if(!value.string) return;
  //   if($('[data-module="'+value.name+'"]').length !== 0) return;
  //   $('p:contains("'+value.string+'")').after('<div data-module="'+value.name+'"></div>');
  // })
})();

jQuery(document).ready(function($) {

  // preprocess org-mode html and append events
  footnotes();

  // preprocess org-mode html
  preCode();

  // set up toc toggle
  d3.select("#toc-bug")
    .on("click", function(d,i) {
      if(d3.select("#toc").attr("data-mode") === "on") {
        d3.select(this).attr("data-mode", "off");
        d3.select("#toc").attr("data-mode", "off");
      } else {
        d3.select(this).attr("data-mode", "on");
        d3.select("#toc").attr("data-mode", "on");
      }
    });

  // syntax highlighting
  hljs.initHighlightingOnLoad();
  $("body").on("mouseover mouseout", "code.hljs span", highlightTooltip);

  // save uncontaminated version for reset ability
  originalArticle = $("article").html();

});

function highlightTooltip(e) {
  if (!(e.target === this)) return

  if(e.type=="mouseout") {
    d3.select("body").selectAll(".syntax-tooltip").remove();
    return;
  }

  var codeClass = this.getAttribute('class');
  var codeClasses = {
    "hljs-keyword": "Language keywords mean something special in the language.",
    "hljs-number": "A number",
    "hljs-title": "A title names something, like a function in C or element in XML",
    "hljs-params": "The parameters that get passed to the function",
    "hljs-function": "A function declaration",
    "hljs-built_in": "A built-in function",
    "hljs-string": "This is a string; it may mean something to you, but to the computer it's pretty much just an arbitrary sequence of letters.",
    "hljs-list": "A list",
    "hljs-tag": "A tag",
    "hljs-attribute": "The name of an attribute",
    "hljs-value": "The value of an attribute",
    "hljs-import": "An import lets you use code written somewhere else",
    "hljs-class": "A class",
    "hljs-container": "A container",
    "hljs-type": "A type",
    "hljs-variable": "A variable"
  }

  var popup = d3.select("body").selectAll(".syntax-tooltip").data([codeClass]);
  popup.enter().append("div").classed("syntax-tooltip", true);
  popup.text(codeClasses[codeClass])
    .style("left", this.getBoundingClientRect().left + this.getBoundingClientRect().width/2 +"px")
    .style("top", (this.getBoundingClientRect().bottom + document.getElementsByTagName("body")[0].scrollTop) +"px");
}


function footnotes() {

  // read footnotes out of footer and stick into hidden popup divs
  (function() {
    var footrefs = $(".footref").unwrap();
    var footnotes = $(".footdef");
    footnotes.each(function(i, fn) {
      var fnId = $(fn).find("a").eq(0).attr("id").split(".")[1];
      $(fn).attr("data-fn-id", fnId);

      var footref = $(document.getElementById("fnr."+fnId));
      footref.wrap("<div class='footwrapper'></div>");
      footref.attr("data-fn-id", fnId);
      footref.parent().attr("data-fn-id", fnId);

      var fnContent = $(fn).html().split("</sup> ")[1];
      footref.parent().append("<div class='fn-popup'>" + fnContent + "</div>");
    });
  })();

  // Footnote popups
  d3.selectAll(".footref")
    .on("mouseover", showFootnote)
    .on("mouseout", hideFootnote)
    .on("click", toggleFootnote)

  function showFootnote(d,i) {
    var popup = d3.select(this.parentElement).select(".fn-popup");
    if(!popup.classed("stick")) {
      popup
        .style("opacity", 0)
        .style("display", "block")
        .transition()
        .duration(300)
        .style("opacity", 1);
      return;
    } else {
      return;
    }

  }

  function hideFootnote(d,i) {
    var popup = d3.select(this.parentElement).select(".fn-popup");
    if(!popup.classed("stick")) {
      popup
        .transition()
        .duration(300)
        .style("opacity", 0)
        .transition()
        .style("display", "none");
      return;
    } else {
      return;
    }
  }

  // toggle stickiness
  function toggleFootnote(d,i) {
    d3.event.preventDefault();
    var popup = d3.select(this.parentElement).select(".fn-popup")
    popup.classed("stick", !popup.classed("stick"));
  }

}

function preCode() {
  $("pre").each(function(i, pre) {
    if($(pre).find("code").length === 0) {
      $(pre).html("<code>"+$(pre).html()+"</code>");
    }
  })
}









//sry - ARP
//// no i'm sry - TT
// console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");
