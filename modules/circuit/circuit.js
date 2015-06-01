!(function(){
  var margin = {left: 20, right: 20, top: 40, bottom: 20}
      width  = 960 - margin.left - margin.right,
      height = 500 - margin.top  - margin.bottom,
      cols = 8,
      rows = 8,
      gS = 35   //gate size

  //set up gates
  var types = [
    {str: 'AND',  fn: function(a, b){ return a && b} },
    {str: 'OR',   fn: function(a, b){ return a || b} },
    {str: 'XOR',  fn: function(a, b){ return a ^ b} },
    {str: 'NAND', fn: function(a, b){ return !(a && b)} },
  ]

  var x = d3.scale.linear().domain([0, cols - 1]).range([0, width])
  var y = d3.scale.linear().domain([0, rows - 1]).range([0, height])

  var gates = d3.range(cols*rows).map(function(n){
    var rv = {
      i:    n % cols,
      j:    Math.floor(n / rows),
      n:    n,
      type: types[Math.floor(Math.random()*types.length)],
      on: false
    }
    rv.x = x(rv.i)
    rv.y = y(rv.j)
    rv.inputs = [{to: rv}, {to: rv}]
    rv.outputs = []

    return rv
  })

  //first col of gates are off or on, not actual gates
  var onType  = {str: 'ON',  fn: function(){ return true } }
  var offType = {str: 'OFF', fn: function(){ return false } }
  var gatesByCol = d3.nest().key(ƒ('i')).entries(gates).sort(d3.ascendingKey('key'))
  gatesByCol[0].values.forEach(function(d){
    d.type = Math.random() < .5 ? onType : offType
  })


  //set up wires
  var wires = _.flatten(gates.map(ƒ('inputs'))).filter(ƒ('to', 'i'))

  var wireByCol  = d3.nest().key(ƒ('to', 'i')).entries(wires)
  wireByCol.forEach(function(wireCol){
    wireCol.key = +wireCol.key

    var prevGateCol = gatesByCol[wireCol.key - 1]

    var gateSpace = x(1) - x(0) - gS
    var vXscale = d3.scale.linear().domain([0, wireCol.values.length]).range([10, gateSpace - 10])

    _.shuffle(wireCol.values).forEach(function(wire, i){
      wire.colI = i
    })

    _.shuffle(wireCol.values).forEach(function(wire, i){
      var gate = prevGateCol.values[Math.floor(i/2)]

      wire.from = gate
      gate.outputs.push(wire)

      wire.vX = vXscale(i)
    })
  })

  gates.forEach(function(gate){
    gate.outputs.forEach(function(d, i){
      d.fromN = i
    })
    gate.inputs.forEach(function(d, i){
      d.toN = i
    })
  })

  wires.forEach(function(d){
    d.pathStr = [
      'M', [d.from.x + gS/2, d.from.y + (d.fromN ? -gS/3 : -gS/5)],
      'h', d.vX,
      'V', d.to.y + (d.toN ? gS/3 : gS/5),
      'L', [d.to.x - gS/2, d.to.y + (d.toN ? gS/3 : gS/5)]
    ].join('')
  })


  //add elements to the page
  var svg = d3.select('#circuit').append('svg')
      .attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
    .append('g').translate([margin.left, margin.right])

  var gateGs = svg.dataAppend(gates, 'g')
      .translate(function(d){ return [d.x, d.y] })
      .each(function(d){ d.sel = d3.select(this) })

  gateGs.append('rect')
      .style({stroke: 'black', fill: 'darkgrey'})
      .attr({x: -gS/2, y: -gS/2, width: gS, height: gS})

  gateGs.append('text')
      .text(ƒ('type', 'str'))
      .attr({'text-anchor': 'middle', dy: '.33em'})
      .style('font-size', '70%')


  var wireBotEls = svg.dataAppend(wires, 'path.wire.bot').attr('d', ƒ('pathStr'))
      .style('stroke', 'lightgrey')
  var wireTopEls = svg.dataAppend(wires, 'path.wire.top').attr('d', ƒ('pathStr'))
      .attr('stroke-dasharray', '100% 100%')


  //update logic
  function update(i){
    gatesByCol.forEach(function(gateCol){
      gateCol.values.forEach(function(gate){
        gate.lastOn = gate.on
        gate.on = gate.type.fn.apply(null, gate.inputs.map(ƒ('on')))
        gate.changedOn = gate.lastOn != gate.on

        gate.outputs.forEach(function(d){
          d.on = gate.on
          d.changedOn = gate.changedOn
        })
      })
    })

    var uuid = Math.random()

    gateGs.selectAll('rect').filter(ƒ('changedOn'))
      .transition(uuid).delay(function(d){ return (d.i - i)*300+ 100})
        .style('fill', color)
        .style('fill-opacity', 1)
      .transition(uuid).duration(300)
        .style('fill-opacity', .5)

    wireBotEls
      .transition(uuid).delay(function(d){ return (d.from.i - i)*300 + 600 })
        .style('stroke', color)

    wireTopEls.filter(ƒ('changedOn'))
        .attr({stroke: color, 'stroke-width': 3, 'stroke-dashoffset': '100%'})
      .transition(uuid).delay(function(d){ return (d.from.i - i)*300 + 100 }).duration(1000)
        .each('start', function(){ d3.select(this).style('stroke-width', 3) })
        .attr('stroke-dashoffset', '0%')
      .transition(uuid)
        .style('stroke-width', 0)


    function color(d){ return d.on ? 'yellow' : 'darkgrey' }
  }

  update(0)

  gateGs.on('click', function(d){
    //toggle type
    if (d.i){
      var oldType = d.type
      while (oldType == d.type) d.type = types[Math.floor(Math.random()*types.length)]

    } else{
      d.type = d.type == onType ? offType : onType
    }

    d3.select(this).select('text').text(d.type.str)

    update(d.i)
  })

  var module = {sel: d3.select('#circuit')}
  addModule(module)

  window.setInterval(function(){
    if (!module.active) return

    var d = gatesByCol[0].values[Math.floor(Math.random()*8)]
    d.type = d.type == onType ? offType : onType
    d.sel.select('text').text(d.type.str)
    update(0)
  }, 3000)

})();
