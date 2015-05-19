'use strict';

function bot() {

  var minDelay = 100,
      maxDuration = 300;

  var sel,
      botName = "",
      mode = "on",
      face,
      body,
        messages,
        learninal,
        learninalSel,
      pendingDialogue;

  function robot(selection) {

    sel = selection;
    sel.classed("bot", true).attr("id", botName);
    face = sel.append("div").classed("face", true);
    body = sel.append("div").classed("body", true);
    messages = body.append("div").classed("messages", true);
    learninalSel = body.append("div").classed("learninal", true);

    learninal = new Sandbox.View({
      el: learninalSel[0],
      model: new Sandbox.Model(),
      placeholder: "Write code, hit 'Enter'"
    });

    // Listen to dispatcher
    learninal.model.dispatcher.on("evaluate", function(item) {

      var msg = messages.append("div").classed("message", true).classed("eval", true).classed(item._class, true);
      var input = msg.append("pre").append("code").classed("javascript", true).classed("input", true).html(learninal.toEscaped(item.command));
      var output = msg.append("pre").append("code").classed("javascript", true).classed("output", true).html(learninal.toEscaped(item.result));
      body.node().scrollTop = body.node().scrollHeight;

      hljs.highlightBlock(input.node());
      hljs.highlightBlock(output.node());
    })

    return robot;

  }

  robot.botName = function(_) {
    if (!arguments.length) return botName;
    botName = _;
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

  robot.slider = function(config) {

    config = _.extend({
      "onbrush": null,
      "domain": [0,1]
    }, config);

    var message = messages.append("div").classed("message", true).classed("slidey", true);

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

    slider
        .call(brush.event)
      .transition() // gratuitous intro!
        .duration(750)
        .call(brush.extent([70, 70]))
        .call(brush.event);

    function brushed() {
      var value = brush.extent()[0];

      if (d3.event.sourceEvent) { // not a programmatic event
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

        var speech = messages.append("div").classed("message", true).classed("speech", true);
        var delay = Math.min(minDelay, maxDuration / text.length);
        var speechTimer = setInterval(function() {
          if(speech.text().length == text.length) {
            clearInterval(speechTimer);
            resolve(speech);
          }
          speech.text(text.substr(0,speech.text().length+1));
          body.node().scrollTop = body.node().scrollHeight;
        },delay);

      }
    )
  }

  robot.eval = function(text) {

    if(!text) text="";
    text = d3.functor(text).call(robot);

    return new Promise(
      function(resolve,reject) {

        learninal.model.evaluate(text);
        resolve(true);

        // var code = messages.append("div").classed("message", true).classed("code", true);
        // var delay = Math.min(minDelay, maxDuration / text.length);
        // var codeTimer = setInterval(function() {
        //   if(code.text().length == text.length) {
        //     clearInterval(codeTimer);
        //     eval(text);
        //     resolve(code);
        //   }
        //   code.text(text.substr(0,code.text().length+1));
        //   body.node().scrollTop = body.node().scrollHeight;
        // },delay);

      }
    );
  }

  robot.prompts = function(newPrompts) {

    if(!newPrompts) newPrompts = [];
    newPrompts = d3.functor(newPrompts).call(robot);

    return new Promise(
      function(resolve,reject) {

        var responses = messages.append("div").classed("message", true).classed("responses", true);

        var rSel = responses.selectAll(".response")
          .data(newPrompts, function(d) { return d.prompt; });

        rSel.enter()
          .append("div")
          .classed("response", true)
          .text(function(d) { return (d.link ? "☛ " : "» ") + d.prompt; })
          .on("click", function(d) {

            d3.select(this).classed("clicked", true);

            if(d.dialogue) {
              robot.dialogue(d.dialogue).then(function(value) {
                resolve(value);
              });
            } else if(d.link) {
              window.open(d.link, '_blank');
              resolve(true);
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

        if(ms==="scroll") {
          d3.select(window).on('scroll', function() {
            if(isVisible(sel.node())) resolve();
          });
        } else {
          setTimeout(function() { resolve(); }, ms);
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

  robot.dialogue = function(pending) {

    pending = d3.functor(pending).call(robot).slice(0);
    pendingDialogue = pending;
    robot.mode("on");

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
