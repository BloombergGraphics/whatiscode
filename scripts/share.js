function initInnerShare() {
  if (isTerminal) return

  var fbInitialized = false;

  var moduleid = "";
  var codeurl = "";
  var codetext = "";

  modules.forEach(function(module) {
  });

  var moduleByName = d3.nest()
    .key(function(d){ return d.name })
    .map(modules);

  function shareData() {
    var metaTags=document.getElementsByTagName("meta");
    var data = {
      title:"",
      longTitle:"",
      url:"",
      image:"",
      description:""
    };
    for (var i = 0; i < metaTags.length; i++) {
      var property = metaTags[i].getAttribute("property");
      switch (property) {
        case "og:title":
          data.title = metaTags[i].getAttribute("content"); break;
        case "og:longTitle":
          data.longTitle = metaTags[i].getAttribute("content"); break;
        case "og:url":
          data.url = metaTags[i].getAttribute("content"); break;
        case "og:image":
          data.image = metaTags[i].getAttribute("content"); break;
        case "og:description":
          data.description = metaTags[i].getAttribute("content"); break;
        default:
          break;
      }
    }
    return data;
  }

  function track(label) {
    if(typeof tracker == 'function') {
      tracker('share', label)
    }
  }

  var that = {

    assignButtons: function() {
      Array.prototype.forEach.call(document.querySelectorAll('.innershare.link.facebook'), function(el){
        el.addEventListener('click', that.postToFacebook)
      });

      Array.prototype.forEach.call(document.querySelectorAll('.innershare.link.twitter'), function(el){
        el.addEventListener('click', that.postToTwitter)
      });

      Array.prototype.forEach.call(document.querySelectorAll('.social-share__more'), function(el){
        el.parentNode.removeChild(el)
      });

    },

    initFacebook: function() {
      var channelUrl = 'http://www.bloomberg.com/channel.html';
      if (window.oldIE) {
        channelUrl = '';
      }
      FB.init({appId: '208624989171045', status: true, cookie: true, channelUrl: channelUrl, xfbml: true});
      fbInitialized = true;
    },

    postToFacebook: function() {
      event.preventDefault()

      // var data = shareData();
      var link = (typeof purl=="string")? encodeURIComponent(purl) : encodeURIComponent(data.url);
      var width  = 570,
          height = 620,
          left   = (window.innerWidth  - width)  / 2,
          top    = (window.innerHeight - height) / 2,
          url    = "http://www.facebook.com/sharer/sharer.php?u=" + link,

          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;

      window.open(url, 'facebook', opts);
    },

    centerPopup: function(width, height) {
      var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
      var wTop = window.screenTop ? window.screenTop : window.screenY;
      var left = wLeft + (window.innerWidth / 2) - (width / 2);
      var top = wTop + (window.innerHeight / 2) - (height / 2);
      return 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
    },

    postToTwitter: function() {
      event.preventDefault()

      // var data = shareData();
      var tweetUrl = "https://twitter.com/share?url=" + encodeURIComponent(data.url) + "&text=" + encodeURIComponent(data.longTitle);
      var opts = that.centerPopup(820, 440) + "scrollbars=1";
      track("Twitter");
      window.open(tweetUrl, 'twitter', opts);
    },

    emailLink: function() {
      var data = shareData();
      var mailto = "mailto:?subject=" + encodeURIComponent(data.longTitle) + "&body=" + encodeURIComponent(data.description + "\n\n" + window.location.href);
      track('Email');
      window.location.href = mailto;
    },

    postToGooglePlus: function() {
      var url = encodeURIComponent(window.location.href);
      var gPlusUrl ="https://plus.google.com/share?url={" + url + "}";
      track('Google');
      var opts = that.centerPopup(800, 480) + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes';
      window.open(gPlusUrl, '', opts);
    },

    postToLinkedIn: function() {
      // This doesn't work when served up with a port
      var data = shareData();
      var url = encodeURIComponent(window.location.href);
      var linkedInUrl ="http://www.linkedin.com/shareArticle?mini=true&url=" + url
        + "&title=" + encodeURIComponent(data.longTitle) + "&summary=" + encodeURIComponent(data.description);
      track('LinkedIn');
      var opts = that.centerPopup(880, 460) + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes';
      window.open(linkedInUrl, '', opts);
    }
  };

  that.assignButtons()
}
