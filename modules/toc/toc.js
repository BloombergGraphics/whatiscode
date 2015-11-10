var stats,
    loadTime = new Date();

!(function(){

  var module = {sel: d3.select('[data-module="toc"]')}
  addModule(module)

  stats = loadStats();
  var open = false;

  var pixelsToWords = d3.scale.linear()
    .domain([0,d3.select("body").node().getBoundingClientRect().height])
    .range([0,stats.wordCount]);
  
  var pixelsToPercentage = d3.scale.linear()
    .domain([0,d3.select("body").node().getBoundingClientRect().height])
    .range([0,100]);

  var wordsToPercentage = d3.scale.linear()
    .domain([0,stats.wordCount]);

  var histogram = d3.layout.histogram()
    .value(ƒ('scrollTop'))
    .bins(pixelsToWords.ticks(100));

  var logInterval = setInterval(function() {
    logScroll();
    if(open) {
      makeHistogram();
      renderHistogram();
      renderStats();
    }
  }, 1000);

  d3.select(window).on("scroll.toc", renderWindows);
  d3.select(window).on("hashchange.toc", function() { 
    stats.windows.previous = stats.windows.current;
    renderWindows();
  });
  window.onunload = window.onbeforeunload = saveStats;
  renderTOC();

  d3.select("#toc-toggle").on("click", function() {
    open = !open;
    module.sel.classed("open", open);
    d3.select("article").classed("toc-open", open);
  });

  d3.selectAll(".code-section,.banner-container").on("click", function() {
    if (open == true) {
      open = false;
      module.sel.classed("open", open);
      d3.select("article").classed("toc-open", open);
    }
  });

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
    return new Date(+(new Date()) + (stats.wordCount - latest().wordCount) / getWordsPerMs());
  }

  function saveStats() { 
    stats.windows.previous = stats.windows.current;
    stats.timeOnPage += (+new Date()) - loadTime;
    // stats.scrollLog = [];
    localStorage.setItem('stats', JSON.stringify(stats));
    return; 
  }

  function loadStats() { 
    var stats = JSON.parse(localStorage.getItem('stats'));
    if(!stats) {
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
    } else {
      stats.visits++;
    }
    return stats;
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

    module.sel.append("div.toc")
      .selectAll("div.toc-section")
      .data(tree)
      .enter()
      .append("div.toc-section")
      .selectAll("div.toc-head")
      .data(function(d) { return d; })
      .enter()
      .append("a.toc-head")
      .attr("data-level", ƒ('tagName'))
      .attr("href", function(d) { return '#' + d.id; })
      .html(function(d) { return d.childNodes[0].innerText + ". " + d.childNodes[1].nodeValue; })
      .on("click", function(d) {
        d3.event.preventDefault();
        history.pushState(null, null, '#'+d.id);
        stats.windows.previous = stats.windows.current; 
        d3.select("body").transition().duration(500)
          .tween("tocscroll", scrollTopTween(d.getBoundingClientRect().top + pageYOffset));
      });
  }

  function renderStats() {

    var eta = getEstimatedFinishTime();

    if ( isNaN( eta.getTime() ) ) { 
      var etaStr = "the Second Coming, probably"
    } else {
      var dateFormat = d3.time.format.multi([
        ["%H:%M", function(d) { return +d - +new Date() < 24*60*60*1000; }],
        ["%H:%M on %B %e", function(d) { return +d - +new Date() < 24*60*60*1000*365; }],
        ["%H:%M on %B %e, %Y", function(d) { return true; }]
      ]);
      var etaStr = dateFormat(eta);
    }

    var statSel = module.sel.select("div.toc-section.stats");
    if(statSel.empty()) {
      statSel = module.sel.select("div.toc").append("div.toc-section.stats");
    }

    statSel.text("You’re averaging " 
      + (getWordsPerMs() * 1000 * 60).toFixed() 
      + " words per minute; at this rate, you’ll finish by " 
      + etaStr + ".");
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
    var px = pageYOffset;
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

})();
