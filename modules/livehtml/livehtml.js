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

})();
