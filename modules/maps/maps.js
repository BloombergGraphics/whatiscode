!(function(){
  var module = {sel: d3.select('[data-module="maps"]'), oninit: oninit}
  addModule(module)

  module.sel.selectAll("svg g text").style("opacity",0);
  var groups = module.sel.selectAll("svg g")
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
  	
  	module.sel.selectAll("svg g text")
  		.transition().delay(2000).duration(500)
  		.style("opacity",1);
  }

})()