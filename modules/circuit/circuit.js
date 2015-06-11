!(function(){
  var margin = {left: 25, right: 40, top: 30, bottom: 25}
      width  = Math.min(960, innerWidth) - margin.left - margin.right,
      cols = Math.ceil(width/900*8),
      rows = Math.ceil(width/900*8),
      height = 500*rows/8 - margin.top  - margin.bottom,
      gS = 35   //gate size

  //set up gates
  var types = [
    {
      str: 'AND',
      fn: function(a, b){ return a && b},
      paths: ["m -45,-40 c 0,0 40.12951,0 60,0 20,0 40,19.4856 40,40.00002 0,20 -20,40 -40,40 -20.0296,0 -60,0 -60,0 l 0,-80.00002 z"]
    },
    {
      str: 'OR',
      fn: function(a, b){ return a || b},
      paths: ["m -45,-40 c 0,0 10,20 10,40.00002 0,19.7683 -10,40 -10,40 0,0 -18.284101,0 30,0 50,0 70,-40 70,-40 0,0 -20,-40.00002 -70,-40.00002 -50.151253,0 -30,0 -30,0 z"]
    },
    {
      str: 'XOR',
      fn: function(a, b){ return a ^ b},
      paths:["m -45,-40 c 0,0 10,20 10,40.00002 0,19.7683 -10,40 -10,40 0,0 -18.284101,0 30,0 50,0 70,-40 70,-40 0,0 -20,-40.00002 -70,-40.00002 -50.151253,0 -30,0 -30,0 z",
        "m -55,-40 c 0,0 10,20 10,40.00002 0,19.7935 -10,40 -10,40"]
    },
    {
      str: 'NAND',
      fn: function(a, b){ return !(a && b)},
      paths: ["m -45,-40 c 0,0 40.12951,0 60,0 20,0 40,19.4856 40,40.00002 0,20 -20,40 -40,40 -20.0296,0 -60,0 -60,0 l 0,-80.00002 z",
        "m 75,0 a 10,10 0 1 1 -20,0 10,10 0 1 1 20,0 z"]
    },
  ]

  function initDraw(){


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
    var onType  = {str: 'ON',  fn: function(){ return true },  paths: ["m -40,-40 h 80 v 80 h -80 z"] }
    var offType = {str: 'OFF', fn: function(){ return false }, paths: ["m -40,-40 h 80 v 80 h -80 z"] }
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
        'M', [d.from.x + gS/2, d.from.y + (d.fromN ? -gS*.1 : gS*.1)],
        'h', d.vX,
        'V', d.to.y + (d.toN ? -gS*.4 : gS*.4),
        'L', [d.to.x - gS/2, d.to.y + (d.toN ? -gS*.4 : gS*.4)]
      ].join('')
    })

    var actualWidth = width + margin.left + margin.right
    //add elements to the page
    var svgBase = d3.select('[data-module="circuit"]')
        .style('margin-left', Math.min(-20, 740 - actualWidth)/2 + 'px')
        .style('opacity', 1)
      .insert('svg', ".bot")
        .attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})

    svgBase.append('rect').attr({width: actualWidth, height: height + margin.top + margin.bottom})
        .style('fill', '#fff')

    var svg = svgBase
      .append('g').translate([margin.left, margin.top])





    var wireBotEls = svg.dataAppend(wires, 'path.wire.bot').attr('d', ƒ('pathStr'))
        .style('stroke', 'lightgrey')
    var wireTopEls = svg.dataAppend(wires, 'path.wire.top').attr('d', ƒ('pathStr'))
        .attr('stroke-dasharray', '100% 100%')

    var gateGs = svg.dataAppend(gates, 'g')
        .translate(function(d){ return [d.x, d.y] })
        .each(function(d){ d.sel = d3.select(this) })

    // gateGs.append('rect')
    //     .style({stroke: 'black', fill: 'darkgrey'})
    //     .attr({x: -gS/2, y: -gS/2, width: gS, height: gS})

    gateGs.append('g.gate-icon')
      .dataAppend(ƒ('type', 'paths'), 'path.background')
        .attr('d', ƒ())

    gateGs.append('g.gate-icon')
      .dataAppend(ƒ('type', 'paths'), 'path.foreground')
        .attr('d', ƒ())

    gateGs.append('text')
        .text(ƒ('type', 'str'))
        .attr({'text-anchor': 'middle', dy: '.33em'})
        .style('font-size', '68%')




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

      gateGs.selectAll('g.gate-icon').filter(ƒ('changedOn'))
        .transition(uuid).delay(function(d){ return (d.i - i)*300+ 200})
          .style('fill', color)
          .style('fill-opacity', .5)
        .transition(uuid).duration(300)
          .style('fill-opacity', 1)

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


      function color(d){ return d.on ? '#00c770' : '#f94600' }
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

      var sel = d3.select(this)

      sel.selectAll('.gate-icon').remove()
      sel.append('g.gate-icon')
        .dataAppend(ƒ('type', 'paths'), 'path.background')
          .attr('d', ƒ())

      sel.append('g.gate-icon')
        .dataAppend(ƒ('type', 'paths'), 'path.foreground')
          .attr('d', ƒ())

      sel
        .select('text').text(d.type.str)

      this.appendChild(sel.select('text').node())        

      update(d.i)
    })


    window.setInterval(function(){
      if (!module.active) return

      var d = gatesByCol[0].values[Math.floor(Math.random()*8)]
      d.type = d.type == onType ? offType : onType
      d.sel.select('text').text(d.type.str)
      update(0)
    }, 3000)

  }


  var module = {sel: d3.select('[data-module="circuit"]')}
  addModule(module)



  // paulbot :-/
  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "This is simulated circuitry that’s computing as you watch. The switches on the left turn the current on and off at random, and the logic gates direct the flow of the current. Click the boxes to change the circuits. Enough of these can compute anything computable."
    }
  ];

  module.oninit = function(){
    initDraw()
    module.bot.dialogue(dialogue)
  }

})();
