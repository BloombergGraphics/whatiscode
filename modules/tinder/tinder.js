!(function(){

  var module = { sel: d3.select('[data-module="tinder"]') }
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
			"code": "remotedb.allDocs({\n\tinclude_docs: true,\n\tattachments: true\n}).then(function (result) {\n\tvar docs = result.rows;\n\tdocs.forEach(function(element) {\n\t\tlocaldb.put(element.doc).then(function(response) {\n\t\t\talert(\"Pulled doc with id \" + element.doc._id + \" and added to local db.\");\n\t\t}).catch(function (err) {\n\t\t\tif (err.status == 409) {\n\t\t\t\tlocaldb.get(element.doc._id).then(function (resp) {\n\t\t\t\t\tlocaldb.remove(resp._id, resp._rev).then(function (resp) {",
			"bio": "Hey girl, I asynchronously fetch records from a remote database and store them locally, while handling errors with aplomb.",
			"name": "fetchFromServer",
			"paulbot": "This function manages to keep a lot of promises that ultimately aren't worth much; at that rate, he could've just called me back."
		},
		{
			"code": "remotedb.allDocs(...).then(function (resultOfAllDocs) {\n\treturn localdb.put(...);\n}).then(function (resultOfPut) {\n\treturn localdb.get(...);\n}).then(function (resultOfGet) {\n\treturn localdb.put(...);\n}).catch(function (err) {\n\tconsole.log(err);\n});",
			"bio": "My tidily composed promises are entirely without side effects, and I'll be honest about any errors.",
			"name": "[Name TK]",
			"paulbot": "This is so much better-proportioned than the last one."
		},
		{
			"code": "function d3_formatPrefix(d, i) {\n\tvar k = Math.pow(10, abs(8 - i) * 3);\n\treturn {\n\t\tscale: i > 8 ? function(d) {\n\t\t\treturn d / k;\n\t\t} : function(d) {\n\t\t\treturn d * k;\n\t\t},\n\t\tsymbol: d\n\t};\n}",
			"bio": "Worlds collide! I take primitive numbers the way I understand them and help adapt them to your historical conventions of thousands-grouping and Greek prefixes.",
			"name": "d3_formatPrefix",
			"paulbot": "Not that broadly useful and a little enigmatic, but a compact li’l function."
		},
		{
			"code": "String::getStatements = ->\n\t# ... stuff\n\twhile chars.length > 0\n\t\t# ... stuff\n\t\tor (chars.length is 0)\n\t\t\t# ... stuff\n\t\t\t\t\t\t\t\t\t\tlastCap = null\n\t\t\t\t\t\telse\n\t\t\t\t\t\t\t\tclosing = \".\"\n\t\t\t\t\t\t\t\t\n\t\t\t\telse if (char in QUOTES)\n\t\t\t\t\t\tclosing = char\n\t\tstatements\n\t\t\nSECTION = 'run.coffee'",
			"bio": "I’m spontaneous. I like to make plans and throw things together at the last minute. Let’s get messy and see what happens!",
			"name": "[Name TK]",
			"paulbot": "See that HTML embedded in the source code? Sure, it gets the job done, but it leaves the door wide open for other things to go wrong."
		},
		{
			"code": "# Invokes interceptor with the obj, and then returns obj.\n# The primary purpose of this method is to \"tap into\" a method chain, in order to perform operations on intermediate results within the chain.\n_.tap = (obj, interceptor) ->\n\tinterceptor obj\n\tobj",
			"bio": "What you see is what you get. I’m upfront and honest about what I bring to the table.",
			"name": "[Name TK]",
			"paulbot": "Ooh! Look at all that clearly documented code! Sexy."
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
	}

	function paulTalk(txt) {
		choiceButtons
			.style("opacity",0.3)
			.classed("nohover", true)
			.on("click", false);
		
		talkbubble.html(txt);

		arrowBox
			.transition().duration(300)
			.style("opacity",1);

		if (stepCount+1 == codeSamples.length) {
			ok.text("")
		}
	}

	function makeChoice() {
		d3.selectAll(".selected").classed("selected", false);
		paulTalk(codeSamples[stepCount].paulbot);
		stepCount = stepCount + 1;
	}

	// click ok and continue
	ok.on("click",function(){
		name.text(codeSamples[stepCount].name);
		bio.text(codeSamples[stepCount].bio);
		code.text(codeSamples[stepCount].code);

    hljs.highlightBlock(code.node());

		arrowBox.transition().duration(300).style("opacity",0);
		
		choiceButtons
			.style("opacity",1)
			.classed("nohover", false)
			.on("click", makeChoice);

	});

})();
