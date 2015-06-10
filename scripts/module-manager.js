var addModule = (function(){
  var modules = []

  calcPositions = _.throttle(function(){
    modules.forEach(function(d){
      d.bbox     = d.sel.node().getBoundingClientRect()
      d.startPos = d.bbox.top    + pageYOffset - innerHeight
      d.endPos   = d.bbox.bottom + pageYOffset
    })
  }, 1000)

  d3.select(window).on('scroll.module', _.debounce(function(d){
    modules.forEach(function(d){
      //exit early if calcPositions hasn't run yet
      if (!d.startPos) return

      var wasActive = !!d.active;
      d.active = d.startPos < pageYOffset && pageYOffset < d.endPos
      d.active = d.active && innerWidth > d.minWidth

      // if module hasn't yet been initiated, call init function
      if(d.active && !d.initiated) {
        d.initiated = true;
        d.oninit ? d.oninit() : null;
      }

      // if active changed, call load / unload function
      if (d.active != wasActive) {
        d.active && d.onload ? d.onload() : null;
        !d.active && d.onunload ? d.onunload() : null;
      }
    })
  }, 300))

  d3.select(window).on('resize.module', calcPositions)

  //content on page moves without trigging any resizing...?
  setInterval(calcPositions, 2000)

  return function(d){
    if (!d.sel.node()) debugger
    d.minWidth = d.minWidth || 1020
    modules.push(d)
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

var orange = 'rgb(252, 192, 73)'

var colorArray = [blue, purple, green, red, Lblue, Lpurple, Lgreen]
