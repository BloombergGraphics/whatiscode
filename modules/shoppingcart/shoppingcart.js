!(function(){

  var module = {sel: d3.select('[data-module="shoppingcart"]')}
  addModule(module)

  var dialogue = [
    {
      "speak": "Drag the slider, move the cart. Easy.",
      "slider": {
        "onbrush": function(value) {
          document.getElementById('cart').style.left = value.toFixed() + "%";
          return "document.getElementById('cart').style.left = '" + value.toFixed() + "%';";
        },
        "onscroll": true,
        "domain": [-20,120]
      }
    }
  ]

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  module.oninit = function() {
    module.bot.mode("on").dialogue(dialogue);
  }

  module.onunload = function() {
    document.getElementById('cart').style.left = "120%";
  }

})();
