!(function(){

  var module = {sel: d3.select('[data-module="learninal"]')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var dialogue = [
    {
      ""
    }
  ]

})();
