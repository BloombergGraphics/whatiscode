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





//random global varibles go here?
var blue  = '#2800d7'
var Lblue = '#6381ff'
var purple = '#c63eff'
var Lpurple = '#fc99ff'
var green = '#00c770'
var Lgreen = '#91f29b'
var red = '#f94600'

var colorArray = [blue, purple, green, red, Lblue, Lpurple, Lgreen]