!(function(){

  var module = { sel: d3.select('[data-module="tinder"]'), minWidth: 840 }
  addModule(module)

	// module.bot = bot();
  // module.sel.append("div.bot").call(module.bot);

  var logoHolder = module.sel.append("div.coder-logo");
	var logo = logoHolder.append("img").attr("src","images/coder_logo.jpg");
	var appscreen = module.sel.append("div.screen");

	var code = appscreen.append("pre").append("code");

	var arrowBox = appscreen.append("div.arrow_box")
	var talkbubble = arrowBox.append("div.talkbubble").html("Some code is beautiful and you want to read it, reuse it, and take it into your program and your heart. Some code is annoying and pretentious, and some code looks good at first and turns out to be kind of mean. Estimating code quality is a big part of programming. Go on—judge.");
	var ok = arrowBox.append("div.ok").html("[OK]");

	var pbotHolder = appscreen.append("div.pbot-holder");
	var pbotGif = pbotHolder.append("img").attr("src","images/emotes/explaining2.gif")

	var footer = appscreen.append("div.footer");
	var name = footer.append("h3");
	var bio = footer.append("p");

	var dislikeHolder = module.sel.append("div.dislike-holder");
	var likeHolder = module.sel.append("div.like-holder");
	var buttonDislike = dislikeHolder.append("div.button.dislike");
	var buttonLike = likeHolder.append("div.button.like");
	var choiceButtons = d3.selectAll("div.button.dislike,div.button.like");

	var stepCount = 0;

	var codeSamples = [
		{
			"code": "remotedb.allDocs({\n  include_docs: true,\n  attachments: true\n}).then(function (result) {\n  var docs = result.rows;\n  docs.forEach(function(element) {\n    localdb.put(element.doc).then(function(response) {\n      alert(\"Pulled doc with id \" + element.doc._id + \" and added to local db.\");\n    }).catch(function (err) {\n      if (err.status == 409) {\n        localdb.get(element.doc._id).then(function (resp) {\n          localdb.remove(resp._id, resp._rev).then(function (resp) {",
			"bio": "Hey girl, I asynchronously fetch records from a remote database and store them locally, while handling errors with aplomb.",
			"name": "fetchFromServer",
			"link": "https://github.com/blackberry/BB10-WebWorks-Community-Samples/blob/d6ee75fe23a10d2d3a036013b6b1a0c07a542099/pdbtest/www/js/index.js#L190",
			"paulbot": "This function manages to keep a lot of promises that ultimately aren’t worth much; at that rate, he could’ve just called me back.",
			"correctAnswer": 0,
			"top":180
		},
		{
			"code": "remotedb.allDocs(...).then(function (resultOfAllDocs) {\n  return localdb.put(...);\n}).then(function (resultOfPut) {\n  return localdb.get(...);\n}).then(function (resultOfGet) {\n  return localdb.put(...);\n}).catch(function (err) {\n  console.log(err);\n});",
			"bio": "My tidily composed promises are entirely without side effects, and I’ll be honest about any errors.",
			"name": "Local DB Hottie",
			"link": "http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html",
			"paulbot": "This is so much better-proportioned than the last one.",
			"correctAnswer": 1,
			"top":230
		},
		{
			"code": "function d3_formatPrefix(d, i) {\n  var k = Math.pow(10, abs(8 - i) * 3);\n  return {\n    scale: i > 8 ? function(d) {\n      return d / k;\n    } : function(d) {\n      return d * k;\n    },\n    symbol: d\n  };\n}",
			"bio": "Worlds collide! I take primitive numbers the way I understand them and help adapt them to your historical conventions of thousands-grouping and Greek prefixes.",
			"name": "d3_formatPrefix",
			"link": "https://github.com/mbostock/d3/blob/a40a611d6b9fc4ff3815ca830d86b6c00d130995/d3.js#L2195",
			"paulbot": "A little enigmatic, but an elegant and compact function.",
			"correctAnswer": 1,
			"top":230
		},
		{
			"code": "String::getStatements = ->\n  # ... stuff\n  while chars.length > 0\n    # ... stuff\n    if (char in QUOTES and closing in QUOTES) \\n    or (char in PUNCTUATION and closing in PUNCTUATION) \\n    or (chars.length is 0)\n      # ... stuff\n      if chars.length is 0 or doBreak\n        if current.length > 0\n          # ... stuff\n          lastCap = null\n      else\n        closing = \".\"\n    else if (char in QUOTES)\n      closing = char\n  statements\n  \nSECTION = 'run.coffee'",
			"bio": "I’m spontaneous. I like to make plans and throw things together at the last minute. Let’s get messy and see what happens!",
			"name": "Save Publishing",
			"link": "https://github.com/ftrain/savepublishing/blob/master/htdocs/coffee/src/string.coffee#L112",
			"paulbot": "Too much indenting is a bad sign. Sloppy.",
			"correctAnswer": 0,
			"top":190
		},
		{
			"code": "# Invokes interceptor with the obj, and then returns obj.\n# The primary purpose of this method is to \"tap into\" a method chain, in order to perform operations on intermediate results within the chain.\n_.tap = (obj, interceptor) ->\n  interceptor obj\n  obj",
			"bio": "What you see is what you get. I’m upfront and honest about what I bring to the table.",
			"name": "TapThat69",
			"link": "https://github.com/jashkenas/underscore/blob/4be6a194cdc039c7a1cbcef8812027289f997b20/underscore.js#L431",
			"paulbot": "Ooh! Look at all that clearly documented code! Sexy. Thanks for playing!",
			"correctAnswer": 1,
			"top":250
		}
	];

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "What, you don't think 'pretty' and 'ugly' can apply to code? Take a look at these specimens! They run the gamut. Go on, judge it."
    },
    { "emote": "chill" }
  ];

	module.oninit = function() {
		arrowBox
			.transition().duration(300)
			.style("opacity",1);
		choiceButtons
			.style("opacity",0.3)
			.classed("nohover", true)
			.on("click", false);
		pbotHolder
			.transition().duration(300)
			.style("opacity",1);
	}

	function paulTalk(txt) {
		choiceButtons
			.style("opacity",0.3)
			.classed("nohover", true)
			.on("click", false);
		
		talkbubble.html(txt);

		arrowBox.transition().duration(300).style("opacity",1);
		pbotHolder.transition().duration(300).style("opacity",1);

		if (stepCount+1 == codeSamples.length) {
			ok.text("")
		}
	}

	function makeChoice() {
		var el = d3.select(this);
		var cls = el.attr("class");
		
		var feedback = "<div class='feedback'>I agree.</div>";
		if (cls == "button like" && codeSamples[stepCount].correctAnswer == 0) {
			feedback = "<div class='feedback'>I disagree.</div>"
		} else if (cls == "button dislike" && codeSamples[stepCount].correctAnswer == 1) {
			feedback = "<div class='feedback'>I disagree.</div>"
		}

		d3.selectAll(".selected").classed("selected", false);
		paulTalk(feedback+codeSamples[stepCount].paulbot);
		stepCount = stepCount + 1;
	}

	// click ok and continue
	ok.on("click",function(){

		// why have this here? 
		// bc otherwise the click behavior below changes when the step changes, which is too soon. 
		// ugly code, swipe left.
		var url = codeSamples[stepCount].link;

		name.text(codeSamples[stepCount].name).on("click", function() { window.open(url) });
		bio.text(codeSamples[stepCount].bio);
		code.text(codeSamples[stepCount].code);

    hljs.highlightBlock(code.node());

		arrowBox.transition().duration(300).style("opacity",0);
		arrowBox.transition().delay(300).style("top",codeSamples[stepCount].top+"px");
		pbotHolder.transition().duration(300).style("opacity",0);
		
		choiceButtons
			.style("opacity",1)
			.classed("nohover", false)
			.on("click", makeChoice);

	});

})();
