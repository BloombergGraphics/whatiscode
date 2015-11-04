!(function(){

  var module = {sel: d3.select('[data-module="learninal"]')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var tutorialArrays, tutorialDOM;
  module.oninit = function() {
    module.bot.dialogue(tutorialArrays)
  }

  // Dialogue components

  var dialoguePause = function() {
    var blurbs = ["OK...", "Go on...", "I'm with you...", "Uh huh...", "Yeah...", "Mm hmm...", "Right. Gotcha.", "Oh.", "Hangin’ in there...", "Fine...", "I'm lovin' it!", "Code is the best.", "Now it is totally obvious why every man woman and child on Earth should learn to code.", "I feel like Jesse Eisenberg!", "Ugh, eff this.", "But... why would you want this?", "Are you talking down to me?", "LOL.", "So.", "Great.", "Yes.", "Yup.", "Ayup.", "Okaaaay...", "Meh.", "Mmmm...", "Ehh...", "Ah, of course."];
    return {"prompts": [
      {"prompt": _.sample(blurbs)}
    ]};
  }

  var badFaces = ["angry","angry2","angry3","angry4","no","no_2"];

  var dialogueTest = function(test, error) {
    return {
      "test": function(item) {
        if(test.call(this,item)) {
          this.emote("love");
          return true;
        } else {
          this.emote(_.sample(badFaces));
          this.speak(error);
          return false;
        }
      }
    }
  }

  tutorialArrays = [
  {
    "emote": "explaining",
    "speak": "We can’t teach you to code, but we can hold your hand through a live-fire exercise. It will be dry, because code is dry until it “clicks,” and often even then. Want to give it a shot?"
  },
  {
    "prompts": [{"prompt": "Yes, I want to see and write real live code."}]
  },
  {
    "emote": "keyboardmash_rest", "speak": "Excellent! We’ll start with lists. Many, many things in a computer are saved in a LIST form. Many of the tasks that a programmer does involve creating and modifying lists. Let’s create a list of dogs.",
  },
  {
    "emote": "keyboardmash", 
    "eval": "dogs = ['black lab', 'tabby', 'golden retriever', 'corgi', 'chihuahua'];",
    "prompts": [{"prompt": "OK..."}]
  },
  {
    "emote": "keyboardmash_rest", 
    "speak": "One of those doesn’t belong. In JavaScript arrays start at 0 (zero), which is weird and confusing, but you need to work with it. That’s life. So starting at 0, what number is ‘tabby’? Type your answer below and hit Enter:",
  },
  {
    "test": function(item) {
      if(item.result === 1) {
        this.emote("love");
        return true;
      } else if((item.command+'').toLowerCase().trim() == "one") {
        this.speak("OK, true, but please just enter it in numerals, like 8 or 9 or 2345235.");
        this.emote(_.sample(badFaces));
        return false;
      } else {
        this.speak("Nope. OK, starting at 0, so 'black lab' is 0, so 'tabby' is...");
        this.emote(_.sample(badFaces));
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
        this.emote("love");
        return true;
      } else {
        this.speak("Nope. The element that should be 'boston terrier' is instead '"+ dogs[1] +"'. Try again.");
        this.emote(_.sample(badFaces));
        return false;
      }
    }
  },
  { "speak": "Now get rid of pugs. The way you do that is by calling the pop method, which removes and returns the last element of an array: dogs.pop();" },
  {
    "test": function(item) {
      if(dogs.length == 4 && item.result=="pug") {
        this.emote("love");
        return true;
      } else {
        dogs = ["black lab","boston terrier","golden retriever","corgi","pug"];
        this.emote(_.sample(badFaces));
        this.speak("Welp, something went wrong. I've reset the dogs array; try again. Just type and hit enter: dogs.pop();");
        return false;
      }
    }
  },
  { "speak": "Great. Notice how the pop method returns the value of the item you popped off. You can check the current value of the array by just typing 'dogs' and hitting enter. Try:" },
  dialogueTest(function(i) { return i.command === "dogs" || i.command === "dogs;" }, "Nope. Just type 'dogs', without the quotes, and hit enter."),
  { "speak": "Now add ‘mutt’ by PUSHING into the end of the array: dogs.push('mutt');" },
  {
    "test": function(item) {
      if(dogs.indexOf("mutt") !== -1 && dogs instanceof Array) {
        this.emote("love");
        return true;
      } else {
        dogs = ["black lab","boston terrier","golden retriever","corgi"];
        this.emote(_.sample(badFaces));
        this.speak("Welp, something went wrong. I've reset the dogs array; try again. Just type and hit enter: dogs.push('mutt');");
        return false;
      }
    }
  },
  { "speak": "Great! RECAP: You’ve learned how to make and manipulate a list. You can learn a hell of a lot more elsewhere:",
    "prompts": [
      {"prompt": "Eloquent JavaScript, Chapter 4", "link": "http://eloquentjavascript.net/04_data.html"},
      {"prompt": "Or just Google it", "link": "https://www.google.com/#q=javascript%20array%20tutorial"},
      // {"prompt": "I am a masochist and want to do more of this", "dialogue": function() {return tutorialDOM;}}
    ]
  }
  ];

  tutorialDOM = [
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
          {"speak": '"linkColor," "alinkColor," "fgColor," "bgColor," "compatMode," "all," "onautocompleteerror," "onautocomplete," "rootElement," "childElementCount," "lastElementChild," "firstElementChild," "children," "onwaiting," "onvolumechange," "ontoggle," "ontimeupdate," "onsuspend," "onsubmit," "onstalled," "onshow," "onselect," "onseeking," "onseeked," "onscroll," "onresize," "onreset," "onratechange," "onprogress," "onplaying," "onplay," "onpause," "onmousewheel," "onmouseup," "onmouseover," "onmouseout," "onmousemove," "onmouseleave," "onmouseenter," "onmousedown," "onloadstart," "onloadedmetadata," "onloadeddata," "onload," "onkeyup," "onkeypress," "onkeydown," "oninvalid," "oninput," "onfocus," "onerror," "onended," "onemptied," "ondurationchange," "ondrop," "ondragstart," "ondragover," "ondragleave," "ondragenter," "ondragend," "ondrag," "ondblclick," "oncuechange," "oncontextmenu," "onclose," "onclick," "onchange," "oncanplaythrough," "oncanplay," "oncancel," "onblur," "onabort," "onwebkitfullscreenerror," "onwebkitfullscreenchange," "webkitFullscreenElement," "webkitFullscreenEnabled," "webkitCurrentFullScreenElement," "webkitIsFullScreen," "fonts," "currentScript," "webkitHidden," "webkitVisibilityState," "hidden," "visibilityState," "onwheel," "onselectstart," "onselectionchange," "onsearch," "onreadystatechange," "onpointerlockerror," "onpointerlockchange," "onpaste," "oncut," "oncopy," "onbeforepaste," "onbeforecut," "onbeforecopy," "pointerLockElement," "activeElement," "selectedStylesheetSet," "preferredStylesheetSet," "characterSet," "readyState," "defaultCharset," "charset," "location," "lastModified," "anchors," "scripts," "forms," "links," "plugins," "embeds," "applets," "images," "head," "cookie," "URL," "domain," "referrer," "title," "designMode," "dir," "contentType," "styleSheets," "defaultView," "origin," "documentURI," "xmlStandalone," "xmlVersion," "xmlEncoding," "inputEncoding," "documentElement," "implementation," "doctype," "parentElement," "textContent," "localName," "namespaceURI," "nodeType," "nodeValue," "nodeName," "open," "close," "write," "writeln," "clear," "captureEvents," "releaseEvents," "body," "createDocumentFragment," "createTextNode," "createComment," "createCDATASection," "createProcessingInstruction," "createAttribute," "getElementsByTagName," "importNode," "createAttributeNS," "getElementsByTagNameNS," "getElementById," "adoptNode," "createEvent," "createRange," "createNodeIterator," "createTreeWalker," "getOverrideStyle," "execCommand," "queryCommandEnabled," "queryCommandIndeterm," "queryCommandState," "queryCommandSupported," "queryCommandValue," "getElementsByName," "elementFromPoint," "caretRangeFromPoint," "getSelection," "getCSSCanvasContext," "getElementsByClassName," "hasFocus," "exitPointerLock," "registerElement," "createElement," "createElementNS," "webkitCancelFullScreen," "webkitExitFullscreen," "querySelector," "querySelectorAll," "createExpression," "createNSResolver," "evaluate," "parentNode," "childNodes," "firstChild," "lastChild," "previousSibling," "nextSibling," "ownerDocument," "baseURI," "insertBefore," "replaceChild," "removeChild," "appendChild," "hasChildNodes," "cloneNode," "normalize," "isSameNode," "isEqualNode," "lookupPrefix," "isDefaultNamespace," "lookupNamespaceURI," "compareDocumentPosition," "contains," "ELEMENT_NODE," "ATTRIBUTE_NODE," "TEXT_NODE," "CDATA_SECTION_NODE," "ENTITY_REFERENCE_NODE," "ENTITY_NODE," "PROCESSING_INSTRUCTION_NODE," "COMMENT_NODE," "DOCUMENT_NODE," "DOCUMENT_TYPE_NODE," "DOCUMENT_FRAGMENT_NODE," "NOTATION_NODE," "DOCUMENT_POSITION_DISCONNECTED," "DOCUMENT_POSITION_PRECEDING," "DOCUMENT_POSITION_FOLLOWING," "DOCUMENT_POSITION_CONTAINS," "DOCUMENT_POSITION_CONTAINED_BY," "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC," "addEventListener," "removeEventListener," "dispatchEvent"'},
          {"speak": "Okay! Fun, right?"}
        ]},
      { "prompt": "Spare me.", "dialogue": [{"speak": "Suit yourself."}] }
    ]},
  { "speak": "Let's call a method that gets all the paragraphs out of the document." },
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
  { "speak": "Let's proceed to the bonus round. Let's make everything pink and purple in turn. We can fall back on that artifact of second-grade division, the remainder. There's a special operator in many languages called the \"modulo\" operator which gives you JUST the remainder. It's super-useful to use for tasks like this. It's the percentage sign, which can look confusing, but, well, there you go. Try this:" },
  { "eval": "5%2" },
  { "eval": "6%2" },
  { "speak": "Now you try:" },
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
  ];

})();
