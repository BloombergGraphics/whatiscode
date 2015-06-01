!(function(){


  function drawGCD(){
    var stack = []

    var a = 960 - Math.floor(Math.random()*100), b = 400 + Math.floor(Math.random()*100)

    function gcd(u, v){
      stack.push({u: u, v: v})
      return v ? gcd(v, u % v) : u
    }
    gcd(a, b)


    window.setTimeout(drawGCD, stack.length*700 + 1000)
    if (!module.active) return

    var size = 960,
        s    = 960/Math.max(a, b),
        s = 1
        colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

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
      console.log(d.flipped, d.translate)
      d.color = colors[i]
    })


    var svg = d3.select('#gcd').html('').append('svg')
        .attr({width: size, height: 500})

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
      .transition().delay(function(d, i){ return d ? (d.j + 1)*700 : 0 })
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
      .transition().delay(function(d){ return d.i*700 })
        .style('opacity', 1)

  }

  var module = {sel: d3.select('#gcd')}
  addModule(module)

  drawGCD()
  
})();
