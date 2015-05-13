var originalArticle;

jQuery(document).ready(function($) {

  paulbot = bot().botName("paulbot");
  d3.select("#paulbot").call(paulbot);
  paulbot
    .mode("off")
    .menu(botDialogues);

  $('body').on('click', '.paulbot-prompt', function(e) {
    paulbot.dialogue(botDialogues[this.dataset.script]);
  })

  footnotesToAsides();
  preCode();
  buildGlossary();

  hljs.initHighlightingOnLoad();

  originalArticle = $("article").html();

});

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
    $(pre).html("<code>"+$(pre).html()+"</code>");
  })
}

function buildGlossary() {
  var glossary = [];
  $("dl").each(function(i, dl) {
    var dts = $(dl).find("dt").toArray();
    var dds = $(dl).find("dd").toArray();
    glossary.push(
      _.zip(dts,dds)
      .map(function(d) {
        return {
          "title": $(d[0]).html(),
          "description": $(d[1]).html()
        };
      })
    );
  });

  $("#glossary").append($("dl").clone());
}
