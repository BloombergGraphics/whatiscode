//fix for legacy config
if (~window.location.href.indexOf('bloomberg.com/graphics/') && config.bb_brand == 'bpol'){
  config.bb_brand = 'bbiz'
}


//fall back to default ad_code if none is specified  
config.ad_code = config.ad_code || '/5262/business/news/graphics'
//check for test-env query parm; switch ad_code if present
if (~location.search.indexOf('ad-test-environment=')){
  config.ad_code = config.ad_code.replace('/business/', '/testbusiness/')
}


var DocCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
};

var Comscore = function(config) {
  var docCookies = DocCookies;
  var comscore_account = '3005059';
  var escape_str = window.encodeURIComponent !== undefined ? window.encodeURIComponent : window.escape;
  var unescape_str = window.decodeURIComponent !== undefined ? window.decodeURIComponent : window.unescape;
  var uid_cookie_name = 'bdfpc';
  var cookie_domain = 'Bloomberg.com';
  var internal_link_key = 'comScore';
  var ns_site = 'bloomberg';

  var pageTrackingVars = {
    bb_author: 'Bloomberg Visual Data',
    bb_attributor: 'visdata',
    bb_c_type: 'dataviz',
  };

  function comScore(t) {
    var b = 'comScore', o = document, f = o.location, a = '', g = 2048, s, k, p, h, r = 'characterSet', n = 'defaultCharset', m = (window.encodeURIComponent !== undefined ? window.encodeURIComponent : window.escape);
    if (o.cookie.indexOf(b + '=') !== -1) {
      p = o.cookie.split(';');
      for (h = 0, f = p.length; h < f; h++) {
        var q = p[h].indexOf(b + '=');
        if (q !== -1) {
          a = '&' + window.unescape(p[h].substring(q + b.length + 1));
        }
      }
    }
    t = t + '&ns__t=' + (new Date().getTime());
    t = t + '&ns_c=' + (o[r] || (o[n] || '')) + '&c8=' + m(o.title) + a + '&c7=' + m(f && f.href ? f.href : o.URL) + '&c9=' + m(o.referrer);
    if (t.length > g && t.indexOf('&') > 0) {
      s = t.substr(0, g - 8).lastIndexOf('&');
      t = (t.substring(0, s) + '&ns_cut=' + m(t.substring(s + 1))).substr(0, g);
    }
    if (o.images) {
      k = new Image();
      if (window.ns_p === undefined) {
        ns_p = k;
      }
      k.src = t;
    } else {
      o.write(['<', 'p', '><', 'img src="', t, '" height="1" width="1" alt="*"', '><', '/p', '>'].join(''));
    }
  }

  //Legacy Haha's
  function get_var_val(var_name) {
    return eval('(typeof(' + var_name + ")!=='undefined') ? " + var_name + " : ''");
  }

  function param_2_tracking_url(params) {

    var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var default_params = {
      "bb_category": 'Bloomberg Graphic',
      "bb_section": 'insights',
      "bb_attributor": 'visdata',
      "bb_cg_2": 'Graphics',
      "bb_c_type": 'story-dataviz',
      'bb_screensize': screen.width+"x"+screen.height,
      'bb_viewport': x+"x"+y,
      'bb_focus': docCookies.getItem("bb_focus"),
      'bb_userid': docCookies.getItem(uid_cookie_name),
      'bb_krux_userid': docCookies.getItem("bb_krux_userid"),
      'bb_regid': unescape_str(docCookies.getItem('breg')).split(':')[0], //prop32
      'bb_pub_d': config.pubDate,
      'bb_groupId': config.groupId, //prop6
    };

    _.extend(default_params, config);
    _.extend(default_params, params);
    var param_url = '';
    var p;
    for (p in default_params) {
      if (default_params.hasOwnProperty(p)) {
        param_url += '&' + escape_str(p) + '=' + escape_str(default_params[p]);
      }
    }

    var ret_url = 'http' + (document.location.href.charAt(4) === 's' ? 's://sb' : '://b') + '.scorecardresearch.com/p?c1=2&c2=' + comscore_account;
    ret_url += param_url;
    return ret_url;
  }

  function generate_update_bdfpc() {
    var cookie_domain = 'Bloomberg.com';
    var val = docCookies.getItem(uid_cookie_name);
    if (typeof(val) === 'undefined') {
      val = '001.' + String('0000000000' + Math.floor(Math.random() * 10000000000)).slice(-10) + '.' + Math.floor((new Date()).getTime() / 1000);
    }
    // set/refresh cookie value/expiry
    var yearFromNow = new Date();
    yearFromNow.setYear(yearFromNow.getFullYear() + 1);
    docCookies.setItem(uid_cookie_name, val, yearFromNow, '/', cookie_domain);

  }

  function escape_tracking_value(str) {
    return str ? escape_str(str.trim().replace('=', '').replace('&', '')) : '';
  }

  function clearTrackCookie() {
    docCookies.removeItem(internal_link_key, '/', cookie_domain);
  }

  var that = {

    track: function(params) {
      comScore(param_2_tracking_url(params));
      clearTrackCookie();
    },

    trackPageview: function(url) {
      // where do we get to include the URL?
      that.track(pageTrackingVars);
    },

    hiddenEventTrack: function(text, action, label) {
      // comScore hidden events for on page event tracking
      clearTrackCookie();

      var url = param_2_tracking_url(pageTrackingVars) + '&ns_type=hidden&link_area=' + escape_tracking_value(action) + '&bb_linkname=' + escape_tracking_value(text) + '&link_position=' + escape_tracking_value(label);
      comScore(url);
    },

    internalLinkTrack: function(text, link_pos, link_type) {
      var val = 'bb_linkname=' + escape_tracking_value(text) + '&bb_linkpos=' + escape_tracking_value(link_pos) + '&bb_linktype=' + escape_tracking_value(link_type);
      docCookies.setItem(internal_link_key, val, null, '/', cookie_domain);
    }

  };

  generate_update_bdfpc();
  return that;
};

