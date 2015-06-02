var blue  = '#2800d7'
var Lblue = '#6381ff'
var purple = '#c63eff'
var Lpurple = '#fc99ff'
var green = '#00c770'
var Lgreen = '#91f29b'
var red = '#f94600'

var colorArray = [blue, purple, green, red, Lblue, Lpurple, Lgreen]





!(function(){
  var offset = 0,
      width  = window.innerWidth,
      height = window.innerHeight,
      s = Math.sqrt(width*height/200)

  s = window.innerWidth/Math.floor(window.innerWidth/s)

  var svg = d3.select('#background-canvas')
    .append('svg')
      .attr({height: height, width: width})


  function drawSquares(){
    offset++

    var squares = []
    d3.range(0, width + s, s).forEach(function(x, i){
      d3.range(0, height + s, s).forEach(function(y, j){
        if ((i + j + offset) % 2) return
        squares.push({x: x, y: y, i: i, j: j, 
          isLeft: Math.random() < .5,
          isTop:  Math.random() < .5})
      })
    })

    svg.append('g').dataAppend(squares, 'rect')
        .attr('x', function(d){ return d.isLeft ? d.x : d.x + s })
        .attr('y', function(d){ return d.isTop  ? d.y : d.y + s })
        .attr({width: 0, height: 0})
        .style('fill', randColor())
      .transition()
        // .ease('bounce')
        .duration(1000)
        .delay(function(d, i){
          return d.isTop*1000 + d.isLeft*1000 + (d.isLeft && !d.isTop)*1000*2 })
        .attr({width: s, height: s})
        .attr({x: ƒ('x'), y: ƒ('y')})


  var numGroupds = svg.selectAll('g').size()
  d3.selectAll('g')
     .filter(function(d, i){ return i + 5 < numGroupds })
     .remove()


    setTimeout(drawSquares, 5/4*1000)
  }
  drawSquares()

  var lastColorI = -1
  function randColor(){
    lastColorI = (lastColorI + 1) % colorArray.length
    return colorArray[lastColorI]
  }

})()



