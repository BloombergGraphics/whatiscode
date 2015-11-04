!(function(){
  var width = innerWidth,
      height = innerHeight;

  var canvas = d3.select('#background-canvas').append("canvas")
      .attr({width: width, height: height})


  d3.select(window).on('resize.background', function(){
    width  = innerWidth
    height = innerHeight
    canvas.attr({width: width, height: height})
  })


  var ctx = canvas.node().getContext("2d");

  ctx.fillStyle = '#f94600'
  ctx.fillRect(0, 0, width, height)

  var shapes = [],
      curTime = 0,
      l = 14,
      unload = function(){ shapes = shapes.filter(function(d){ d.start > curTime }) }

  function load(module){
    // console.log('loading')
    setTimeout(function(){ module.active = false }, 7000)
  }

  d3.timer(function(t){
    curTime = t

    shapes.forEach(function(s, i){
      if (t < s.start || i > 8000) return

      var u = (t - s.start)/(s.end - s.start)

      if (u > 1){
        u = 1
        s.done = true
      }

      ctx.fillStyle = s.fill
      if (s.type == 'rect'){
        var a0 = s.sV[0]*(1 - u) + s.eV[0]*u
        var a1 = s.sV[1]*(1 - u) + s.eV[1]*u
        var a2 = s.sV[2]*(1 - u) + s.eV[2]*u
        var a3 = s.sV[3]*(1 - u) + s.eV[3]*u
        ctx.fillRect(a0, a1, a2, a3)
      }
      if (s.type == 'circle'){
        var a0 = s.sV[0]*(1 - u) + s.eV[0]*u
        var a1 = s.sV[1]*(1 - u) + s.eV[1]*u
        var a2 = s.sV[2]*(1 - u) + s.eV[2]*u

        ctx.beginPath()
        ctx.arc(a0, a1, a2, 0, Math.PI*2, true)
        ctx.closePath()
        ctx.fill()
      }
      if (s.type == 'triangle'){
        var x0 = s.sV[0]*(1 - u) + s.eV[0]*u
        var y0 = s.sV[1]*(1 - u) + s.eV[1]*u
        var x1 = s.sV[2]*(1 - u) + s.eV[2]*u
        var y1 = s.sV[3]*(1 - u) + s.eV[3]*u
        var x2 = s.sV[4]*(1 - u) + s.eV[4]*u
        var y2 = s.sV[5]*(1 - u) + s.eV[5]*u

        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.fill()
      }
    })

    shapes = shapes.filter(function(s){ return !s.done })
  })


  // wave squares
  !(function(){
    var module = {sel: d3.select('#why-are-coders-angry'), active: false, minWidth: 600, onunload: unload, onload: load}
    addModule(module)

    var colors = [green, Lblue, purple]
    var offset = 1

    setInterval(function(){
      if (!module.active) return
      var speed = Math.random()*.0003 + .2
      offset++
      d3.range(0, width + l, l).forEach(function(x, i){
        d3.range(0, height + l, l).forEach(function(y, j){
          if (!!((i + j + offset) % 4)) return
          if (Math.random() < .3) return
          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'rect',
              start: curTime + (i + j)*40*speed + Math.random()*200,
              sV: [x, y, 0, 0],
              eV: [x, y, l, l],
              fill: offset % 1000 ? colors[offset % 3] : 'white'
            }
          shape.end = shape.start + 500
          shapes.push(shape)
        })
      })

    }, 800)
  })()
  //sprial squares
  !(function(){
    var module = {sel: d3.select('#background-hook'), active: false, minWidth: 600, onunload: unload, onload: load}

    //wait 2 sec to auto play, looks v. laggey otherwise
    setTimeout(function(){
      module.active = true
    }, 2800)
    //pause after 5
    setTimeout(function(){
      module.active = false
    }, 10800)

    var colors = [orange, purple, red]
    var offset = 1
    var l2 = l*2
    setInterval(function(){
      if (!module.active) return

      offset++
      d3.range(0, width + l, l2).forEach(function(x, i){
        d3.range(0, height + l2, l2).forEach(function(y, j){
          if (!!((i + j + offset) % 2)) return
          if (Math.random() < .3) return

          var d = Math.random() < .5  //shape moves down
          var r = Math.random() < .5  //shape moves l2eft

          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'rect',
              start: curTime + d*1000 + r*1000 + (d && !r)*1000*2 + Math.random()*400,
              sV: [r ? x : x + l2, d ? y : y + l2, 0, 0],
              eV: [x, y, l2, l2],
              fill: offset % 1800 ? colors[offset % 3] : 'white'
            }
          shape.end = shape.start + 500
          shapes.push(shape)
        })
      })

    }, 5/4*1000)
  })()

  //triangles
  !(function(){
    var module = {sel: d3.select('#the-triumph-of-middle-management'), active: false, minWidth: 600, onunload: unload, onload: load}

    addModule(module)

    var colors = [orange, Lpurple]
    var offset = 1
    setInterval(function(){
      if (!module.active) return


      var x0 = Math.cos(Math.PI/6 + Math.PI*6/3)*l*3
      var y0 = Math.sin(Math.PI/6 + Math.PI*6/3)*l*3
      var x1 = Math.cos(Math.PI/6 + Math.PI*2/3)*l*3
      var y1 = Math.sin(Math.PI/6 + Math.PI*2/3)*l*3
      var x2 = Math.cos(Math.PI/6 + Math.PI*4/3)*l*3
      var y2 = Math.sin(Math.PI/6 + Math.PI*4/3)*l*3

      offset++
      d3.range(0, width + l, l*3).forEach(function(x, i){
        d3.range(0, height + l, l*3).forEach(function(y, j){
          // if (!!((i + j + offset) % 2)) return
          if (Math.random() < .9) return

          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'triangle',
              start: curTime + 1000 - j*30,
              sV: [x, y, x, y, x, y],
              eV: [x + x0, y + y0, x + x1, y + y1, x + x2, y + y2],
              fill: offset % 1800 ? colors[offset % 2] : 'white'
            }

          if (offset % 3 == 0){
            shape.sV[0] += x0
            shape.sV[1] += y0
            shape.sV[2] += x1
            shape.sV[3] += y1
          }
          if (offset % 3 == 1){
            shape.sV[2] += x1
            shape.sV[3] += y1
            shape.sV[4] += x2
            shape.sV[5] += y2

          }
          if (offset % 3 == 2){
            shape.sV[0] += x0
            shape.sV[1] += y0

            shape.sV[4] += x2
            shape.sV[5] += y2
          }
          shape.end = shape.start + 500
          shapes.push(shape)
        })
      })

    }, 1*1000)
  })()


  //tears
  !(function(){
    var module = {sel: d3.select('#how-are-apps-made'), active: false, minWidth: 600, onunload: unload, onload: load}

    addModule(module)

    var colors = [green, blue, purple]
    var offset = 1
    setInterval(function(){
      if (!module.active) return

      offset++
      var size = Math.random()
      d3.range(0, width + l, l*10).forEach(function(x, i){
        d3.range(0, height + l, l*10).forEach(function(y, j){
          // if (!!((i + j + offset) % 2)) return
          if (Math.random() < .7) return

          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'circle',
              start: curTime + Math.random()*1500,
              sV: [x, y - 200 , 0],
              eV: [x, y, l*3 + size*l*5*size],
              fill: offset % 1800 ? colors[((Math.random() < .3) + offset) % 3] : 'white'
            }
          shape.end = shape.start + 1500 + size*400
          shapes.push(shape)
        })
      })

    }, 1500)
  })()


  //circles
  !(function(){
    var module = {sel: d3.select('#the-time-you-attended-the-e-mail-address-validation-meeting'), active: false, minWidth: 600, onunload: unload, onload: load}
    addModule(module)

    var colors = [red, purple, orange]
    var offset = 1
    setInterval(function(){
      if (!module.active) return

      offset++
      var size = Math.random()
      d3.range(0, width + l, l*10).forEach(function(x, i){
        d3.range(0, height + l, l*10).forEach(function(y, j){
          // if (!!((i + j + offset) % 2)) return
          // if (Math.random() < .3) return

          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'circle',
              start: curTime + Math.random()*4,
              sV: [x, y, 0],
              eV: [x, y, l*3 + Math.random()*l*5*size],
              fill: offset % 1800 ? colors[offset % 3] : 'white'
            }
          shape.end = shape.start + 1500
          shapes.push(shape)
        })
      })

    }, 1500/2.3)
  })()



  //different sized squares
  !(function(){
    var module = {sel: d3.select('#lets-begin'), active: false, minWidth: 600, onunload: unload, onload: load}
    addModule(module)

    var colors = [blue, green]
    var offset = 1
    setInterval(function(){
      if (!module.active) return

      offset++
      var sizeI = Math.ceil(Math.random()*3.5 + .5)
      // size = Math.floor((offset % 2) + Math.random()*2.5)
      // size = offset % 5
      var size = sizeI*sizeI*.8
      d3.range(0, width + l, l*size).forEach(function(x, i){
        d3.range(0, height + l, l*size).forEach(function(y, j){
          if (!!((i + j + sizeI + (Math.random() < .1)) % 2)) return
          if (Math.random() < .3) return

          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'rect',
              start: curTime + Math.random()*4,
              sV: [x + l*size/2, y + l*size/2, 0, 0],
              eV: [x, y, l*size, l*size],
              fill: offset % 1800 ? colors[offset % 2] : 'white'
            }
          if (size > 4) shape.fill = colors[Math.floor(Math.random()*2)]
          shape.end = shape.start +800
          shapes.push(shape)
        })
      })

    }, 1/4*1000)
  })()

  //down wave
  !(function(){
    var module = {sel: d3.select('#why-are-programmers-so-intense-about-languages'), active: false, minWidth: 600, onunload: unload, onload: load}
    addModule(module)

    var colors = [orange, red]
    var offset = 1
    setInterval(function(){
      if (!module.active) return

      var speed = Math.random()*.5 + .5
      speed = 1
      offset++
      var m = offset % 4
      d3.range(0, width + l, l).forEach(function(x, i){
        d3.range(0, height + l, l).forEach(function(y, j){
          if (!((i + j + offset) % 5)) return
          if (Math.random() < .6) return

          var stagger = speed*40 + Math.random()*5
          var start = curTime
          var sV = []
          if        (m == 0){
            start += j*stagger
            sV = [x, y, l, 0]
          } else if (m == 1){
            start += (width /l - i)*stagger
            sV = [x + l, y, 0, l]
          } else if (m == 2){
            start += (height/l - j)*stagger
            sV = [x, y + l, l, 0]
          } else if (m == 3){
            start += i*stagger
            sV = [x, y, 0, l]
          }

          var shape =
            { x: x,
              y: y,
              i: i,
              j: j,
              type: 'rect',
              start: start,
              sV: sV,
              eV: [x, y, l, l],
              fill: offset % 1000 ? colors[offset % 2] : 'white'
            }
          shape.end = shape.start + 200*Math.random()
          shapes.push(shape)
        })
      })

    }, 2000)
  })()

})();


