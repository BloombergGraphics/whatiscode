!(function(){

  var module = {
		sel: d3.select('[data-module="livehtml"]')
	}
  addModule(module)

  var src = module.sel.select("code");
  var iframe = module.sel.select("iframe");

  renderLiveHTML();
  src.on("keyup", renderLiveHTML);
  src.on("blur", function() {
    d3.select(this).text(d3.select(this).text());
    hljs.highlightBlock(this);
  });

  function renderLiveHTML() {
    // update iframe
    iframe.node().contentWindow.document.open();
    iframe.node().contentWindow.document.write(src.text());
    iframe.node().contentWindow.document.close();
  }

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "Go ahead and make changes to the HTML to see what happens—or doesn’t happen. You can’t break anything. Haha, actually, you can break everything. But you can’t hurt anything."
    },
    {
      "emote": "chill"
    }
  ];

  // announce itself
  module.bot = bot();
  module.sel.insert("div.bot", ".side-by-side").call(module.bot);
  module.oninit = function() {
    module.bot.dialogue(dialogue);
  }

})();
