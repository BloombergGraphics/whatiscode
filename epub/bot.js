'use strict';

function bot() {

  var msgDuration = 500;

  var sel,
      botName = "",
      mode = "on",
      face,
      body,
        messages,
        learninal,
        learninalSel,
      pendingDialogue,
      dialogueStep,
      visible,
      attachment;

  function robot(selection) {

    sel = selection;
    sel.classed("bot", true);
    if(botName) sel.attr("id", botName);
    face = sel.append("div").classed("face", true);
    body = sel.append("div").classed("body", true);
    messages = body.append("div").classed("messages", true);
    dialogueStep = messages.append("div.step");
    learninalSel = body.append("div").classed("learninal", true);

    learninal = new Sandbox.View({
      el: learninalSel[0],
      model: new Sandbox.Model(),
      placeholder: "Write code, hit 'Enter'"
    });

    // Listen to dispatcher
    learninal.model.dispatcher.on("evaluate", function(item) {

      var msg = dialogueStep.append("div").classed("message", true).classed("eval", true).classed(item._class, true);
      var input = msg.append("pre").append("code").classed("javascript", true).classed("input", true).html(learninal.toEscaped(item.command));
      var output = msg.append("pre").append("code").classed("javascript", true).classed("output", true).html(learninal.toEscaped(item.result));
      body.node().scrollTop = body.node().scrollHeight;

      hljs.highlightBlock(input.node());
      hljs.highlightBlock(output.node());

      msg.transition().duration(msgDuration)
          .attrTween('evalExpand', function(){ return function(t){ msg.style("transform", "scaleY(" + (.001 + t) + ")") } });
    })

    return robot;

  }

  robot.botName = function(_) {
    if (!arguments.length) return botName;
    botName = _;
    return robot;
  };

  robot.attachment = function(_) {
    if (!arguments.length) return attachment;
    attachment = _;
    return robot;
  };

  robot.visible = function(_) {
    if (!arguments.length) return visible;
    visible = _;
    return robot;
  };

  robot.mode = function(_) {
    // off, tease, on
    if (!arguments.length) return mode;
    mode = d3.functor(_).call(robot);
    sel.attr("data-mode", mode);
    return robot;
  }

  robot.emote = function(emotion) {
    emotion = d3.functor(emotion).call(robot);
    face.style('background-image', "url('images/emotes/" + emotion + ".gif')");
    return true;
  }

  // from http://bl.ocks.org/mbostock/6452972
  // https://twitter.com/bizweekgraphics/status/608467609416298496
  robot.slider = function(config) {

    config = _.extend({
      "onbrush": null,
      "onscroll": null,
      "domain": [0,1]
    }, config);

    var message = dialogueStep.append("div").classed("message", true).classed("slidey", true);

    var margin = {top: 0, right: 25, bottom: 0, left: 25},
        width = message.node().offsetWidth - margin.left - margin.right,
        height = 50 - margin.bottom - margin.top;

    var x = d3.scale.linear()
        .domain(config.domain)
        .range([0, width])
        .clamp(true);

    var brush = d3.svg.brush()
        .x(x)
        .extent([0, 0])
        .on("brush", brushed);

    var svg = message.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var label = message.append("div").classed("label", true);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickSize(0)
          .ticks(0))
      .select(".domain")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "halo");

    var slider = svg.append("g")
        .attr("class", "slider")
        .call(brush);

    slider.selectAll(".extent,.resize")
        .remove();

    slider.select(".background")
        .attr("height", height);

    var handle = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("r", 9);

    slider.call(brush.event);

    if(config.onscroll !== null) {
      d3.select(window).on('scroll.'+botName, function() {
        var top = sel.node().getBoundingClientRect().top;

        if(top<0 || top>window.innerHeight) return;

        var scrollScale = d3.scale.linear()
          .domain([window.innerHeight, 0])
          .range(x.domain());

        slider.call(brush.extent([scrollScale(top), scrollScale(top)]))
          .call(brush.event);

      });
    }

    function brushed() {
      var value = brush.extent()[0];

      if (d3.event.sourceEvent && d3.mouse(this)[0]) { // not a programmatic event
        value = x.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
      }

      handle.attr("cx", x(value));

      if(config.onbrush) {
        label.text(config.onbrush.call(this, value));
      }
    }
  }

  robot.speak = function(text) {

    if(!text) text="";
    text = d3.functor(text).call(robot);

    return new Promise(
      function(resolve,reject) {
        var speech = dialogueStep.append("div")
          .classed("message", true)
          .classed("speech", true)
          .text(text);

        body.node().scrollTop = body.node().scrollHeight;

        speech.transition().duration(msgDuration)
          .attrTween('msgExpand', function(){ return function(t){ speech.style("transform", "scaleY(" + (.001 + t) + ")") } })
          .each("end", function() { resolve(speech); });
      }
    )
  }

  robot.do = function(fn) {
    fn.call(robot);
    return robot;
  }

  robot.eval = function(text) {

    if(!text) text="";
    text = d3.functor(text).call(robot);

    return new Promise(
      function(resolve,reject) {

        learninal.model.evaluate(text);
        resolve(true);

      }
    );
  }

  robot.prompts = function(newPrompts) {

    if(!newPrompts) newPrompts = [];
    newPrompts = d3.functor(newPrompts).call(robot);

    return new Promise(
      function(resolve,reject) {

        var responses = dialogueStep.append("div").classed("message", true).classed("responses", true);

        var rSel = responses.selectAll(".response")
          .data(newPrompts, function(d) { return d.prompt; });

        rSel.enter()
          .append("div")
          .classed("response", true)
          .text(function(d) { return (d.link ? "☛ " : "") + d.prompt; })
          .on("click", function(d) {

            d3.select(this).classed("clicked", true);

            if(d.link) window.open(d.link, '_blank');

            if(d.do) d.do.call(robot);

            if(d.dialogue) {
              robot.dialogue(d.dialogue).then(function(value) {
                resolve(value);
              });
            } else {
              resolve(true);
            }

          });

        rSel.exit()
          .remove();

        body.node().scrollTop = body.node().scrollHeight;

        return true;

      }
    );
  }

  robot.wait = function(ms) {
    return new Promise(
      function(resolve,reject) {
        setTimeout(function() { resolve(); }, ms);
      }
    );
  }

  robot.on = function(event, callback) {
    return new Promise(
      function(resolve,reject) {

        d3.select(window).on(event+"."+botName, function() {
          Promise.all([callback.call(robot,d3.event)]).then(function(value) {
            resolve(value);
          })
        });

      }
    );
  }

  robot.trigger = function(trig) {
    return new Promise(
      function(resolve,reject) {

        if(trig==="in") {
          d3.select(window).on('scroll.'+botName, function() {
            if(!visible && isVisible(sel.node())) {
              visible=true;
              resolve(true);
            }
          });
        } else if(trig==="out") {
          d3.select(window).on('scroll.'+botName, function() {
            if(visible && !isVisible(sel.node())) {
              visible=false;
              resolve();
            }
          });
        } else {
          resolve();
        }

      }
    );
  }

  robot.test = function(testArg) {
    return new Promise(
      function(resolve,reject) {
        learninalSel.style("display", "block");
        learninal.textarea.focus();
        body.node().scrollTop = body.node().scrollHeight;
        var onEvaluate = function(item) {
          if(testArg.call(robot, item)) {
            // if test passes
            learninal.model.dispatcher.off("evaluate", onEvaluate);
            learninalSel.style("display", "none");
            resolve();
          } else {
            // if test fails
          }
        }
        learninal.model.dispatcher.on("evaluate", onEvaluate);
      }
    );
  }

  // dump in actions to be performed in parallel
  robot.async = function(todo) {
    for (var key in todo) {
      if (todo.hasOwnProperty(key)) {
        robot[key].call(robot, todo[key]);
      }
    }
    return true;
  }

  // queue up a sequence of actions to be performed serially
  robot.dialogue = function(pending) {

    pending = d3.functor(pending).call(robot).slice(0);
    pendingDialogue = pending;
    robot.mode("on");

    dialogueStep = messages.append("div.step");

    return new Promise(
      function(resolve,reject) {

        if(!pending || pending.length == 0) resolve(true);

        var current = pending.shift();
        var promises = [];

        for (var key in current) {
          if (current.hasOwnProperty(key)) {
            promises.push(robot[key].call(robot, current[key]));
          }
        }

        Promise.all(promises).then(function(value) {

          if(pending.length > 0) {
            robot.dialogue(pending).then(function(value) { resolve(value); });
          } else {
            resolve(true);
          }

        }, function(reason) {

          reject(reason);

        });

      }
    );

  }

  function coordsFromSel(sel) {
    var bounds = sel.node().getBoundingClientRect();
    return [bounds.left + bounds.width/2, bounds.top + bounds.height/2];
  }

  function isVisible(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
  }

  return robot;
}

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
