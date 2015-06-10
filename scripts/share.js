function initInnerShare() {
  if (isTerminal) return

  var fullUrl = "http://www.bloomberg.com/graphics/2015-paul-ford-what-is-code/";

  var moduleByName = d3.nest()
    .key(function(d){ return d.name })
    .map(modules);

  function track(label) {
    if(typeof tracker == 'function') {
      tracker('share', label)
    }
  }

  var that = {

    assignButtons: function() {

      Array.prototype.forEach.call(document.querySelectorAll('.innershare .innertw'), function(el){
        el.addEventListener('click', that.postToTwitter)
      });


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
      var data = moduleByName[this.parentNode.parentNode.id][0];
      // var data = shareData();
      var tweetUrl = "https://twitter.com/share?url=" + encodeURIComponent(fullUrl+"#"+data.name) + "&text=" + encodeURIComponent(data.tweet);
      var opts = that.centerPopup(820, 440) + "scrollbars=1";
      track("Twitter");
      window.open(tweetUrl, 'twitter', opts);
    }
  };

  that.assignButtons()
}
