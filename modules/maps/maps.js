!(function(){
  var module = {sel: d3.select('#code-atlas'), oninit: oninit}
  addModule(module)

  //called when scrolled into view
  function oninit(){
    d3.select('#code-atlas').text('LOADING')
      .transition().duration(2000)
        .style('font-size', '200%')
  }

})()