!(function(){

  var module = {sel: d3.select('[data-module="maps"]'), oninit: oninit, minWidth: 1270}
  addModule(module)

  module.sel.classed("bigimgWrap", true);
  var intro = d3.select('[data-module="maps"] .maps-intro')
    .html("<b>CODE ATLAS</b> Stack Overflow, a website for coders, asked users around the world to tell them which languages and technologies they’ve worked with over the past year. JavaScript was the most-selected language by far. Here, we show which technologies are used at an unusually high rate in each country.")
    .style("opacity",0);

  var globes = [
    {
      "language":"ios",
      "position": {
        "x":8,
        "y":195
      }
    },
    {
      "language":"android",
      "position": {
        "x":130,
        "y":114
      }
    },
    {
      "language":"c",
      "position": {
        "x":212,
        "y":76
      }
    },
    {
      "language":"cplusplus",
      "position": {
        "x":358,
        "y":74
      }
    },
    {
      "language":"csharp",
      "position": {
        "x":307,
        "y":349
      }
    },
    {
      "language":"python",
      "position": {
        "x":594,
        "y":34
      }
    },
    {
      "language":"vb",
      "position": {
        "x":668,
        "y":42
      }
    },
    {
      "language":"wordpress",
      "position": {
        "x":823,
        "y":115
      }
    },
    {
      "language":"ruby",
      "position": {
        "x":646,
        "y":195
      }
    },
    {
      "language":"angular",
      "position": {
        "x":544,
        "y":417
      }
    },
    {
      "language":"node",
      "position": {
        "x":465,
        "y":386
      }
    }
  ];

  var textlayer = d3.select('[data-module="maps"] .maps-text-layer').style("opacity",0).style('display', 'block')

  var gimages = d3.select('[data-module="maps"] .globies')
    .selectAll(".globe-langs")
    .data(globes)
    .enter().append("img")
      .attr("class","globe-langs")
      .attr("src",function(d){ return "modules/maps/images/"+d.language+".png" })
      .style("left",function(d,i){ 
        var offset = (i%2 == 0) ? -1000 : 1000;
        return (d.position.x+offset)+"px" 
      })
      .style("top",function(d,i){ 
        var offset = (i%2 == 0) ? 1000 : -1000;
        return (d.position.y+offset)+"px" 
      });

  var sources = d3.select('[data-module="maps"] .maps-sources')
    .attr("class","maps-sources photoCaption")
    .style("line-height","12px")
    .html("Languages shown for each country are those with the highest percent difference between that country's selection rate and the average selection rate. Some ancillary technologies, like SQL Server, were left out.")
    .style("opacity",0)



  //called when scrolled into view
  function oninit(){
    gimages.transition().duration(1000)
      .style("left",function(d,i){ return d.position.x+"px" })
      .style("top",function(d,i){ return d.position.y+"px" });

    textlayer.transition().delay(1000).duration(500).style("opacity",1);
    intro.transition().delay(1000).duration(500).style("opacity",1);
    sources.transition().delay(1000).duration(500).style("opacity",1);

    // d3.xhr("modules/maps/map.svg", function(error, svg) {

    //   module.sel.append("div#code-atlas").html(svg.response);
    //   module.sel.selectAll("svg g text").style("opacity",0);

    //   var groups = module.sel.selectAll("svg g")
    //     .attr("transform",function(d,i){ 
    //       var x = (i%2 == 0) ? -1000 : 1000;
    //       var y = (i%2 == 0) ? 1000 : -1000;
    //       return "translate("+x+","+y+")";
    //     });

    //   groups
    //     .transition().delay(function(d,i){ return i*100 }).duration(1000)
    //     .attr("transform",function(d){ return "translate(0,0)" });
      
    //   module.sel.selectAll("svg g text")
    //     .transition().delay(2000).duration(500)
    //     .style("opacity",1);

    // })
  }

})()
