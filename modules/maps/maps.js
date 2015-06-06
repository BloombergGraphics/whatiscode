!(function(){
  var module = {sel: d3.select('#code-atlas'), oninit: oninit}
  addModule(module)

  d3.selectAll("#code-atlas svg g text").style("opacity",0);
  var groups = d3.selectAll("#code-atlas svg g")
  	.attr("transform",function(d,i){ 
  		var x = (i%2 == 0) ? -1000 : 1000;
  		var y = (i%2 == 0) ? 1000 : -1000;
  		return "translate("+x+","+y+")";
  	});

  //called when scrolled into view
  function oninit(){
	  groups
  		.transition().delay(function(d,i){ return i*100 }).duration(1000)
  		.attr("transform",function(d){ return "translate(0,0)" });
  	
  	d3.selectAll("#code-atlas svg g text")
  		.transition().delay(2000).duration(500)
  		.style("opacity",1);
  }

})()