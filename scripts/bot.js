'use strict';

function bot() {

  var minDelay = 100,
      maxDuration = 300;

  var sel,
      botName = "",
      script,
      dialogue,
      responses,
      learninal;

  var speech,
      speechText,
      speechTimer;

  var code,
      codeText,
      codeTimer;

  function bot(name) {
    sel = d3.select("body").append("div").classed("bot", true).attr("id", botName);
    dialogue = sel.append("div").classed("dialogue", true);
    speech = dialogue.append("div").classed("speech", true);
    code = dialogue.append("div").classed("code", true);
    responses = dialogue.append("div").classed("responses", true);

  }

  bot.botName = function(_) {
    if (!arguments.length) return botName;
    botName = _;
    return bot;
  };

  bot.learninal = function(_) {
    if (!arguments.length) return learninal;
    learninal = _;
    return bot;
  };

  bot.jumpTo = function(coords) {
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }
    sel.style("left", coords[0] + "px")
      .style("top", coords[1] + "px");
    return bot;
  }

  bot.goTo = function(coords) {
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }

    sel
      .transition()
      .duration(1000)
      .style("left", coords[0] + "px")
      .style("top", coords[1] + "px");

    return bot;
  }

  bot.show = function() {
    sel.style("opacity", 1);
    return bot;
  }

  bot.hide = function() {
    sel.style("opacity", 0);
    return bot;
  }

  bot.pulse = function() {
    sel
      .style("width", "20px")
      .style("height", "20px")
      .transition()
      .duration(750)
      .style("width", "10px")
      .style("height", "10px");

    return bot;
  }

  bot.click = function(target, callback) {
    var coords = coordsFromSel(target);

    bot.show();

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
        });

    return bot;
  }

  bot.speak = function(text, callback) {

    if(!text) text="";
    var delay = Math.min(minDelay, maxDuration / text.length);

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

    return bot;
  }

  bot.emote = function(src) {
    sel.style('background-image', "url('images/emotes/" + src + "')");
    return bot;
  }

  bot.eval = function(text, callback) {

    if(!text) text="";
    var delay = Math.min(minDelay, maxDuration / text.length);

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

    return bot;
  }

  bot.responses = function(choices) {

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

        if(script.test && !script.test()) {
          bot.speak("Sorry, try again.");
          return;
        }

        bot.script(d);
      });

    rSel.exit()
      .remove();

    return bot;
  }

  bot.script = function(_) {

    _.hasSeen = true;
    _.speak = d3.functor(_.speak);

    script = _;

    if(_.do) _.do.call(this, _);

    bot
      .responses([])
      .speak("")
      .eval("")
      .speak(_.speak(), function() {
        bot.eval(_.eval, function() {
          bot.responses(_.responses);
        });
      });

    return bot;
  }

  bot.destroy = function() {

    sel.transition().style("opacity",0);

    return bot;
  }

  function coordsFromSel(sel) {
    var bounds = sel.node().getBoundingClientRect();
    return [bounds.left + bounds.width/2, bounds.top + bounds.height/2];
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

  return bot;
}
