'use strict';

function bot() {

  var minDelay = 100,
      maxDuration = 300;

  var sel,
      botName = "",
      sidebar,
      messages,
      learninal,
      learninalSel;

  function bot(name) {
    sel = d3.select("body").append("div").classed("bot", true).attr("id", botName);
    sidebar = sel.append("div").classed("sidebar", true);
    messages = sidebar.append("div").classed("messages", true);
    learninalSel = sidebar.append("div").classed("sandbox", true);

    learninal = new Sandbox.View({
      el: learninalSel[0],
      model: new Sandbox.Model(),
      placeholder: "Hit 'Enter' to run code"
    });

  }

  bot.botName = function(_) {
    if (!arguments.length) return botName;
    botName = _;
    return bot;
  };

  bot.jumpTo = function(coords) {
    if(coords instanceof d3.selection) {
      coords = coordsFromSel(coords);
    }
    sel.style("left", coords[0] + "px")
      .style("top", coords[1] + "px");
    return true;
  }

  bot.goTo = function(coords) {
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

  bot.show = function(bool) {
    sel.style("opacity", bool ? 1 : 0);
    return true;
  }

  bot.emote = function(emotion) {
    sel.style('background-image', "url('images/emotes/" + emotion + ".gif')");
    return true;
  }

  bot.speak = function(text) {
    return new Promise(
      function(resolve,reject) {

        if(!text) text="";
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

  bot.eval = function(text) {
    return new Promise(
      function(resolve,reject) {

        if(!text) text="";
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

  bot.prompts = function(choices) {
    return new Promise(
      function(resolve,reject) {

        if(!choices) choices = [];
        var responses = messages.append("div").classed("message", true).classed("responses", true);

        var rSel = responses.selectAll(".response")
          .data(choices, function(d) { return d.prompt; });

        rSel.enter()
          .append("div")
          .classed("response", true)
          .text(function(d) { return "» " + d.prompt; })
          .on("click", function(d) {

            if(d.dialogue) {
              bot.dialogue(d.dialogue).then(function() {
                debugger;
                resolve();
              });
            } else {
              resolve();
            }

            // resolve(bot.dialogue(d.dialogue));

          });

        rSel.exit()
          .remove();

        return true;

      }
    );
  }

  bot.test = function(test) {
    return test();
  }

  bot.dialogue = function(pending) {

    return new Promise(
      function(resolve,reject) {

        if(!pending || pending.length == 0) resolve(true);

        var current = pending.shift();
        var promises = [];

        for (var key in current) {
          if (current.hasOwnProperty(key)) {
            promises.push(bot[key].call(bot, current[key]));
          }
        }

        Promise.all(promises).then(function(value) {

          if(pending.length > 0) {
            bot.dialogue(pending).then(function(value) { resolve(value); });
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

  return bot;
}
