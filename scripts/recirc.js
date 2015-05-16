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

function renderRecircs(d,i) {
  d3.select(this).selectAll("div.recirc")
    .data(d)
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
