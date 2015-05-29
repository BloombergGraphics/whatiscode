var originalArticle, paulbots = {};
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

  // create paulbot
  paulbot = bot().botName("paulbot");
  d3.select("#paulbot").call(paulbot);

  d3.selectAll("article .paulbot").each(function(d,i) {
    var uuid = "paulbot"+(Math.random()*10000).toFixed();
    paulbots[uuid] = bot().botName(uuid);
    d3.select(this).call(paulbots[uuid]);
    paulbots[uuid].dialogue(botDialogues[this.dataset.dialogue]);
  })

  // create overlay views
  var overlayViews = [
    {
      "name": "toc",
    },
    {
      "name": "recirc",
      "handler": renderRecircs,
      "data": recircs
    }
  ];

  d3.select("#bugs").selectAll(".bug")
    .data(overlayViews)
    .enter()
    .append("div")
    .classed("bug", true)
    .attr("id", function(d) { return d.name+"-bug"; })
    .each(function(d,i) {
      d.overlay = d3.select("#"+d.name);
      if(d.initialize) { d.initialize.call(d.overlay.node(), d.data, i); }
    })
    .on("click", function(d,i) {
      if(d.overlay.attr("data-mode") === "on") {
        d3.select(this).attr("data-mode", "off");
        d.overlay.attr("data-mode", "off");
      } else {
        d3.selectAll(".bug").attr("data-mode", "off");
        d3.selectAll(".overlay").attr("data-mode", "off");
        d3.select(this).attr("data-mode", "on");
        d.overlay.attr("data-mode", "on");
        if(d.handler) { d.handler.call(d.overlay.node(), d.data, i); }
      }
    });

  // live html
  renderLiveHTML();
  $("#live-html-source").on("keyup", renderLiveHTML);
  $("#live-html-source").on("blur", function() {
    $(this).text($(this).text());
    hljs.highlightBlock(this);
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

  console.log("----------");
  console.log(this)
  console.log(codeClass);
  console.log(codeClasses[codeClass]);

  var popup = d3.select("body").selectAll(".syntax-tooltip").data([codeClass]);
  popup.enter().append("div").classed("syntax-tooltip", true);
  popup.text(codeClasses[codeClass])
    .style("left", this.getBoundingClientRect().left + this.getBoundingClientRect().width/2 +"px")
    .style("top", (this.getBoundingClientRect().bottom + document.getElementsByTagName("body")[0].scrollTop) +"px");
}

function renderLiveHTML() {
  // update iframe
  var iframe = document.getElementById('live-html-iframe');
  var html = $("#live-html-source").text();
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();
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
