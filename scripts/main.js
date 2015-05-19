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

  // create paulbot
  paulbot = bot().botName("paulbot");
  d3.select("#paulbot").call(paulbot);

  cartbot = bot().botName("cartbot");
  d3.select("[data-dialogue='shoppingCart']").call(cartbot);
  cartbot.dialogue(botDialogues.shoppingCart);

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

  // save uncontaminated version for reset ability
  originalArticle = $("article").html();

});

function renderLiveHTML() {
  // update iframe
  var iframe = document.getElementById('live-html-iframe');
  var html = $("#live-html-source").text();
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();
}

function footnotesToAsides() {
  var footnotes = $(".footdef");
  footnotes.each(function(i, fn) {
    // debugger
    fn = $(fn);
    var ref = document.getElementById(fn.find("a").eq(0).attr("href").split("#")[1]);
    var para = $(ref).closest("p");
    // debugger
    var aside = $("<aside/>", {
      class: "footnote"
    }).insertBefore(para);
    fn.detach();
    fn.appendTo(aside);
  })
}

function preCode() {
  $("pre").each(function(i, pre) {
    if($(pre).find("code").length === 0) {
      $(pre).html("<code>"+$(pre).html()+"</code>");
    }
  })
}
