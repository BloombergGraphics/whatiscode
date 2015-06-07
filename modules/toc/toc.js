!(function(){

  var module = {sel: d3.select('[data-module="toc"]')}
  addModule(module)

  var stats = {
    scrollLog: [],
    wordCount: 0,
    timeOnPage: 0,
    visits: 0,
    lastPosition: 0,
    histogram: {},
    modulesCompleted: 0
  };

  var pixelsToWords = d3.scale.linear()
    .domain([0,d3.select("article").node().getBoundingClientRect().height])
    .range([0,getWordCount(d3.select("article"))]);
  
  var pixelsToPercentage = d3.scale.linear()
    .domain([0,d3.select("article").node().getBoundingClientRect().height]);

  var wordsToPercentage = d3.scale.linear()
    .domain([0,getWordCount(d3.select("article"))]);

  var histogram = d3.layout.histogram()
    .value(ƒ('scrollTop'))
    .bins(pixelsToWords.ticks(100));

  function getWordCount(sel) {
    if(!arguments.length) sel = d3.select("article");
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

  function saveStats() { return; }
  function loadStats() { return; }

  function makeHistogram() {
    stats.histogram = histogram(stats.scrollLog)
    return stats.histogram;
  }

  function latest() {
    return stats.scrollLog[stats.scrollLog.length-1];
  }

  function onResize() {
    // redo scales
    var h = d3.select("article").node().getClientBoundingRect().height;
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

  setInterval(function() {
    logScroll();
    makeHistogram();

    console.log((getWordsPerMs() * 1000 * 60) + " words per minute");
    console.log("eta " + getEstimatedFinishTime());
    console.log(stats.histogram);
  }, 1000);

})();
