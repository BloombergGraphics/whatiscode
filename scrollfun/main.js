var mode = getQueryVariable("mode") || "scroll";

var articleTemplate = $("#articleTemplate").html(),
    styleTemplate = $("#styleTemplate").html();

var article = $("article"),
    style = $("style");

var n = 0;

if (mode=="timer") {
  var timer = setInterval(function() {
    if(read(n,n)) {
      n += 10;
    } else {
      clearInterval(timer);
    }
  });
} else if (mode=="scroll") {
  $(window).on("wheel", function(e) {
    n = Math.max(n + e.originalEvent.deltaY,0);
    read(n,n);
  })
}

function read(n_article, n_style) {
  article.html(articleTemplate.substr(0,n_article));
  style.html(styleTemplate.substr(0,n_style));
  return n_article <= articleTemplate.length || n_style <= styleTemplate.length;
}

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
