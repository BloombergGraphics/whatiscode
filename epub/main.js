var originalArticle;
var loadTime = new Date();
var baseUrl = "http://bloomberg.com/graphics/2015-paul-ford-what-is-code/";

var modules = [
    {
      "name": "certificate",
      "tweet": ""
    },
    {
      "name": "circuit",
      "tweet": "What *is* a computer? It's just clock with benefits! Try playing with this circuitry simulator:"
    },
    {
      "name": "crapplets",
      "tweet": ""
    },
    {
      "name": "debug",
      "tweet": "Debugging code is totally fun! Why would anyone complain about debugging code?"
    },
    {
      "name": "gcd",
      "tweet": ""
    },
    {
      "name": "grabbag",
      "tweet": "Have you ever wanted to destroy a web page? This is your chance. Go crazy:"
    },
    {
      "name": "keyboard",
      "tweet": "How do you type an 'A' ? For a computer, it's more complicated than you'd think:"
    },
    {
      "name": "learninal",
      "tweet": "This is the least-boring code tutorial of all time:"
    },
    {
      "name": "livehtml",
      "tweet": "This crazy @business article about code let me mess with HTML and break stuff:"
    },
    {
      "name": "maps",
      "tweet": ""
    },
    {
      "name": "mouse",
      "tweet": ""
    },
    {
      "name": "paulbot",
      "tweet": ""
    },
    {
      "name": "text-diff",
      "tweet": ""
    },
    {
      "name": "tinder",
      "tweet": "There's sexy code and there's ugly code. Play Tinder for code to see if you can tell the difference."
    },
    {
      "name": "toc",
      "tweet": ""
    },
    {
      "name": "tree",
      "tweet": "Coders think in trees. Anything made with software is secretly a tree. It makes sense if you check this out:"
    }
  ];

jQuery(document).ready(function($) {

  // preprocess org-mode html and append events
  footnotes();

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
    "hljs-title": "A title names something, like a function in C or an element in XML",
    "hljs-params": "The parameters that get passed to the function",
    "hljs-function": "A function declaration",
    "hljs-built_in": "A built-in function",
    "hljs-string": "This is a string; it may mean something to you, but to the computer it’s pretty much just an arbitrary sequence of letters.",
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

  if(typeof codeClasses[codeClass] === 'undefined') return;

  var popup = d3.select("body").selectAll(".syntax-tooltip").data([codeClass]);
  popup.enter().append("div").classed("syntax-tooltip", true);
  popup.text(codeClasses[codeClass])
    .style("left", this.getBoundingClientRect().left + this.getBoundingClientRect().width/2 +"px")
    .style("top", (this.getBoundingClientRect().bottom + document.getElementsByTagName("body")[0].scrollTop) +"px");
}


function footnotes() { 
  var isMobile = innerWidth < 800

  // read footnotes out of footer and stick into hidden popup divs
  !(function() {
    var footrefs = $(".footref:not(.correx)").unwrap();
    var footnotes = $(".footdef");
    footnotes.each(function(i, fn) {
      var fnId = $(fn).find("a").eq(0).attr("id").split(".")[1];
      $(fn).attr("data-fn-id", fnId);

      var footref = $(document.getElementById("fnr."+fnId));
      footref.wrap("<div class='footwrapper'></div>");
      footref.attr("data-fn-id", fnId);
      footref.parent().attr("data-fn-id", fnId);

      var fnContent = $(fn).html().split("</sup>")[1];
      footref.parent().append("<div class='fn-popup'>" + fnContent + "</div>");
    });
  })();

  // Footnote popups
  d3.selectAll(".footref")
    .on("mouseover", showFootnote)
    .on("mouseout", hideFootnote)
    .on("click", toggleFootnote)
    .on("touchend", toggleFootnote)

  d3.selectAll('fn-popup')
    .on('touchend', toggleFootnote)

  function showFootnote(d,i) {
    var popup = d3.select(this.parentElement).select(".fn-popup");
    if(!popup.classed("stick") || isMobile) {
      popup
        .style("opacity", 0)
        .style("display", "block")
        .transition().duration(300)
        .style("opacity", 1);
    }

     d3.select(this.parentElement)
         .style('position', isMobile ? 'static' : 'relative')

     var bb = this.getBoundingClientRect()
     if (isMobile){
       popup
           .style('top', bb.top + scrollY + 20 + 'px')
           .style('left', 160 + 'px')
     } else{
      popup
          .style('top', '')
          .style('left', '')
     }


  }

  function hideFootnote(d,i) {
    var popup = d3.select(this.parentElement).select(".fn-popup");
    if(!popup.classed("stick")) {
      popup
        .transition().duration(300)
        .style("opacity", 0)
        .transition().duration(0)
        .style("display", "none");
    } 
  }

  // toggle stickiness
  function toggleFootnote(d,i) {
    d3.event.preventDefault();
    var popup = d3.select(this.parentElement).select(".fn-popup")
    var isStuck = !popup.classed("stick");
    d3.select(this).classed("stick", isStuck);
    popup.classed("stick", isStuck);
    popup.classed("stick") ? showFootnote.call(this) : hideFootnote.call(this)
  }

}

console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
