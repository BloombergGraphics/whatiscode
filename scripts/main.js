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
        {"text": "Start a tutorial", "click": function() { paulbot.mode("on"); }},
        {"text": "Go away", "click": function() { paulbot.mode("off"); }}
      ]
    })
  }, 0);

  // those yellow-highlighted paulbot prompts launch teases which launch tutorials
  $('body').on('mouseover', '.paulbot-prompt', function(e) {
    paulbot.emote('wiggle');
  }).on('mouseout', '.paulbot-prompt', function(e) {
    paulbot.emote('restface');
  }).on('click', '.paulbot-prompt[data-tease]', function(e) {
    paulbot.tease(botTeases[this.dataset.tease])
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

  var recircs = [
    {
      "url": "http://www.bloomberg.com/bw/articles/2013-11-07/the-hidden-technology-that-makes-twitter-huge",
      "dummyUrl": "other/twitter.html"
    },
    {
      "url": "http://www.bloomberg.com/news/articles/2015-04-14/docker-said-to-join-1-billion-valuation-club-with-new-funding",
      "dummyUrl": "other/docker.html"
    },
    {
      "url": "http://www.bloomberg.com/bw/articles/2013-10-10/jeff-bezos-and-the-age-of-amazon-excerpt-from-the-everything-store-by-brad-stone",
      "dummyUrl": "other/bezos.html"
    },
    {
      "url": "http://www.bloomberg.com/news/articles/2015-05-07/coding-classes-attract-college-grads-who-want-better-jobs",
      "dummyUrl": "other/ga.html"
    },
    {
      "url": "http://www.bloomberg.com/news/articles/2015-04-02/soon-students-may-learn-to-code-instead-of-taking-french-class",
      "dummyUrl": "other/dumb.html"
    }
  ];
  renderRecircs(d3.select(".recircs"), recircs);


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

function renderRecircs(container, urls) {
  container.selectAll("div.recirc")
    .data(urls)
    .enter()
    .append("div")
    .classed("recirc", true)
    .each(renderRecirc);
}

function renderRecirc(d,i) {

  var recirc = d3.select(this);
  var url = d.dummyUrl;
  recirc.html(d3.select("#recircTemplate").html());
  // TODO: remove dummy URLs

  fetch(url)
    .then(
      function(response) {

        response.text().then(function(rText) {

          // get page title
          var titleStart = rText.indexOf("<title>") + "<title>".length;
          var titleEnd = rText.indexOf("</title>");
          var titleLength = titleEnd - titleStart;
          var title = rText.substr(titleStart, titleLength);
          recirc.select(".title").text(title);

          // get the source between <article...> and </article>
          var start = rText.indexOf("<article");
          var end = rText.indexOf("</article>") + "</article>".length;
          var length = end - start;
          var source = rText.substr(start,length);

          var progress = 0;
          var iframeDocument = recirc.select(".body").node().contentWindow.document;

          var renderingInterval = setInterval(function() {
            // increment within bounds
            progress=Math.min(progress + 5, source.length)

            // add some text
            recirc.select(".source").text(source.substr(0,progress));
            // scroll to bottom
            recirc.select(".source").node().scrollTop = recirc.select(".source").node().scrollHeight;

            iframeDocument.open();
            iframeDocument.write(source.substr(0,progress));
            iframeDocument.close();
            iframeDocument.getElementsByTagName("body")[0].scrollTop = iframeDocument.getElementsByTagName("body")[0].scrollHeight;

            if(progress === source.length) clearInterval(renderingInterval);
          })
        })
      }
    );
}
