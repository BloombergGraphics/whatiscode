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
      d.active = d.active && !isBrokenIE

      // if module hasn't yet been initiated, call init function
      if(d.active && !d.initiated) {
        d.initiated = true;
        d.oninit ? d.oninit() : null;
      }

      // if active changed, call load / unload function
      if (d.active != wasActive) {
        d.active && d.onload ? d.onload(d) : null;
        !d.active && d.onunload ? d.onunload(d) : null;
      }
    })
  }, 50))

  setTimeout(d3.select(window).on('scroll.module'), 1000)

  d3.select(window).on('resize.module', calcPositions)

  //content on page moves without trigging any resizing...?
  setInterval(calcPositions, 2000)

  return function(d){
    // if (!d.sel.node()) debugger
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


// debugger

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
