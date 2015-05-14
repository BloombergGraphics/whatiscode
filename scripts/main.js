var originalArticle;
var loadTime = new Date();

if(!localStorage.getItem('visitCount')) {
  localStorage.setItem('visitCount', 1);
} else {
  localStorage.setItem('visitCount', parseInt(localStorage.getItem('visitCount'))+1);
}

jQuery(document).ready(function($) {

  paulbot = bot().botName("paulbot");
  d3.select("#paulbot").call(paulbot);
  paulbot
    .mode("off")
    .menu(botDialogues);

  setTimeout(function() {

    var message = "";
    if(localStorage.getItem('visitCount') == 1) {
      message += "Hey, welcome" + (document.referrer ? " from " + document.referrer + " " : "") + "! Have you noticed me?";
    } else {
      message += "Hey, welcome back" + (document.referrer ? " from " + document.referrer + " " : "") + "! You've visited " + localStorage.getItem('visitCount') + " times. Remember, I'm here for you!";
    }
    paulbot.tease({
      "message": message,
      "buttons": [
        {"text": "Start a tutorial", "click": function() { paulbot.dialogue(botDialogues.tutorialArrays); }},
        {"text": "Go away", "click": function() { paulbot.mode("off"); }}
      ]
    })
  }, 0);

  $('body').on('mouseover', '.paulbot-prompt', function(e) {
    paulbot.emote('wiggle');
  }).on('mouseout', '.paulbot-prompt', function(e) {
    paulbot.emote('restface');
  });

  $('body').on('click', '.paulbot-prompt[data-dialogue="tutorialDOM"]', function(e) {
    var thisDialogue = botDialogues[this.dataset.dialogue];
    logger(true);
    paulbot.tease({
      "message": "The browser is constantly firing events in response to mouse and keyboard actions. Try mashing keys!",
      "buttons": [
        {"text": "Learn more", "click": function() { paulbot.dialogue(thisDialogue); }},
        {"text": "Stop it", "click": function() { logger(false); paulbot.mode("off"); }}
      ]
    })
  });

  $('body').on('click', '.paulbot-prompt[data-dialogue="tutorialAdding"]', function(e) {
    var thisDialogue = botDialogues[this.dataset.dialogue];
    paulbot.tease({
      "message": "Hey, what's the difference between 4+20 and 4+\"20\"?",
      "buttons": [
        {"text": "Learn more", "click": function() { paulbot.dialogue(thisDialogue); }},
        {"text": "Sounds boring", "click": function() { paulbot.mode("off"); }}
      ]
    })
  });

  $('body').on('click', '.paulbot-prompt[data-dialogue="tutorialArrays"]', function(e) {
    var thisDialogue = botDialogues[this.dataset.dialogue];
    paulbot.tease({
      "message": "Something something TK cool illustration of things happening on the page with arrays",
      "buttons": [
        {"text": "Learn more", "click": function() { paulbot.dialogue(thisDialogue); }},
        {"text": "Sounds boring", "click": function() { paulbot.mode("off"); }}
      ]
    })
  });

  $('body').on('click', '.paulbot-prompt[data-dialogue="css"]', function(e) {
    roulette();
    paulbot.tease({
      "message": "Randomizing page styles...",
      "buttons": [
        {"text": "Again!", "click": function() { roulette(); }},
        {"text": "Back to normal please", "click": function() { resetArticle(); paulbot.mode("off"); }}
      ]
    })
  });

  $(window).on('scroll', function(e) {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      var bottomTime = new Date();
      var timeDiff = (((bottomTime - loadTime) / 1000 / 60)*100).toFixed()/100;
      paulbot.emote('troll');
      paulbot.tease({
        "message": function() { return "Oh so you read 38,000 words in only " + timeDiff + " minutes, did you? Stop and smell the roses." },
        "buttons": [
          {"text": "Guilty!", "click": function() { paulbot.emote('restface'); paulbot.mode("off"); }}
        ]
      });
    }
  })

  $("#live-html-source").on("keyup", renderLiveHTML);
  $("#live-html-source").on("blur", function() {
    $(this).text($(this).text());
    hljs.highlightBlock(this);
  });

  footnotesToAsides();
  preCode();
  buildGlossary();
  renderLiveHTML();

  hljs.initHighlightingOnLoad();

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
