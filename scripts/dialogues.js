var botDialogues = {};

var myName = null,
    dogs;

var subDialogue = [
  { "emote": "love", "speak": "Subdialogue part 1..." },
  { "eval": "//Subdialogue part 2..." },
  { "speak": "Subdialogue part 3..." }
];

var dialoguePause = function() {
  var blurbs = ["OK...", "Go on...", "I'm with you...", "Uh huh...", "Yeah...", "Mm hmm...", "Right. Gotcha.", "Oh.", "Hangin’ in there...", "Fine...", "I'm lovin' it!", "Code is the best.", "Now it is totally obvious why every man woman and child on Earth should learn to code.", "I feel like Jesse Eisenberg!", "Ugh, eff this.", "But... why would you want this?", "Are you talking down to me?", "LOL.", "So.", "Great.", "Yes.", "Yup.", "Ayup.", "Okaaaay...", "Meh.", "Mmmm...", "Ehh...", "Ah, of course."];
  return {"prompts": [
    {"prompt": _.sample(blurbs)}
  ]};
}

var dialogueTest = function(test, error) {
  return {
    "test": function(item) {
      if(test.call(this,item)) {
        this.emote("wiggle");
        return true;
      } else {
        this.emote("notimpressed");
        this.speak(error);
        return false;
      }
    }
  }
}

var dialogueShow = {
  "mode": "on",
  "emote": "restface"
}

var randText = function() {
  return _.sample([
    "OK, bye.",
    "Cool, thanks.",
    "That's all? Fine.",
    "Oh.",
    "Yeah OK.",
    "Sure pal.",
    "Whatever you say, Paulbot.",
    "Uh huh.",
    "Well. Sure.",
    "Mmmm yeah, see ya!"
    ]);
};

var randDialogue = function() {
  var dialogue = [];
  dialogue.push({"emote": "wiggle", "speak": randText()});
  dialogue.push({"speak": randText()});
  dialogue.push({"speak": randText()});
  return dialogue;
}

botDialogues.exampleEventLogger = [
  {
    "mode": "on",
    "speak": "Interactions on a web page are driven by events. Events are 'fired', and code can 'listen' for when they happen, and act accordingly."
  },
  {
    "eval": 'logger();'
  },
  {
    "speak": "Move your mouse and hit keys and scroll and look at them all!",
    "prompts": [{"prompt": "OK."}]
  }
];

botDialogues.tutorialAdding = [
  {
    "mode": "on",
    "speak": "So obviously you know computers can do math:"
  },
  { "eval": "2+2" },
  { "speak": "Now you try."},
  {
    "test": function(item) {
      if(isNaN(item.result)) {
        this.speak("Sorry, that's not a number.");
      } else if(item.command.indexOf("+") === -1) {
        this.speak("Sorry, that's a number but there's no addition in there.");
      } else {
        return true;
      }
    }
  },
  { "speak": "Right, OK, easy enough. The weird thing is, in JavaScript, the symbol + means more than one thing: if you put it between strings, it 'concatenates' them, which just means it jams the letters together into one longer string:" },
  { "eval": '"mank" + "ind"'},
  { "speak": "Now you try."},
  {
    "test": function(item) {
      if(typeof item.result !== "string") {
        this.speak("Mmmm, doesn't look like you have a string there.")
        return false;
      } else if(item.command.indexOf("+") === -1) {
        this.speak("Doesn't look like you added anything there.")
        return false;
      } else {
        return true;
      }
    }
  },
{ "speak": "Great. Now, the REALLY weird thing is that these two uses of + can sometimes collide. First, easy math question: what's 4 + 20?"},
dialogueTest(function(item) { return item.result===24; }, "Nope. Simple question, just answer with a number: what's 4 + 20?"),
{ "speak": "Correct. But look at this:" },
{ "eval": '4+"20"'},
{ "speak": "WTF? Well, see the quotation marks around \"20\"? That means that it's being treated as a string here, which forces JavaScript to treat 4 as a string too and just jam 20 on the end. Try adding a string to a number:"},
dialogueTest(function(item) { return typeof item.result === "string" && item.command.indexOf("+") !== -1 }, "Nope. Just try something like: \"one\" + 1"),
{ "speak": "Weird, right? In fact, you can 'add' all sorts of different types of things together:" },
{ "eval": 'document+"one"+1+Array' },
{ "speak": "And this is why programmers are angry." }
]

