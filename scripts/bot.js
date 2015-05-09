'use strict';

function bot() {

  var minDelay = 100,
      maxDuration = 300;

  var sel,
      botName = "",
      sidebar,
      messages,
      learninal,
      learninalSel,
      pendingDialogue;

  function robot(name) {
    sel = d3.select("body").append("div").classed("bot", true).attr("id", botName);
    sidebar = sel.append("div").classed("sidebar", true);
    messages = sidebar.append("div").classed("messages", true);
    learninalSel = sidebar.append("div").classed("learninal", true);

    learninal = new Sandbox.View({
      el: learninalSel[0],
      model: new Sandbox.Model(),
      placeholder: "Hit 'Enter' to run code"
    });

  }

  robot.botName = function(_) {
    if (!arguments.length) return botName;
    botName = _;
    return robot;
  };

  robot.jumpTo = function(coords) {
    coords = d3.functor(coords).call(robot);
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }
    sel.style("left", coords[0] + "px")
      .style("top", coords[1] + "px");
    return true;
  }

  robot.goTo = function(coords) {
    coords = d3.functor(coords).call(robot);
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }

    return new Promise(
      function(resolve,reject) {
        sel
          .transition()
          .duration(1000)
          .style("left", coords[0] + "px")
          .style("top", coords[1] + "px")
          .each("end", resolve(true));
      }
    );
  }

  robot.show = function(bool) {
    bool = d3.functor(bool).call(robot);
    sel.style("opacity", bool ? 1 : 0);
    return true;
  }

  robot.emote = function(emotion) {
    emotion = d3.functor(emotion).call(robot);
    sel.style('background-image', "url('images/emotes/" + emotion + ".gif')");
    return true;
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
        },delay);

      }
    )
  }

  robot.eval = function(text) {

    if(!text) text="";
    text = d3.functor(text).call(robot);

    return new Promise(
      function(resolve,reject) {

        var code = messages.append("div").classed("message", true).classed("code", true);
        var delay = Math.min(minDelay, maxDuration / text.length);
        var codeTimer = setInterval(function() {
          if(code.text().length == text.length) {
            clearInterval(codeTimer);
            eval(text);
            resolve(code);
          }
          code.text(text.substr(0,code.text().length+1));
        },delay);

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
          .text(function(d) { return "» " + d.prompt; })
          .on("click", function(d) {

            d3.select(this).classed("clicked", true);

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

        return true;

      }
    );
  }

  robot.test = function(test) {
    return test();
  }

  robot.dialogue = function(pending) {

    pending = d3.functor(pending).call(robot);
    pendingDialogue = pending;

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

  return robot;
}
