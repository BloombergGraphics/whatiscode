!(function(){

  var module = {
		sel: d3.select('[data-module="tinder"]'),
		onload: welcome
	}
  addModule(module)

	module.bot = bot().botName("keybot");
  module.sel.append("div.bot.aside").call(module.bot);

	var screen = module.sel.append("div.screen");

	var name = screen.append("h3");
	var bio = screen.append("p");
	var code = screen.append("pre").append("code");

	var footer = screen.append("div.footer");
	var buttonLike = footer.append("div.button.like");
	var buttonDislike = footer.append("div.button.dislike");


	var codeSamples = [
		{
			"code": "remotedb.allDocs({\n\tinclude_docs: true,\n\tattachments: true\n}).then(function (result) {\n\tvar docs = result.rows;\n\tdocs.forEach(function(element) {\n\t\tlocaldb.put(element.doc).then(function(response) {\n\t\t\talert(\"Pulled doc with id \" + element.doc._id + \" and added to local db.\");\n\t\t}).catch(function (err) {\n\t\t\tif (err.status == 409) {\n\t\t\t\tlocaldb.get(element.doc._id).then(function (resp) {\n\t\t\t\t\tlocaldb.remove(resp._id, resp._rev).then(function (resp) {",
			"bio": "Hey girl, I asynchronously fetch records from a remote database and store them locally, while handling errors with aplomb.",
			"name": "fetchFromServer",
			"paulbot": "This function manages to keep a lot of promises that ultimately aren't worth much; at that right, he could've just called me back."
		},
		{
			"code": "remotedb.allDocs(...).then(function (resultOfAllDocs) {\n\treturn localdb.put(...);\n}).then(function (resultOfPut) {\n\treturn localdb.get(...);\n}).then(function (resultOfGet) {\n\treturn localdb.put(...);\n}).catch(function (err) {\n\tconsole.log(err);\n});",
			"bio": "My tidily-composed promises are entirely without side effects, and I'll be honest about any errors.",
			"name": "?",
			"paulbot": "This is so much better-proportioned than the above."
		},
		{
			"code": "function d3_formatPrefix(d, i) {\n\tvar k = Math.pow(10, abs(8 - i) * 3);\n\treturn {\n\t\tscale: i > 8 ? function(d) {\n\t\t\treturn d / k;\n\t\t} : function(d) {\n\t\t\treturn d * k;\n\t\t},\n\t\tsymbol: d\n\t};\n}",
			"bio": "Worlds collide! I take primitive numbers the way I understand them and help adapt them to your historical conventions of thousands-grouping and Greek prefixes.",
			"name": "d3_formatPrefix",
			"paulbot": "Not that broadly useful and a little enigmatic, but damn pretty compact li’l function."
		},
	];

	function welcome() {
		module.bot.mode("on").speak("What, you don't think 'pretty' and 'ugly' can apply to code? Take a look at these specimans! They run the gamut. Go on, judge it.");
		codeSamples.length ? renderProfile(codeSamples.shift()) : null;
	}

	function renderProfile(profile) {
		name.text(profile.name);
		bio.text(profile.bio);
		code.text(profile.code);
		buttonLike.classed("selected", false).on("click", like);
		buttonDislike.classed("selected", false).on("click", like);

		function like(d,i) {
			d3.select(this).classed("selected", true);
			module.bot.speak(profile.paulbot).then(function() {
				return module.bot.prompts([{
					"prompt": "Next",
					"do": function() { codeSamples.length ? renderProfile(codeSamples.shift()) : null; }
				}]);
			});
		}
	}

})();
