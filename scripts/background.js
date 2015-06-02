var svgWidth  = window.innerWidth,
    svgHeight = window.innerHeight


var backgroundSVG = d3.select('#background-canvas')
  .append('svg')
    .attr({height: svgHeight, width: svgWidth})

//spinning squares
!(function(){
  var offset = 0,
      width  = window.innerWidth,
      height = window.innerHeight,
      s = Math.sqrt(width*height/3000),
      lastColorI = -1,
      colors = colorArray.slice(0, 3)

  s = 25
  s = window.innerWidth/Math.floor(window.innerWidth/s)

  var module = {sel: d3.select('#headerArt'), active: true}
  addModule(module)


  function drawSquares(){
    setTimeout(drawSquares, 5/4*1000)

    if (!module.active) return backgroundSVG.selectAll('rect').filter(function(d){ return !d.started }).transition()

    offset++

    var squares = []
    d3.range(0, width + s, s).forEach(function(x, i){
      d3.range(0, height + s, s).forEach(function(y, j){
        if ((i + j + offset) % 4) return
        squares.push({x: x, y: y, i: i, j: j, 
          isLeft: Math.random() < .5,
          isTop:  Math.random() < .5})
      })
    })

    backgroundSVG.append('g.spin-square').dataAppend(squares, 'rect')
        .attr('x', function(d){ return d.isLeft ? d.x : d.x + s })
        .attr('y', function(d){ return d.isTop  ? d.y : d.y + s })
        .attr({width: 0, height: 0})
        .style('fill', randColor())
      .transition()
        // .ease('bounce')
        .duration(1000)
        .delay(function(d, i){
          return d.isTop*1000 + d.isLeft*1000 + (d.isLeft && !d.isTop)*1000*2 + Math.random()*700 })
        .each('start', function(d){ d.started = true })
        .attr({width: s + 1, height: s + 1})
        .attr({x: ƒ('x'), y: ƒ('y')})


    var numGroups = backgroundSVG.selectAll('g.spin-square').size()
    backgroundSVG.selectAll('g.spin-square')
       .filter(function(d, i){ return i + 12 < numGroups })
       .remove()

  }
  drawSquares()


  function randColor(){
    lastColorI = (lastColorI + 1) % colors.length
    return colors[lastColorI]
  }

})()


//wave squares
!(function(){
  var offset = 0,
      width  = window.innerWidth,
      height = window.innerHeight,
      s = Math.sqrt(width*height/3000),
      lastColorI = -1,
      colors = colorArray.slice(0, 0 + 5)

  s = window.innerWidth/Math.floor(window.innerWidth/s)


  var module = {sel: d3.select('#sec-2')}
  addModule(module)


  function drawSquares(){
    setTimeout(drawSquares, 900)

    if (!module.active) return

    offset++

    var squares = []
    d3.range(0, width + s, s).forEach(function(x, i){
      d3.range(0, height + s, s).forEach(function(y, j){
        if ((i + j + offset) % 3) return
        squares.push({x: x, y: y, i: i, j: j})
      })
    })

    backgroundSVG.append('g.wave-square').dataAppend(squares, 'rect')
        .attr({x: ƒ('x'), y: ƒ('y')})
        .attr({width: 0, height: 0})
        .style('fill', randColor())
      .transition()
        .duration(1500)
        .delay(function(d, i){ return (d.i + d.j + Math.random()*0)*90 })
        .attr({width: s, height: s})

    var numGroups = backgroundSVG.selectAll('g.wave-square').size()
    backgroundSVG.selectAll('g.wave-square')
       .filter(function(d, i){ return i + 8 < numGroups })
       .remove()

  }
  drawSquares()

  function randColor(){
    lastColorI = (lastColorI + 1) % colors.length
    return colors[lastColorI]
  }

})()

