var addModule = (function(){
  var modules = []

  calcPositions = _.throttle(function(){
    modules.forEach(function(d){
      d.bbox     = d.sel.node().getBoundingClientRect()
      d.startPos = d.bbox.top    + pageYOffset - 1350
      d.endPos   = d.bbox.bottom + pageYOffset
    })
  }, 1000)

  d3.select(window).on('scroll.module', _.debounce(function(d){
    modules.forEach(function(d){
      var wasActive = d.active;
      d.active = d.startPos < pageYOffset && pageYOffset < d.endPos

      // if active changed, call load / unload function
      if (d.active !== wasActive) {
        d.active && d.onload ? d.onload() : null;
        !d.active && d.onunload ? d.onunload() : null;
      }
    })
  }, 300))

  d3.select(window).on('resize.module', calcPositions)

  //content on page moves without trigging any resizing...?
  setInterval(calcPositions, 2000)

  return function(module){
    modules.push(module)
    calcPositions()
  }
})()