botDialogues.exampleRoulette = [
{
  "mode": "on",
  "speak": "Web pages are made up of different HTML 'elements'. Many of them have some semantic meaning: paragraphs, headers, lists. Others are just arbitrary containers of stuff, like divs and spans. These elements are styled according to rules written in CSS. Here, let's randomize the CSS rules being applied to the HTML elements on this page.",
  "prompts": [{"prompt": "OK..."}]
},
{
  "eval": roulette+' roulette();'
},
{
  "speak": "Cool, right?",
  "prompts": [
    {"prompt": "OK. Neat.", "dialogue": [{"mode": "off"}]},
    {"prompt": "Again! Again!!", "dialogue": function() { return botDialogues.exampleRoulette.slice(1); }},
    {"prompt": "Back to normal, please...", "dialogue": [{"mode": "off", "eval": "resetArticle();"}]}
  ]
}
];

botDialogues.exampleDestroy = [
{
  "mode": "on",
  "speak": "OK cool well now we'll just delete random things on the page.",
},
{
  "eval": 'destroyPage();',
  "prompts": [{"prompt": "Hey where's everything going?"}]
},
{
  "speak": "You're on your own. It's too late now.",
  "emote": "ded"
}
];

botDialogues.tutorialArrays = [
{
  "mode": "on",
  "speak": "Hello! Many, many things in a computer are saved in a LIST form. Many of the tasks that a programmer does involve creating and modifying lists. Let’s create a list.",
},
{
  "speak": "THIS IS THE CODE TO MAKE A LIST OF DOGS.",
  "eval": "dogs = ['black lab', 'tabby', 'golden retriever', 'corgi', 'chihuahua'];",
  "emote": "love",
  "prompts": [{"prompt": "OK..."}]
},
{
  "speak": "First of all, one of these does not belong. So you should replace it with “boston terrier”.",
  "emote": "troll"
},
{
  "speak": "In Javascript arrays start at 0 (zero) which is weird and confusing but you need to work with it, that’s life. So starting at 0 what number is ‘tabby’? Type your answer below and hit enter:",
  "emote": "restface"
},
{
  "test": function(item) {
    if(item.result === 1) {
      return true;
    } else if((item.command+'').toLowerCase().trim() == "one") {
      this.speak("OK, true, but please just enter it in numerals, like 8 or 9 or 2345235.");
      return false;
    } else {
      this.speak("Nope. OK, starting at 0, so 'black lab' is 0, so 'tabby' is...");
      return false;
    }
  }
},
{ "speak": "Right! Here's how we could replace chihuahuas with a different dog:" },
{ "eval": "dogs[4] = 'pug';" },
{ "speak": "Now replace 'tabby' with 'boston terrier'." },
{
  "test": function(item) {
    if(dogs[1]+''.toLowerCase().trim() == 'boston terrier') {
      return true;
    } else {
      this.speak("Nope. The element that should be 'boston terrier' is instead '"+ dogs[1] +"'. Try again.");
      return false;
    }
  }
},
{ "speak": "Now you have done it. You have replaced the dogs." },
{ "speak": "Now get rid of chihuahuas. The way you do that is by calling the pop method: dogs.pop();", "emote": "restface" },
{
  "test": function(item) {
    if(dogs.length == 4 && item.result=="pug" && item.command.indexOf("pop") !== -1) {
      return true;
    } else {
      dogs = ["black lab","boston terrier","golden retriever","corgi","pug"];
      this.speak("Welp, something went wrong. I've reset the dogs array; try again. Just type and hit enter: dogs.pop();");
      return false;
    }
  }
},
{ "speak": "Great. Notice how the pop method returns the value of the item you popped off. You can check the current value of the array by just typing 'dogs' and hitting enter, like this:" },
{ "eval": "dogs" },
{ "speak": "Now add ‘mutt’ by PUSHING into the end of the array: dogs.push('mutt');" },
{
  "test": function(item) {
    if(dogs.indexOf("mutt") !== -1 && dogs instanceof Array) {
      return true;
    } else {
      dogs = ["black lab","boston terrier","golden retriever","corgi"];
      this.speak("Welp, something went wrong. I've reset the dogs array; try again. Just type and hit enter: dogs.push('mutt');");
      return false;
    }
  }
},
{ "speak": "Great! RECAP: You’ve learned how to make a list. You can learn a hell of a lot more elsewhere:",
  "prompts": [
    {"prompt": "Eloquent JavaScript, Chapter 4", "link": "http://eloquentjavascript.net/04_data.html"},
    {"prompt": "Or just Google it", "link": "https://www.google.com/#q=javascript%20array%20tutorial"}
  ]
}
];

