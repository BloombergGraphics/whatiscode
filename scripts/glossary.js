buildGlossary();

function buildGlossary() {
  var glossary = [];
  $("dl").each(function(i, dl) {
    var dts = $(dl).find("dt").toArray();
    var dds = $(dl).find("dd").toArray();
    glossary.push(
      _.zip(dts,dds)
      .map(function(d) {
        return {
          "title": $(d[0]).html(),
          "description": $(d[1]).html()
        };
      })
    );
  });

  $("#glossary").append($("dl").clone());
}
