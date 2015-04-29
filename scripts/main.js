var setupSteps = [
  "$('article').append('<h1>The Code Issue</h2>')",
  "$('article').append('<h2>by Paul Ford</h2>')",
  "$('article').append('<p>In communications and information processing, code is system of rules to convert information—such as a letter, word, sound, image, or gesture—into another, sometimes shortened or secret, form or representation for communication through a channel or storage in a medium. An early example is the invention of language, which enabled a person, through speech, to communicate what he or she saw, heard, felt, or thought to others. But speech limits the range of communication to the distance a voice can carry, and limits the audience to those present when the speech is uttered. The invention of writing, which converted spoken language into visual symbols, extended the range of communication across space and time.</p>')",
  "$('article').append('<p>The process of encoding converts information from a source into symbols for communication or storage. Decoding is the reverse process, converting code symbols back into a form that the recipient understands.</p>')",
  "$('article').append('<div id=" + '"chart"' + "></div>')",
  "var bars = d3.select('#chart').selectAll('.bar').data(data).enter().append('div').classed('bar', true).transition().style('width', function(d) { return scale(d.frequency)+'%'; })",
  "$('article').append('<p>One reason for coding is to enable communication in places where ordinary plain language, spoken or written, is difficult or impossible. For example, semaphore, where the configuration of flags held by a signaller or the arms of a semaphore tower encodes parts of the message, typically individual letters and numbers. Another person standing a great distance away can interpret the flags and reproduce the words sent.</p>')",
  "$('article').append('<p></p>')",
  "$('article').css('font-family','Helvetica')",
  "$('h1,h2').css('text-align', 'center')",
  "$('h1,h2').css('margin', '10px')",
  "$('h1,h2').css('padding', '10px')",
  "$('h1,h2').css('background', '#000')",
  "$('h1,h2').css('color', '#0f0')",
  "$('h1,h2').css('font-family', 'courier')",
  "$('h1,h2').css('border-radius', '10px')",
  "$('article p').css('max-width', '50em')",
  "$('article p').css('margin', '1em auto')",
];

var data = [
  {"letter":"A","frequency":.08167},
  {"letter":"B","frequency":.01492},
  {"letter":"C","frequency":.02782},
  {"letter":"D","frequency":.04253},
  {"letter":"E","frequency":.12702},
  {"letter":"F","frequency":.02288},
  {"letter":"G","frequency":.02015},
  {"letter":"H","frequency":.06094},
  {"letter":"I","frequency":.06966},
  {"letter":"J","frequency":.00153},
  {"letter":"K","frequency":.00772},
  {"letter":"L","frequency":.04025},
  {"letter":"M","frequency":.02406},
  {"letter":"N","frequency":.06749},
  {"letter":"O","frequency":.07507},
  {"letter":"P","frequency":.01929},
  {"letter":"Q","frequency":.00095},
  {"letter":"R","frequency":.05987},
  {"letter":"S","frequency":.06327},
  {"letter":"T","frequency":.09056},
  {"letter":"U","frequency":.02758},
  {"letter":"V","frequency":.00978},
  {"letter":"W","frequency":.02360},
  {"letter":"X","frequency":.00150},
  {"letter":"Y","frequency":.01974},
  {"letter":"Z","frequency":.00074}
];

var scale = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.frequency; })]).range([0,100]);

function setup() {
  var setupInterval = setInterval(function() {
    if(!setupSteps.length) clearInterval(setupInterval);
    var command = setupSteps.shift();
    sandbox.currentHistory = command;
    sandbox.update();
    sandbox.model.evaluate(command);
    // eval(command);
  },100)
}

function destroyPage() {
  setInterval(function() {
    var $el = $('body');
    while($el.children().length > 0) {
      $el = $el.children().eq(0);
    }
    $el.remove();
  },100);
}

var traverseFun = function(node) {
    console.log(node);
}




function randomize() {
  var selectors = ["h1", "h2", "p"];
  var properties = [
    {
      "name": "background",
      "values": ["none", "#d5cdfb", "#fdc8d8", "#fae665", "#fbba7d", "#94e1bb"]
    },
    // {
    //   "name": "color",
    //   "values": ["#d5cdfb", "#fdc8d8", "#fae665", "#fbba7d", "#94e1bb"]
    // },
    {
      "name": "font-family",
      "values": ["helvetica", "garamond", "times new roman", "comic sans", "verdana", "georgia", "palatino", "courier"]
    },
    {
      "name": "font-size",
      "values": ["1em", ".7em", "1.3em", "2em"]
    },
    {
      "name": "padding",
      "values": ["0","5px","10px","15px"]
    },
    {
      "name": "margin",
      "values": ["0","5px","10px","15px"]
    },
    {
      "name": "border-radius",
      "values": ["0", "2px", "3px", "4px", "5px"]
    },
    {
      "name": "text-align",
      "values": ["left", "center", "right"]
    },
    {
      "name": "transform",
      "values": ["rotate(0deg)","rotate(0deg)","rotate(0deg)","rotate(5deg)","rotate(-5deg)","rotate(-10deg)","rotate(10deg)","rotate(15deg)"]
    }
  ];

  $els = $("article").find(_.sample(selectors));
  var prop = _.sample(properties);
  $els.css(prop.name, _.sample(prop.values));
}

function roulette(time) {
  if (!time) time = 1;
  console.log(time);
  if (time>500) return;
  randomize();
  setTimeout(function() {roulette(time*1.1)}, time);
}

$('#preroll').click(function() {
  $('#preroll').hide();
});

$(".progress-meter").click(function() {
  $('#postlude').addClass('visible');
  $('#postlude video')[0].play();
})
