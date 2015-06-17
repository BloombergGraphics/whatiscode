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

    postToTwitter: function(event) {
      event.preventDefault()
      var data = moduleByName[d3.select(this).attr('data-mname')][0];
      // var data = shareData();
      var tweetUrl = "https://twitter.com/share?url=" + encodeURIComponent(fullUrl+"#"+data.name) + "&text=" + encodeURIComponent(data.tweet);
      var opts = that.centerPopup(820, 440) + "scrollbars=1";
      track("Twitter");
      window.open(tweetUrl, 'twitter', opts);
    }
  };

  that.assignButtons()
}

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
