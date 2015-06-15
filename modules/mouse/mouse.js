!(function(){

  var module = {sel: d3.select('[data-module="mouse"]')}
  addModule(module)

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "Move your mouse, see the events. Every time you do something, your computer knows about it. That’s its job. And sometimes marketers are listening and your Web browser reports back to them. That’s their job! Is that happening right now on this website? Great question!"
    },
    { "emote": "chill",
      "prompts": [{"prompt": "Stop it", do: function() { module.disabled = true; } }] }
  ];

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  module.oninit = function() {
    module.bot.dialogue(dialogue);
    mouseEvents();
  }

  function mouseEvents() {

    var eventHandlers = {
      "mousemove": drawMouse,
      "click": drawMouse,
      "dblclick": drawMouse
    };

    for(var eventName in eventHandlers) {
      d3.select(window).on(eventName+".logger", eventHandlers[eventName]);
    }

    function drawMouse(e) {

      if(!module.active || module.disabled) return;

      var xScale = d3.scale.linear().domain([0,$(window).width()]).range([0, 255]);
      var xScale2 = d3.scale.linear().domain([0,$(window).width()]).range([255, 0]);
      var yScale = d3.scale.linear().domain([0,$(window).height()]).range([0, 255]);
      var color = "rgb("+ xScale(d3.event.clientX).toFixed() + "," + yScale(d3.event.clientY).toFixed() + "," + xScale2(d3.event.clientX).toFixed() +")";

      d3.select("body")
        .append("div")
        .classed("event-log", true)
        .classed(d3.event.type, true)
        .style("position", "fixed")
        .style("left", d3.event.clientX+"px")
        .style("top", d3.event.clientY+"px")
        .style("transform", "translate(-50%,-50%) rotate("+ (Math.random()*60-30).toFixed() +"deg)")
        .style("-webkit-transform", "translate(-50%,-50%) rotate("+ (Math.random()*60-30).toFixed() +"deg)")
        .style("-moz-transform", "translate(-50%,-50%) rotate("+ (Math.random()*60-30).toFixed() +"deg)")
        .style("-ms-transform", "translate(-50%,-50%) rotate("+ (Math.random()*60-30).toFixed() +"deg)")
        .style("color", color)
        .html(d3.event.type + "<br/><small>(" + d3.event.clientX + ", " + d3.event.clientY + ")</small>")
        .transition()
        .ease("exp-out")
        .duration(10000)
        .style("opacity", 0)
        .remove();
    }
  }

})();
