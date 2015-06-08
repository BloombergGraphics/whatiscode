!(function(){

  var module = {sel: d3.select('[data-module="paperclip"]')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "Basing your interface on an animating talking character is a time-honored tradition that has definitely never ever gone wrong or distracted or infantilized the beloved user!"
    },
    { "emote": "chill" }
  ];

  module.oninit = function() { module.bot.dialogue(dialogue); }

})();