var _gaq = _gaq || [];
//load 3rd party tracking
!function(){
  /** CONFIGURATION START **/
  _sf_async_config.uid = 15087;
  _sf_async_config.useCanonical = true;
  _sf_async_config.sections = config.bb_cg_2;
  _sf_async_config.authors = config.bb_cg_2;
  /** CONFIGURATION END **/


  if (isTerminal) return

  var ga_account = window.location.pathname.split('/')[1]=='politics' ? 'UA-11413116-58' : 'UA-11413116-1'
  _gaq.push(['_setAccount', ga_account]);
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

  window._sf_endpt=(new Date()).getTime();
  var e = document.createElement('script');
  e.setAttribute('language', 'javascript');
  e.setAttribute('type', 'text/javascript');
  e.setAttribute('src', '//static.chartbeat.com/js/chartbeat.js');
  document.body.appendChild(e);

  var f = document.createElement('script');
  f.setAttribute('language', 'javascript');
  f.setAttribute('type', 'text/javascript');
  f.setAttribute('src', '//connect.facebook.net/en_US/all.js');
  document.body.appendChild(f);

  var PARSELY = {
      autotrack: false
  };

  var d = document.createElement("div")
  var pr = document.getElementsByTagName('body')[0].appendChild(d)
  pr.setAttribute("id", "parsely-root")
  pr.setAttribute("style", "display:none;")

  var d = document.createElement("div")
  var pc = pr.appendChild(d)
  pc.setAttribute("id", "parsely-cfg")
  pc.setAttribute("data-parsely-site", "bloomberg.com")

  ;(function(s, p, d) {
    if (isTerminal) return
    var h=d.location.protocol, i=p+"-"+s,
        e=d.getElementById(i), r=d.getElementById(p+"-root"),
        u=h==="https:"?"d1z2jf7jlzjs58.cloudfront.net"
        :"static."+p+".com";
    if (e) return;
    e = d.createElement(s); e.id = i; e.async = true;
    e.src = h+"//"+u+"/p.js"; r.appendChild(e);
  })("script", "parsely", document);

  // parsely meta tags
  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-section")
  mn.setAttribute("content", 'Graphics')

  var c = document.head.querySelector('meta[name="keywords"]').getAttribute('content')
  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-tags")
  mn.setAttribute("content", c)

  var c = document.head.querySelector('meta[property="og:image"]').getAttribute('content')
  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-image-url")
  mn.setAttribute("content", c)

  var c = document.head.querySelector('meta[property="og:url"]').getAttribute('content')
  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-link")
  mn.setAttribute("content", c)

  var c = document.head.querySelector('meta[property="og:title"]').getAttribute('content')
  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-title")
  mn.setAttribute("content", c)

  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-pub-date")
  mn.setAttribute("content", config.bb_pub_d)

  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-author")
  mn.setAttribute("content", config.bb_author)

  var d = document.createElement("div")
  var mn = document.head.appendChild(d)
  mn.setAttribute("name", "parsely-post-id")
  mn.setAttribute("content", config.bb_slug)

}()


//Tracker factory
var Tracker = function(config, pageViewActions, refeshAdsFun) {
  'use strict';

  var comscore;

  if (typeof (Comscore) === 'undefined' || isTerminal){
    comscore = {hiddenEventTrack: function(){ console.log('Comscore Blocked'); },
                trackPageview: function(){ console.log('Comscore Blocked'); }}
  } else{
    comscore = Comscore(config);
  }

  pageViewActions = pageViewActions ? pageViewActions : ['load', 'section'];
  refeshAdsFun = refeshAdsFun ? refeshAdsFun : function(){};

  function tEvent(action, label, value) {
    var gaEvent = ['_trackEvent', config.category, action, label, isNaN(value) ? 0 : value];
    //first three args have to be strings
    gaEvent = gaEvent.map(function(d, i){ return i < 3 ? d + '' : d; });

    _gaq.push(gaEvent);

    if (_.contains(pageViewActions, action)) {
      tPageview();
    } else {
      comscore.hiddenEventTrack(config.category, action, label);
    }
  }

  function tPageview() {
    var trackAs = window.location.hash;

    // JB refresh ads after 1000ms to allow animations to complete smoothly
    setTimeout(refeshAdsFun, 1000);

    _gaq.push(['_trackPageview', trackAs]);
    comscore.trackPageview(trackAs);
  }

  return tEvent;
};


