'use strict';

function ghost() {

  var delay = 100;

  var sel,
      script,
      dialogue,
      responses;

  var speech,
      speechText,
      speechTimer;

  var code,
      codeText,
      codeTimer;

  function casper() {
    // Select the ghost element, if it exists.
    sel = d3.select("body").selectAll("#ghost").data([0]);

    // Otherwise, create the skeletal ghost.
    var gEnter = sel.enter().append("div").attr("id", "ghost");
    dialogue = gEnter.append("div").classed("dialogue", true);
    speech = dialogue.append("div").classed("speech", true);
    code = dialogue.append("div").classed("code", true);
    responses = dialogue.append("div").classed("responses", true);

  }

  function coordsFromSel(sel) {
    var bounds = sel.node().getBoundingClientRect();
    return [bounds.left + bounds.width/2, bounds.top + bounds.height/2];
  }

  casper.jumpTo = function(coords) {
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }
    sel.style("left", coords[0] + "px")
    .style("top", coords[1] + "px");
    return casper;
  }

  casper.goTo = function(coords) {
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }

    sel
    .transition()
    .duration(1000)
    .style("left", coords[0] + "px")
    .style("top", coords[1] + "px");

    return casper;
  }

  casper.show = function() {
    sel.style("opacity", 1);
    return casper;
  }

  casper.hide = function() {
    sel.style("opacity", 0);
    return casper;
  }

  casper.pulse = function() {
    sel
    .style("width", "20px")
    .style("height", "20px")
    .transition()
    .duration(750)
    .style("width", "10px")
    .style("height", "10px");

    return casper;
  }

  casper.click = function(target, callback) {
    var coords = coordsFromSel(target);

    casper.show();

    sel
    .transition()
    .duration(1000)
    .style("left", coords[0] + "px")
    .style("top", coords[1] + "px")
    .transition()
    .duration(100)
    .style("width", "20px")
    .style("height", "20px")
    .each("end", function() { simulate(target.node(), "click"); })
    .transition()
    .duration(1000)
    .style("width", "10px")
    .style("height", "10px")
    .each("end", function(d) {
      callback(target.datum())
    })

    return casper;
  }

  casper.speak = function(text, callback) {

    if(!text) text="";

    clearInterval(speechTimer);
    speechText = text;
    speech.text("");
    speechTimer = setInterval(function() {
      if(speech.text().length == speechText.length) {
        clearInterval(speechTimer);
        if(callback) callback();
      }
      speech.text(speechText.substr(0,speech.text().length+1));
    },delay);

    return casper;
  }

  casper.emote = function(em) {
    var emotes = {
      "default": "url('images/emotes/paul.jpg')",
      "pray": "url('images/emotes/pray.gif')",
      "amiga": "url('images/emotes/amiga.png')"
    }
    sel.style('background-image', emotes[em]);

    return casper;
  }

  casper.eval = function(text, callback) {

    if(!text) text="";

    clearInterval(codeTimer);
    codeText = text;
    code.text("");
    codeTimer = setInterval(function() {
      if(code.text().length == codeText.length) {
        clearInterval(codeTimer);
        eval(codeText);
        if(callback) callback();
      }
      code.text(codeText.substr(0,code.text().length+1));
    },delay);

    return casper;
  }

  casper.responses = function(choices) {

    if(!choices) choices = [{
      "prompt": _.sample([
        "OK, bye.",
        "Cool, thanks.",
        "That's all? Fine.",
        "Oh.",
        "Yeah OK.",
        "Sure pal.",
        "Whatever you say, Paulbot.",
        "Uh huh.",
        "Well. Sure.",
        "Mmmm yeah, see ya!"
        ]),
      "speak": _.sample([
        "Bye!",
        "Peace out!",
        "Till next time!",
        "Keep codin'!",
        "Yup, cheers!",
        "So long, sucka!",
        "Stay classy."
        ]),
      "eval": "paulbot.hide();",
      "responses": []
    }];

    var rSel = responses.selectAll(".response")
      .data(choices, function(d) { return d.prompt; });

    rSel.enter()
      .append("div")
      .classed("response", true)
      .text(function(d) { return "» " + d.prompt; })
      .on("click", function(d) {
        casper.script(d);
      });

    rSel.exit()
      .remove();

    return casper;
  }

  casper.script = function(_) {
    script = _;

    if(_.do) _.do();

    casper
      .responses([])
      .speak("")
      .eval("")
      .speak(_.speak, function() {
        casper.eval(_.eval, function() {
          casper.responses(_.responses);
        });
      });

    return casper;
  }

  casper.destroy = function() {

    sel.transition().style("opacity",0);

    return casper;
  }

  // from http://stackoverflow.com/a/6158050/120290
  // & http://github.com/kangax/protolicious/tree/master/event.simulate.js
  function simulate(element, eventName) {

    var eventMatchers = {
      'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
      'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
    }

    var defaultOptions = {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
    }

    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType) {
      throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
    }

    if (document.createEvent) {
      oEvent = document.createEvent(eventType);
      if (eventType == 'HTMLEvents') {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      } else {
        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
          options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
          options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    } else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      var evt = document.createEventObject();
      oEvent = extend(evt, options);
      element.fireEvent('on' + eventName, oEvent);
    }
    return element;
  }

  function extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  }

  return casper;
}
