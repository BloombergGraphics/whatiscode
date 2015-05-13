var originalArticle;
var loadTime = new Date();

jQuery(document).ready(function($) {

  paulbot = bot().botName("paulbot");
  d3.select("#paulbot").call(paulbot);
  paulbot
    .mode("off")
    .menu(botDialogues);

  setTimeout(function() {
    paulbot.tease({
      "message": "Hey! Have you noticed me?",
      "buttons": [
        {"text": "Start a tutorial", "click": function() { paulbot.dialogue(botDialogues.tutorialArrays); }},
        {"text": "Go away", "click": function() { paulbot.mode("off"); }}
      ]
    })
  }, 5000);

  $('body').on('click', '.paulbot-prompt', function(e) {
    var thisDialogue = botDialogues[this.dataset.dialogue];
    logger(true);
    paulbot.tease({
      "message": "The browser is constantly firing events in response to mouse and keyboard actions. Try mashing keys!",
      "buttons": [
        {"text": "Learn more", "click": function() { paulbot.dialogue(thisDialogue); }},
        {"text": "Stop it", "click": function() { logger(false); }}
      ]
    })
  });

  $(window).on('scroll', function(e) {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      var bottomTime = new Date();
      var timeDiff = (((bottomTime - loadTime) / 1000 / 60)*100).toFixed()/100;
      paulbot.tease({
        "message": function() { return "Oh so you read 38,000 words in only " + timeDiff + " minutes, did you? Stop and smell the roses." },
        "buttons": [
          {"text": "Guilty!", "click": function() { paulbot.mode("off"); }}
        ]
      });
    }
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