//load ad into sticky iframe
// (function() {
//   if (isTerminal || window.innerWidth < 1060) return
//   var slug = config.bb_slug;

//   var ads = document.getElementsByClassName('bannerad');
//   if(ads.length<1) return;

//   var new_leader = '<iframe width="728" height="90" id="lb_ad_frame" style="visibility:hidden;"' +
//       'onload="this.style.visibility=' + "'visible'" +
//       '" class="ad_frame" scrolling="no" frameborder="no" src="' +
//       'http://www.bloomberg.com/graphics/assets/ad.html?url=/' + config.bb_slug + 
//       "&size=728x90|1x1&iu="+config.ad_code+"&correlator=" +
//       (config.correlator || new String(Math.random()).substring(2,11));

//   for (var i=0; i< ads.length; i++){
//       ads[i].style.display = "block";
//       var randValue = new String(Math.random()).substring(2,11);
//       var n = i + 1;
//       ads[i].innerHTML = new_leader + '&position=leaderboard' + n + '&ord=' + randValue + '"></iframe>';
//   }


//   //only add scrolling refesh adds 
//   if (!config.num_ad_scroll_refesh || config.num_ad_scroll_refesh < 2) return 
  
//   //wait for content to load before adjusting window height
//   window.setTimeout(function(){
//     //current segment of the page; between 0 and config.num_ad_scroll_refesh - 1
//     var curI = 0

//     //cache page and window sizes to avoid on scroll DOM reads
//     //TODO - update values on resize
//     var windowHeight = window.innerHeight
//     var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)

//     d3.select(window).on('scroll.ad-refesh', _.throttle(function(){
//       //calculate current segment of page
//       var nextI = Math.floor(scrollY/((pageHeight - windowHeight)/config.num_ad_scroll_refesh))
//       //clamp segment values 
//       nextI = Math.min(config.num_ad_scroll_refesh - 1, Math.max(0, nextI))

//       //only update ads if we've moved to different segment 
//       if (curI == nextI) return
//       curI = nextI

//       //assumes we only have one fixed banner add
//       var ad = d3.select(ads[0]).style({overflow: 'hidden', height: '90px'})

//       var randValue = new String(Math.random()).substring(2,11);
//       var adStr = new_leader + '&position=leaderboard' + (curI + 1) + '&ord=' + randValue + '"></iframe>'
//       ad.append('div').html(adStr)

//       window.setTimeout(function(){
//         var numIframes = ad.selectAll('iframe').size()
//         ad.selectAll('iframe')
//             .filter(function(d, i){ return i < numIframes - 1 })
//             .remove()

//       }, 2000)
//     }, 500))

//   }, 2000)

// })();


//inline ads for mobile and tablet
!(function() {
  if (isTerminal) return
  var slug = config.bb_slug;

  var ads = d3.selectAll('.bannerad');

  var sizeStr  = innerWidth > 740 ? 'width="728" height="90' : 'width="300" height="250"'
  var sizeParm = innerWidth > 740 ? '728x90|1x1' : '300x250'
  var sizePos  = innerWidth > 740 ? 'leaderboard' : 'box'

  var new_leader = '<iframe ' + sizeStr + ' id="lb_ad_frame" style="visibility:hidden;"' +
      'onload="this.style.visibility=' + "'visible'" +
      '" class="ad_frame" scrolling="no" frameborder="no" src="' +
      'http://www.bloomberg.com/graphics/assets/ad.html?url=/' + config.bb_slug + 
      "&size=" + sizeParm + "&iu="+config.ad_code+"&correlator=" +
      (config.correlator || new String(Math.random()).substring(2,11));

    ads
    .filter(function(__, i){ return i || innerWidth >= 1240 })
    .each(function(__, i){
      var randValue = new String(Math.random()).substring(2,11);
      var n = i + 1;
      var innerHTML = new_leader + '&position=' + sizePos + n + '&ord=' + randValue + '"></iframe>';      
      
      //always load top banner
      if (!i && innerWidth >= 1240){
        d3.select(this)
            .html(innerHTML)
            .style('width', innerWidth > 740 ? '728px' : '300px')
            .style('margin', '0px auto')        
      } else{
        var sel = d3.select(this)
        addModule({
          sel: sel,
          oninit: function(){ 
            sel.html(innerHTML)
                .style('width', innerWidth > 740 ? '728px' : '300px')
                .style('margin', '0px auto')
          },
          minWidth: 1
          ,
          name: 'ad-' + n
        })

      }
    })  

})()


var tracker = Tracker(config);
//track events
tracker('load', 'initial');

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
