!(function(){

  var module = {sel: d3.select('[data-module="tree"]')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var dialogue = [
    {
      "emote": "tree",
      "speak": "You are reading a tree right now! Look down there. You’ll see this section of the article organized as a tree. Click the boxes to expand branches for every paragraph, image, and table. Everything you have just read is a branch—even this graphic of a tree. That’s right: This tree contains a tree. Computers are weird."
    }
  ];

  module.oninit = function() {
    treeMe(module.sel, d3.select("[data-section='2'] .code-content").node());
    module.bot.dialogue(dialogue);
  }

  // based on http://bl.ocks.org/mbostock/4339083
  // https://twitter.com/bizweekgraphics/status/608467609416298496
  function treeMe(sel, node) {

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = sel.node().offsetWidth - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

    var i = 0,
        duration = 1000,
        nodeSize = 30,
        hoverCoef = 5,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = sel.append("div.svg-container").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // invisible rect to capture mousemoves
    svg.append("rect")
      .attr("x", -margin.left)
      .attr("y", -margin.top)
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .style("visibility", "hidden")
      .style("pointer-events", "all");

    root = getDomTree(node);
    root.x0 = height / 2;
    root.y0 = 0;

    // TOO MANY CHILDREN
    function truncate(d) {
      if (d.children) {
        d.children = d.children.slice(0,20);
        d.children.forEach(truncate);
      }
    }

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function findMaxDepth(nodes) {
      return _.max(nodes.map(function(node, index) {
        return node.children ? findMaxDepth(node.children) : node.depth;
      }));
    }

    root.children = root.children.slice(45,65);
    // truncate(root);
    root.children.forEach(collapse);
    // collapse(root);
    update(root);

    d3.select(self.frameElement).style("height", "800px");

    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

      maxDepth = findMaxDepth(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) {
        d.y = maxDepth ? d.depth * (width / maxDepth) : 0;
      });

      // Update the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .classed("node", true)
          .classed("child", function(d) { return !d.children; })
          .classed("parent", function(d) { return d.children; })
          .classed("expandable", function(d) { return d._children && d._children.length; })
          .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
          .on("click", click)
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);

      nodeEnter.append("rect")
          .attr("x", 1e-6)
          .attr("y", 1e-6)
          .attr("width", 1e-6)
          .attr("height", 1e-6);

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -nodeSize/2 : nodeSize/2; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6)
          .style("font-size", function(d) { return nodeSize/2 + "px" });

      nodeEnter.each(appendIframe);

      // Update classes
      node
          .classed("child", function(d) { return !d.children; })
          .classed("parent", function(d) { return d.children; })
          .classed("expandable", function(d) { return d._children && d._children.length; })

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
          });

      nodeUpdate.select("rect")
          .attr("x", function(d) { return -nodeSize/2; })
          .attr("y", function(d) { return -nodeSize/2; })
          .attr("width", function(d) { return nodeSize; })
          .attr("height", function(d) { return nodeSize; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1)
          .attr("x", function(d) { return d.children || d._children ? -nodeSize/2 : nodeSize/2; })

      node.each(function(d) {
          d.iframe
            .transition()
            .duration(duration)
            .style("left", function(d) { return d.y + margin.left + 'px'; })
            .style("top", function(d) { return d.x + margin.top + 'px'; })
        })

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit()
        .each(function(d) { d.iframe.remove(); })
        .transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("rect")
          .attr("x", 1e-6)
          .attr("y", 1e-6)
          .attr("width", 1e-6)
          .attr("height", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: d.source.x0, y: d.source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", function(d) {
            var source = {x: d.source.x, y: d.source.y};
            var target = {x: d.target.x, y: d.target.y};
            return diagonal({source: source, target: target});
          });

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    function mouseover(d) {

      d3.select(this).select("rect")
          .attr("x", function(d) { return hoverCoef * -nodeSize/2; })
          .attr("y", function(d) { return hoverCoef * -nodeSize/2; })
          .attr("width", function(d) { return hoverCoef * nodeSize; })
          .attr("height", function(d) { return hoverCoef * nodeSize; });

      d.iframe
          .classed("hover", true)
          .style("z-index", 3)
          .style("border-width", "2px")
          .style("transform", function(d) { return "translate(-50%,-50%) scale(" + (hoverCoef * .2) + ")"; })
          .style("-webkit-transform", function(d) { return "translate(-50%,-50%) scale(" + (hoverCoef * .2) + ")"; })
          .style("-moz-transform", function(d) { return "translate(-50%,-50%) scale(" + (hoverCoef * .2) + ")"; });
    }

    function mouseout(d) {

      d3.select(this).select("rect")
          .attr("x", function(d) { return -nodeSize/2; })
          .attr("y", function(d) { return -nodeSize/2; })
          .attr("width", function(d) { return nodeSize; })
          .attr("height", function(d) { return nodeSize; });

      d.iframe
          .classed("hover", false)
          .style("z-index", 2)
          .style("border-width", "10px")
          .style("transform", function(d) { return "translate(-50%,-50%) scale(.2)"; })
          .style("-webkit-transform", function(d) { return "translate(-50%,-50%) scale(.2)"; })
          .style("-moz-transform", function(d) { return "translate(-50%,-50%) scale(.2)"; });
    }

    function appendIframe(d) {
      d.iframe = sel.select(".svg-container")
        .append("div.iframe-container")
        .datum(d)
        .classed("expandable", function(d) { return d._children && d._children.length; })
        .style("left", function(d) { return d.parent ? d.parent.y0 + margin.left + 'px' : d.x0; })
        .style("top", function(d) { return d.parent ? d.parent.x0 + margin.top + 'px' : d.y0; });
      
      d.iframe.append("div.title").text(function(d) { return d.description ? d.description : d.name; });

      // could also append label for class list, like so...
      // d.iframe.append("div.class-list").text(function(d) { return d.ref ? d.ref.classList : ''; });

      var inlineStyle = "<style>img{max-width:100%;}</style>";

      var iframeEl = d.iframe.append("iframe");
      var iframeDocument = iframeEl.node().contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(inlineStyle + d.ref.outerHTML);
      iframeDocument.close();
    }

    function getDomTree(node) {
      // from here http://www.w3.org/TR/html4/index/elements.html
      // lightly edited, plus new html5 elements and a few relevant svg elements
      // (goin' for clarity here, not namespace-spec-conformity...)
      var htmlElements = [
        {"name":"a","description":"anchor"},
        {"name":"abbr","description":"abbreviated form"},
        {"name":"acronym","description":"acronym"},
        {"name":"address","description":"information on author"},
        {"name":"applet","description":"Java applet"},
        {"name":"area","description":"image map area"},
        {"name":"article","description":"article"},
        {"name":"aside","description":"aside"},
        {"name":"audio","description":"sound or music"},
        {"name":"b","description":"bold text style"},
        {"name":"base","description":"document base URI"},
        {"name":"basefont","description":"base font size"},
        {"name":"bdi","description":""},
        {"name":"bdo","description":"I18N BiDi over-ride"},
        {"name":"big","description":"large text style"},
        {"name":"blockquote","description":"long quotation"},
        {"name":"body","description":"document body"},
        {"name":"br","description":"forced line break"},
        {"name":"button","description":"push button"},
        {"name":"caption","description":"table caption"},
        {"name":"center","description":"center-aligned"},
        {"name":"cite","description":"citation"},
        {"name":"code","description":"code fragment"},
        {"name":"col","description":"table column"},
        {"name":"colgroup","description":"table column group"},
        {"name":"datalist","description":"datalist input"},
        {"name":"dd","description":"definition description"},
        {"name":"del","description":"deleted text"},
        {"name":"details","description":"details"},
        {"name":"dfn","description":"instance definition"},
        {"name":"dialog","description":"dialog box"},
        {"name":"dir","description":"directory list"},
        {"name":"div","description":"generic block container"},
        {"name":"dl","description":"definition list"},
        {"name":"dt","description":"definition term"},
        {"name":"em","description":"emphasis"},
        {"name":"embed","description":"container for external applications"},
        {"name":"fieldset","description":"form control group"},
        {"name":"figcaption","description":"figure caption"},
        {"name":"figure","description":"figure"},
        {"name":"font","description":"local change to font"},
        {"name":"footer","description":"footer"},
        {"name":"form","description":"interactive form"},
        {"name":"frame","description":"subwindow"},
        {"name":"frameset","description":"window subdivision"},
        {"name":"g","description":"group"},
        {"name":"h1","description":"heading"},
        {"name":"h2","description":"subheading"},
        {"name":"h3","description":"subsubheading"},
        {"name":"h4","description":"subsubsubheading"},
        {"name":"h5","description":"subsubsubsubheading"},
        {"name":"h6","description":"subsubsubsubsubheading"},
        {"name":"head","description":"document head"},
        {"name":"header","description":"header"},
        {"name":"hr","description":"horizontal rule"},
        {"name":"html","description":"document root element"},
        {"name":"i","description":"italic text style"},
        {"name":"iframe","description":"inline subwindow"},
        {"name":"img","description":"embedded image"},
        {"name":"input","description":"form control"},
        {"name":"ins","description":"inserted text"},
        {"name":"isindex","description":"single line prompt"},
        {"name":"kbd","description":"text to be entered by the user"},
        {"name":"keygen","description":"key-pair generator field"},
        {"name":"label","description":"form field label text"},
        {"name":"legend","description":"fieldset legend"},
        {"name":"li","description":"list item"},
        {"name":"link","description":"a media-independent link"},
        {"name":"main","description":"main content"},
        {"name":"map","description":"client-side image map"},
        {"name":"mark","description":"marked text"},
        {"name":"menu","description":"menu list"},
        {"name":"menuitem ","description":"menu item"},
        {"name":"meta","description":"generic metainformation"},
        {"name":"meter","description":"meter"},
        {"name":"nav","description":"navigation"},
        {"name":"noframes","description":"alternate content container for non frame-based rendering"},
        {"name":"noscript","description":"alternate content container for non script-based rendering"},
        {"name":"object","description":"generic embedded object"},
        {"name":"ol","description":"ordered list"},
        {"name":"optgroup","description":"option group"},
        {"name":"option","description":"selectable choice"},
        {"name":"output","description":"calculation output"},
        {"name":"p","description":"paragraph"},
        {"name":"param","description":"named property value"},
        {"name":"pre","description":"preformatted text"},
        {"name":"progress","description":"progress"},
        {"name":"q","description":"short inline quotation"},
        {"name":"rect","description":"rectangle"},
        {"name":"rp","description":""},
        {"name":"rt","description":"explanation/pronunciation"},
        {"name":"ruby","description":"ruby annotation"},
        {"name":"s","description":"strike-through text style"},
        {"name":"samp","description":"sample program output, scripts, etc."},
        {"name":"script","description":"script statements"},
        {"name":"section","description":"section"},
        {"name":"select","description":"option selector"},
        {"name":"small","description":"small text style"},
        {"name":"source","description":"audio/video source"},
        {"name":"span","description":"generic inline container"},
        {"name":"strike","description":"strike-through text"},
        {"name":"strong","description":"strong emphasis"},
        {"name":"style","description":"style info"},
        {"name":"sub","description":"subscript"},
        {"name":"summary","description":"summary of details"},
        {"name":"sup","description":"superscript"},
        {"name":"svg","description":"scalable vector graphics"},
        {"name":"table","description":"table"},
        {"name":"tbody","description":"table body"},
        {"name":"td","description":"table data cell"},
        {"name":"textarea","description":"multi-line text field"},
        {"name":"tfoot","description":"table footer"},
        {"name":"th","description":"table header cell"},
        {"name":"thead","description":"table header"},
        {"name":"time","description":"date/time"},
        {"name":"title","description":"document title"},
        {"name":"tr","description":"table row"},
        {"name":"track","description":"audio/video track"},
        {"name":"tt","description":"teletype"},
        {"name":"u","description":"underlined text style"},
        {"name":"ul","description":"unordered list"},
        {"name":"var","description":"variable"},
        {"name":"video","description":"video"},
        {"name":"wbr","description":"possible line-break"}];

      var nodeDescription = _.findWhere(htmlElements, {"name": node.nodeName.toLowerCase()});
      nodeDescription = nodeDescription ? nodeDescription.description : nodeDescription;

      return {
        "name": node.nodeName,
        "description": nodeDescription,
        "ref": node,
        "size": (node && node.innerHTML) ? node.innerHTML.length : 0,
        "children": node.children ? Array.prototype.slice.call(node.children).map(getDomTree) : null
      };
    }

  }

})();
