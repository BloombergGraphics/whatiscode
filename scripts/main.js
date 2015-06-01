var originalArticle;
var loadTime = new Date();

if(!localStorage.getItem('visitCount')) {
  localStorage.setItem('visitCount', 1);
} else {
  localStorage.setItem('visitCount', parseInt(localStorage.getItem('visitCount'))+1);
}

jQuery(document).ready(function($) {

  // preprocessing org-mode html
  footnotesToAsides();
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


function footnotesToAsides() {
  var footrefs = $(".footref").unwrap();
  var footnotes = $(".footdef");
  footnotes.each(function(i, fn) {
    $(fn).attr("data-fn-id", $(fn).find("a").eq(0).attr("id").split(".")[1]);
  });
}

function preCode() {
  $("pre").each(function(i, pre) {
    if($(pre).find("code").length === 0) {
      $(pre).html("<code>"+$(pre).html()+"</code>");
    }
  })
}

// Footnote popups
d3.selectAll(".footref").on("click", function() {
  d3.event.preventDefault();

  var fnId = this.getAttribute("href").split(".")[1];
  var popup = d3.select("body").selectAll(".paulnote-popup");
  var data = fnId === popup.data()[0] ? [] : [fnId];

  popup = popup.data(data, function(d) { return d; });
  popup.exit().remove();
  popup.enter().append("div").classed("paulnote-popup", true)
    .html(document.querySelector("[data-fn-id='"+fnId+"']").innerHTML)
    .style("left", this.getBoundingClientRect().left + this.getBoundingClientRect().width/2 +"px")
    .style("top", (this.getBoundingClientRect().bottom + document.getElementsByTagName("body")[0].scrollTop) +"px");
})

function resetArticle() {
  $("article").html(originalArticle);
  d3.select("body").style("background-color", "inherit");
  d3.select("body").style("color", "inherit");
}

console.log("                    ___\n                _.-'   ```'--.._                 _____ ___ ___   ____  _____ __ __      ______  __ __    ___  \n              .'                `-._            / ___/|   |   | /    |/ ___/|  |  |    |      ||  |  |  /  _] \n             /                      `.         (   \\_ | _   _ ||  o  (   \\_ |  |  |    |      ||  |  | /  [_        \n            /                         `.        \\__  ||  \\_/  ||     |\\__  ||  _  |    |_|  |_||  _  ||    _]       \n           /                            `.      /  \\ ||   |   ||  _  |/  \\ ||  |  |      |  |  |  |  ||   [_        \n          :       (                       \\     \\    ||   |   ||  |  |\\    ||  |  |      |  |  |  |  ||     |       \n          |    (   \\_                  )   `.    \\___||___|___||__|__| \\___||__|__|      |__|  |__|__||_____|       \n          |     \\__/ '.               /  )  ;  \n          |   (___:    \\            _/__/   ;    ____   ____  ______  ____   ____   ____  ____      __  __ __  __ __ \n          :       | _  ;          .'   |__) :   |    \\ /    ||      ||    \\ |    | /    ||    \\    /  ]|  |  ||  |  |\n           :      |` \\ |         /     /   /    |  o  )  o  ||      ||  D  ) |  | |  o  ||  D  )  /  / |  |  ||  |  |\n            \\     |_  ;|        /`\\   /   /     |   _/|     ||_|  |_||    /  |  | |     ||    /  /  /  |  _  ||  ~  |\n             \\    ; ) :|       ;_  ; /   /      |  |  |  _  |  |  |  |    \\  |  | |  _  ||    \\ /   \\_ |  |  ||___, |\n              \\_  .-''-.       | ) :/   /       |  |  |  |  |  |  |  |  .  \\ |  | |  |  ||  .  \\\\     ||  |  ||     |\n             .-         `      .--.'   /        |__|  |__|__|  |__|  |__|\\_||____||__|__||__|\\_| \\____||__|__||____/ \n            :         _.----._     `  < \n            :       -'........'-       `.\n             `.        `''''`           ;\n               `'-.__                  ,'\n                     ``--.   :'-------'\n                         :   :\n                        .'   '.\n      \n      \n                                                                    ");
