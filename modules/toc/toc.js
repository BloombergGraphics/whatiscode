!(function(){

  var module = {sel: d3.select('[data-module="toc"]')}
  addModule(module)

  var stats;

  var loadTime = new Date();

  var pixelsToWords = d3.scale.linear()
    .domain([0,d3.select("body").node().getBoundingClientRect().height])
    .range([0,getWordCount(d3.select("body"))]);
  
  var pixelsToPercentage = d3.scale.linear()
    .domain([0,d3.select("body").node().getBoundingClientRect().height])
    .range([0,100]);

  var wordsToPercentage = d3.scale.linear()
    .domain([0,getWordCount(d3.select("body"))]);

  var histogram = d3.layout.histogram()
    .value(ƒ('scrollTop'))
    .bins(pixelsToWords.ticks(100));

  module.sel
    .on("mouseover", function(d) {
      module.sel.classed("open", true);
      d3.select("article").classed("toc-open", true);
    })
    .on("mouseout", function(d) {
      module.sel.classed("open", false);
      d3.select("article").classed("toc-open", false);
    })

  function getWordCount(sel) {
    if(!arguments.length) sel = d3.select("body");
    return sel.text().trim().replace(/\s+/gi, ' ').split(' ').length;
  }

  function getWordsPerMs() {
    // filter scroll log to last five minutes
    var recent = stats.scrollLog.filter(function(d) { return d.timestamp > (+(new Date()) - 1000*60*5); });
    return recent.length >= 2 ? (recent[recent.length-1].wordCount - recent[0].wordCount) /
      (recent[recent.length-1].timestamp - recent[0].timestamp) : 0;
  }

  function getEstimatedFinishTime() {
    return new Date(+(new Date()) + (getWordCount() - latest().wordCount) / getWordsPerMs());
  }

  function saveStats() { 
    stats.windows.previous = stats.windows.current;
    stats.timeOnPage += (+new Date()) - loadTime;
    // stats.scrollLog = [];
    localStorage.setItem('stats', JSON.stringify(stats));
    return; 
  }

  function loadStats() { 
    stats = JSON.parse(localStorage.getItem('stats'));
    if(!stats) {
      console.log("no stats!!!");
      stats = {
        scrollLog: [],
        wordCount: getWordCount(),
        timeOnPage: 0,
        visits: 1,
        histogram: {},
        windows: {
          "current": 0,
          "previous": 0,
          "hover": null
        }
      }
    }
  }

  function makeHistogram() {
    stats.histogram = histogram(stats.scrollLog)
    return stats.histogram;
  }

  function renderHistogram() {
    var histogram = module.sel.selectAll("div.histogram").data([stats.histogram]);
    histogram.enter().append("div.histogram")
      .on("mousemove", function() {
        var mouseOffset = pixelsToPercentage(window.innerHeight)/100*this.offsetHeight / 2;
        stats.windows.hover = pixelsToPercentage.invert(100 * (d3.mouse(this)[1] - mouseOffset) / this.offsetHeight);
        renderWindows();
      })
      .on("mouseout", function() {
        stats.windows.hover = null;
        renderWindows();
      })
      .on("click", function() {
        stats.windows.previous = stats.windows.current;
        var mouseOffset = pixelsToPercentage(window.innerHeight)/100*this.offsetHeight / 2;
        var target = pixelsToPercentage.invert(100 * (d3.mouse(this)[1] - mouseOffset) / this.offsetHeight);
        d3.select("body").transition().duration(500)
            .tween("smoothscroll", scrollTopTween(target));
      });

    var windows = histogram.selectAll("div.window")
        .data(Object.keys(stats.windows));
    
    windows.enter()
        .append("div.window")
        .style("height", pixelsToPercentage(window.innerHeight)+"%")
        .attr("data-window", _.identity);
    renderWindows();
    
    var bars = histogram.selectAll("div.bar")
        .data(stats.histogram);
    
    bars.enter()
        .append("div.bar")
        .style("height", function(d) { return pixelsToPercentage(d.dx) + "%"; })
        .style("top", function(d) { return pixelsToPercentage(d.x) + "%"; })
        .on("click", function(d) { 
          d3.select("body").transition().duration(500)
            .tween("smoothscroll", scrollTopTween(d.x));
        });

    bars
      .style("opacity", function(d) { return Math.min(d.y/15, 1); });

  }

  function renderWindows() {
    stats.windows.current = document.getElementsByTagName('body')[0].scrollTop;
    module.sel.selectAll(".histogram div.window")
      .style("display", function(d) { return stats.windows[d] !== null ? "block" : "none"; })
      .style("top", function(d) { return pixelsToPercentage(stats.windows[d]) + "%"; });
  }

  function renderTOC() {
    var tree = [];
    d3.selectAll("article section")
      .each(function(d) {
        var subtree = [];
        d3.select(this).selectAll("h2,h3")
          .each(function(dd) {
            subtree.push(this);
          });
        tree.push(subtree);
      });
    // console.log(tree);

    module.sel.append("div.toc")
      .selectAll("div.toc-section")
      .data(tree)
      .enter()
      .append("div.toc-section")
      .selectAll("div.toc-head")
      .data(function(d) { return d; })
      .enter()
      .append("div.toc-head")
      .attr("data-level", ƒ('tagName'))
      .html(ƒ('innerText'))
      .on("click", function(d) {
        d3.select("body").transition().duration(500)
          .tween("tocscroll", scrollTopTween(d.getBoundingClientRect().top + document.getElementsByTagName("body")[0].scrollTop));
      });
  }
  renderTOC();

  function renderStats() {

    console.log("heyyy");

    var statSel = module.sel.select("div.toc-section.stats");
    if(statSel.empty()) {
      statSel = module.sel.select("div.toc").append("div.toc-section.stats");
    }

    statSel.text("You’re averaging " 
      + (getWordsPerMs() * 1000 * 60).toFixed() 
      + " words per minute; at this rate, you’ll finish by " 
      + getEstimatedFinishTime());
  }

  function latest() {
    return stats.scrollLog[stats.scrollLog.length-1];
  }

  function onResize() {
    // redo scales
    var h = d3.select("body").node().getBoundingClientRect().height;
    pixelsToWords.domain([0,h]);
    pixelsToPercentage.domain([0,h]);
  }

  function logScroll() {
    var px = document.getElementsByTagName("body")[0].scrollTop;
    return stats.scrollLog.push({
      "scrollTop": px,
      "wordCount": pixelsToWords(px),
      "percentage": pixelsToPercentage(px),
      "timestamp": +(new Date())
    });
  }

  function scrollToSaved() {
    if(localStorage.getItem('scrollTop')) {
      document.getElementsByTagName('body')[0].scrollTop = parseInt(localStorage.getItem('scrollTop'));
    }
  }

  function scrollTopTween(scrollTop) { 
    return function() { 
      var i = d3.interpolateNumber(this.scrollTop, scrollTop); 
      return function(t) { this.scrollTop = i(t); }; 
    }; 
  } 

  setInterval(function() {
    logScroll();
    makeHistogram();
    renderHistogram();
    renderStats();
  }, 1000);

  d3.select(window).on("scroll.toc", renderWindows);
  window.onunload = window.onbeforeunload = saveStats;
  loadStats();

})();
