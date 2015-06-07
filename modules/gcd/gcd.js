!(function(){
  var stepDelay = 700

  function drawGCD(){
    var stack = []

    var a, b, stack

    function gcd(u, v){
      stack.push({u: u, v: v})
      return v ? gcd(v, u % v) : u
    }

    while (!stack.length || stack.length > 6 || _.last(stack).u < 5){
      a = 960 - Math.floor(Math.random()*100)
      b = 400 + Math.floor(Math.random()*100)
      stack = []
      gcd(a, b)
    }


    window.setTimeout(drawGCD, (stack.length + 3)*stepDelay)
    // if (!module.active) return

    var size = 960,
        s    = 960/Math.max(a, b),
        s = 1
        colors = colorArray

    stack[0].translate = [0, 0]

    stack.forEach(function(d, i){
      d.i = i

      d.us = d.u*s
      d.vs = d.v*s

      d.prev = i ? stack[i - 1] : d

      d.flipped = !(!i || !(i % 2))
      d.x = d.flipped ? d.vs : d.us
      d.y = d.flipped ? d.us : d.vs

      d.num = Math.floor(d.u/d.v)

      d.translate = d.prev.translate.slice()
      if (i) d.translate[+!d.flipped] += d.prev.v*d.prev.num
      d.color = colors[i]
    })


    var numToColor = {}
    stack.forEach(function(d){ numToColor[d.v] = d.color })
    numToColor[a] = 'black'
    numToColor[0] = 'lightgrey'

    var svg = d3.select('[data-module="gcd"]').html('').append('svg')
        .attr({width: size, height: 500})

    var text = d3.select('[data-module="gcd"]').append('div.explanation')

    var stepDivs = text.dataAppend(stack.concat('last'), 'div')
    stepDivs.dataAppend(function(d, i){
        if (d == 'last'){
          return [
          'So ',
          a,
          ' and ', 
          b,
          ' have a greatest common divisor of ',
          _.last(stack).u]
        }
        if (!d.v) return []
        return [
          'What is the largest number that evenly divides ',
          d.u, 
          ' and ',
          d.v,
          '? <br>',
          '<div style="display: inline-block; width: 20px;">',
          d.u,
          ' divided by ',
          d.v,
          ' is ',
          Math.floor(d.u/d.v),
          ' remainder ' ,
          d.u % d.v
        ]
      }, 'span')
        .html(ƒ())
        .each(function(d){
          if (numToColor[d]){
            d3.select(this).style('color', numToColor[d])
          } else{
            d3.select(this).classed('chatter', true)
          }
        })
      
    stepDivs
        .style('opacity', 0)
      .transition().delay(function(d, i){ return (i + 1)*stepDelay })
        .style('opacity', 1)

    svg.append('rect').attr({width: a, height: b})

    svg.dataAppend(stack, 'g')
      .each(function(d){
        if (!d.v) return

        d3.select(this).dataAppend(d3.range(d.num).map(function(i){ return {i: i, j: d.i, p: d} }), 'rect.step')
            .attr(d.flipped ? 'y' : 'x', function(e){ return e.i*d.v })
            .attr('width',  d.v)
            .attr('height', d.v)
            .style('fill', d.color)
            .style('stroke', d3.rgb(d.color).darker(2))
      })
      .translate(ƒ('translate'))


    svg.selectAll('rect.step').style('opacity', 0)
      .transition().delay(function(d, i){ return d ? (d.j + 1)*stepDelay : 0 })
        .style('opacity', 1)
        .style('stroke-width', 10)
      .transition().duration(500)
        .style('stroke-width', 1)


    svg.append('text')
        .translate([10, 500/2])
      .dataAppend(stack, 'tspan.number')
        .text(function(d){ return ' ' + d.u + ' ' })
        
        .style({fill: function(d, i){ return i ? d.prev.color : 'black' }})
        .style('opacity', 0)
      .transition().delay(function(d){ return d.i*stepDelay })
        .style('opacity', 1)

  }

  var module = {sel: d3.select('[data-module="gcd"]')}
  addModule(module)

  drawGCD()
  
})();