botDialogues.tutorialDOM = [
dialogueShow,
{ "speak": "Hello! Did you know that the web pages you read are all OBJECTS that can be manipulated by code? IT IS TRUE BELIEVE IT WHY WOULD YOU DOUBT ME MY GOD I'M TRYING SO HARD. Anyway, this idea applies to every web page. They can all be manipulated. A web page is a weird data object and all the pieces can be manipulated. If you thought they were in any way like documents on paper you've been living a terrible lie." },
dialoguePause(),
{ "speak": "So an OBJECT of a given class has METHODS, and good for that object. First let's just take a look at the document object. Try:" },
{ "eval": "document" },
dialoguePause(),
{ "speak": "Right. That doesn't do much. It just returns the document object. Great, so what can we do with it? Tons of things. For example, we can look at all of the links in the document. Turns out this is very easy, you just say:" },
{ "eval": "document.links;" },
dialoguePause(),
{ "speak": "But what if we wanted all the paragraphs? Easy. Let's make all the paragraphs turn white with purple backgrounds. Let me speak moonspeak for a moment: We need to invoke one of the methods of the document class on our current document object. There's a class of things that we call \"web documents\" just like there's a class of animals we call \"dogs.\" When we work with web documents we like to do things to them and make them do things. So we bundle those up in methods and attributes. This is cool because everything kind of stays together and you can easily find out all the things you can DO with a document. Programmers spend a lot of time looking for the methods and attributes of their objects. Because this is about understanding what programmers do, I'm going to show you a list of every method and attribute on the document object. Here it goes. It's very long. But the thing is, if you're a web programmer, you basically need to read this list and understand what each of these things does. And this is life; this is the work:" },
{ "prompts": [
    { "prompt": "I want the list.",
      "dialogue": [
        {"emote": "troll", "speak": '"linkColor," "alinkColor," "fgColor," "bgColor," "compatMode," "all," "onautocompleteerror," "onautocomplete," "rootElement," "childElementCount," "lastElementChild," "firstElementChild," "children," "onwaiting," "onvolumechange," "ontoggle," "ontimeupdate," "onsuspend," "onsubmit," "onstalled," "onshow," "onselect," "onseeking," "onseeked," "onscroll," "onresize," "onreset," "onratechange," "onprogress," "onplaying," "onplay," "onpause," "onmousewheel," "onmouseup," "onmouseover," "onmouseout," "onmousemove," "onmouseleave," "onmouseenter," "onmousedown," "onloadstart," "onloadedmetadata," "onloadeddata," "onload," "onkeyup," "onkeypress," "onkeydown," "oninvalid," "oninput," "onfocus," "onerror," "onended," "onemptied," "ondurationchange," "ondrop," "ondragstart," "ondragover," "ondragleave," "ondragenter," "ondragend," "ondrag," "ondblclick," "oncuechange," "oncontextmenu," "onclose," "onclick," "onchange," "oncanplaythrough," "oncanplay," "oncancel," "onblur," "onabort," "onwebkitfullscreenerror," "onwebkitfullscreenchange," "webkitFullscreenElement," "webkitFullscreenEnabled," "webkitCurrentFullScreenElement," "webkitIsFullScreen," "fonts," "currentScript," "webkitHidden," "webkitVisibilityState," "hidden," "visibilityState," "onwheel," "onselectstart," "onselectionchange," "onsearch," "onreadystatechange," "onpointerlockerror," "onpointerlockchange," "onpaste," "oncut," "oncopy," "onbeforepaste," "onbeforecut," "onbeforecopy," "pointerLockElement," "activeElement," "selectedStylesheetSet," "preferredStylesheetSet," "characterSet," "readyState," "defaultCharset," "charset," "location," "lastModified," "anchors," "scripts," "forms," "links," "plugins," "embeds," "applets," "images," "head," "cookie," "URL," "domain," "referrer," "title," "designMode," "dir," "contentType," "styleSheets," "defaultView," "origin," "documentURI," "xmlStandalone," "xmlVersion," "xmlEncoding," "inputEncoding," "documentElement," "implementation," "doctype," "parentElement," "textContent," "localName," "namespaceURI," "nodeType," "nodeValue," "nodeName," "open," "close," "write," "writeln," "clear," "captureEvents," "releaseEvents," "body," "createDocumentFragment," "createTextNode," "createComment," "createCDATASection," "createProcessingInstruction," "createAttribute," "getElementsByTagName," "importNode," "createAttributeNS," "getElementsByTagNameNS," "getElementById," "adoptNode," "createEvent," "createRange," "createNodeIterator," "createTreeWalker," "getOverrideStyle," "execCommand," "queryCommandEnabled," "queryCommandIndeterm," "queryCommandState," "queryCommandSupported," "queryCommandValue," "getElementsByName," "elementFromPoint," "caretRangeFromPoint," "getSelection," "getCSSCanvasContext," "getElementsByClassName," "hasFocus," "exitPointerLock," "registerElement," "createElement," "createElementNS," "webkitCancelFullScreen," "webkitExitFullscreen," "querySelector," "querySelectorAll," "createExpression," "createNSResolver," "evaluate," "parentNode," "childNodes," "firstChild," "lastChild," "previousSibling," "nextSibling," "ownerDocument," "baseURI," "insertBefore," "replaceChild," "removeChild," "appendChild," "hasChildNodes," "cloneNode," "normalize," "isSameNode," "isEqualNode," "lookupPrefix," "isDefaultNamespace," "lookupNamespaceURI," "compareDocumentPosition," "contains," "ELEMENT_NODE," "ATTRIBUTE_NODE," "TEXT_NODE," "CDATA_SECTION_NODE," "ENTITY_REFERENCE_NODE," "ENTITY_NODE," "PROCESSING_INSTRUCTION_NODE," "COMMENT_NODE," "DOCUMENT_NODE," "DOCUMENT_TYPE_NODE," "DOCUMENT_FRAGMENT_NODE," "NOTATION_NODE," "DOCUMENT_POSITION_DISCONNECTED," "DOCUMENT_POSITION_PRECEDING," "DOCUMENT_POSITION_FOLLOWING," "DOCUMENT_POSITION_CONTAINS," "DOCUMENT_POSITION_CONTAINED_BY," "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC," "addEventListener," "removeEventListener," "dispatchEvent"'},
        {"speak": "Okay! Fun, right?"}
      ]},
    { "prompt": "Spare me.", "dialogue": [{"speak": "Suit yourself."}] }
  ]},
{ "speak": "Let's call a method that gets all the paragraphs out of the document.", "emote": "restface" },
{ "eval": "document.getElementsByTagName('p');" },
dialoguePause(),
{ "speak": "That returns a bunch of paragraphs — an array of them. Oh but wait, assign it to variable, that way we can work with it." },
{ "eval": "var paragraphs = document.getElementsByTagName('p');" },
dialoguePause(),
{ "speak": "Great! What we did was take the document, which is the whole page, and execute the method \"get elements by tag name\" with the argument 'p'. Tags are things in angle brackets, like <html> and <whatever>; in this case we're looking for all the <p> tags, for paragraphs. Paragraphs have been part of HTML since ye olden days." },
dialoguePause(),
{ "speak": "So how do we turn them all pink?" },
{ "speak": "Well, every array has a length." },
{ "eval": "paragraphs.length;" },
dialoguePause(),
{ "speak": "Now we know! So what we need to do is go paragraph by paragraph and make it pink. So we need a way to change colors. Get ONE paragraph and mess with it a little." },
{ "eval": "var firstPara = paragraphs[0];" },
dialoguePause(),
{ "speak": "That [0] means \"give me the first paragraph.\" Lists start at position zero. Good for lists. Now we are deep inside the document where civilians barely ever go. We're going to be modifying the style attributes of the element. Watch:" },
{ "eval": "firstPara.style.background;" },
{ "speak": function() { return "As you can see, it just returns '" + firstPara.style.background + "'." } },
dialoguePause(),
{ "speak": "Let's set it to red;" },
{ "eval": "firstPara.style.background = 'red';"},
dialoguePause(),
{ "speak": "And now to pink:" },
{ "eval": "firstPara.style.background = 'pink';" },
{ "speak": "Try a color:" },
dialogueTest(function(i) { return firstPara.style.background !== "rgb(255, 192, 203)"}, "Try again. Just type this — firstPara.style.background = 'pink'; — but replace 'pink' with a different color."),
{ "speak": "Great." },
dialoguePause(),
{ "speak": "But you could also do a shortcut. Do this:" },
{ "eval": "paragraphs[0].style.background = 'pink';" },
{ "speak": "See? You can directly address elements in an array and modify them without assigning them to variables first." },
dialoguePause(),
{ "speak": "Okay so now we need to apply that to all of the paragraphs. We do that with a \"for\"-loop." },
{ "eval": "for (var i=0;i<paragraphs.length;i++) {\n\tconsole.log(i);\n}" },
dialoguePause(),
{ "speak": "See how that counts off the paragraphs? Now we're ready to put it together and change the color for every one." },
{ "eval": "for (var i=0;i<paragraphs.length;i++) {\n\tparagraphs[i].style.background = 'pink';\n\tparagraphs[i].style.color = 'white';\n}" },
{ "speak": "Nice! Everything is pink." },
dialoguePause(),
{ "emote": "wink", "speak": "Let's proceed to the bonus round. Let's make everything pink and purple in turn. We can fall back on that artifact of second-grade division, the remainder. There's a special operator in many languages called the \"modulo\" operator which gives you JUST the remainder. It's super-useful to use for tasks like this. It's the percentage sign, which can look confusing, but, well, there you go. Try this:" },
{ "eval": "5%2" },
{ "eval": "6%2" },
{ "emote": "restface", "speak": "Now you try:" },
dialogueTest(function(i) { return i.command.indexOf("%") !== -1 && !isNaN(i.result) }, "Nope. Type a number, then %, then another number."),
{ "speak": "Hmm! So odd numbers return 1, and even return 0. We can use this! Every time we step through our loop, we can set the background to pink and the foreground to black. However, if our number can be divided by 2 with no remainder (i.e. if i % 2 is equal to zero), then change the color to purple and white." },
{ "eval": "for (var i=0;i<paragraphs.length;i++) {\n\tvar background = 'pink';\n\tvar foreground = 'black';\n\tif (i % 2===0) {\n\t\tbackground = 'purple';\n\t\tforeground = 'white';\n\t}\n\tparagraphs[i].style.background = background;\n\tparagraphs[i].style.color = foreground;\n}" },
dialoguePause(),
{ "speak": "Which works! Now let's wrap it in a function. See how \"p\" was a string? And the colors are strings? We can make a function that takes three different strings and use that to stripe ANY element, whether paragraphs, headlines, or lists." },
{ "eval": "function stripeify (el, darkColor, lightColor) {\n\tvar els = document.getElementsByTagName(el);\n\tfor (var i=0;i<els.length;i++) {\n\t\tvar background = lightColor;\n\t\tvar foreground = 'black';\n\t\tif (i % 2===0) {\n\t\t\tbackground = darkColor;\n\t\t\tforeground = 'white';\n\t\t}\n\t\tels[i].style.background = background;\n\t\tels[i].style.color = foreground;\n\t}\n}" },
dialoguePause(),
{ "speak": "And now you can run:" },
{ "eval": 'stripeify("p", "black", "aqua");' },
{ "speak": "Okay that looks kind of familiar. Try it with different colors." },
dialogueTest(function(i) { return paragraphs[0].style.background !== "black" && paragraphs[0].style.background !== "aqua"}, "Nope. Just type stripeify(\"p\", \"black\", \"aqua\") but with two colors other than black and aqua."),
{ "speak": "Great. But what if we do the same to our headlines?" },
{ "eval": 'stripeify("h2", "orange", "lightgreen");' },
{ "speak": "Nice work.", "emote": "love" }
]

botDialogues.CLOSE = [
{"mode": "off"}
]
