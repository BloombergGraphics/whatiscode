var glossaryLite = [
  {"title":"Imperative, compiled","description":"Write a custom real-time database to deal with millions of stocks. (C)"},
  {"title":"Scripting","description":"Analyze millions of stock-trading accounts every night to look for interesting patterns. (Perl, Python)"},
  {"title":"Object-oriented","description":"Build a stock-trading platform with visualizations of trades in close to real-time. (Smalltalk, Java)"},
  {"title":"Functional","description":"Trade bonds in real time with no human intervention. (Scheme, Haskell, Clojure)"},
  {"title":"Logical","description":"Check to make sure that trades are compliant with current SEC regulations. (Prolog)"},
  {"title":"Concurrent","description":"Deal with ten thousand simultaneous stock trades. (Go)"},
  {"title":"Declarative","description":"Retrieve millions of trades from a database. (SQL)"},
  {"title":"Objective-C","description":"the core language of MacOS and iOS"},
  {"title":"Java","description":"wildly popular in enterprise programming and the root language for Minecraft"},
  {"title":"C++","description":"used to do much of Google and Microsoft’s heavy lifting and is one of the main languages used for programming large games"},
  {"title":" C# ","description":"Microsoft’s answer to Java and the main language on their .NET platform."}
];

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

  highlightTerms(glossaryLite);
}

function highlightTerms(dictionary) {
  var html = d3.select("article").html();
  dictionary.forEach(function(value, index) {
    var re = new RegExp(escapeRegExp(value.title),"gi");
    html = html.replace(re, function(match) { return "<span class='glossary-item' data-term='"+value.title+"'>"+match+"</span>"; });
  });
  d3.select("article").html(html);

  var tooltip = d3.select("body").append("div").classed("glossary-tooltip", true);
  d3.selectAll(".glossary-item").on("mouseover", function(d) {
    console.log(this.dataset.term, _.findWhere(glossaryLite, {"title": this.dataset.term}))
    tooltip.classed("on", true)
      .style("top", (this.getBoundingClientRect().top+d3.select("body").node().scrollTop)+"px")
      .style("left", this.getBoundingClientRect().left+"px")
      .text(_.findWhere(glossaryLite, {"title": this.dataset.term}).description);
  }).on("mouseout", function(d) {
    tooltip.classed("on", false);
  })
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
