!(function(){

  var module = {sel: d3.select('[data-module="tree"]')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot").call(module.bot);

  var dialogue = [
    {
      "emote": "explaining",
      "speak": "Even this very Web page, the page that you are reading, is a tree (and since this is an article about code, we filled this page with code). Here's a small piece of that for just this section of the article. Click around and see what happens: every paragraph is a branch; images and tables are branches, too. In a table, every row is a branch, and then every column is a branch off of that. And in a paragraph, anything with its own formatting is a branch. Even the tree visualization itself is a branch (try to find the branch labeled 'svg'). That’s right: The tree contains the tree. Computers are weird."
    },
    { "emote": "tree" }
  ];

  module.oninit = function() {
    treeMe(module.sel, d3.select("[data-section='2']").node());
    module.bot.dialogue(dialogue);
  }

  // based on http://bl.ocks.org/mbostock/4339083
  function treeMe(sel, node) {

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = sel.node().offsetWidth - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

    var i = 0,
        duration = 500,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var fisheye = d3.fisheye.circular()
        .radius(100)
        .distortion(15)
        .focus([-1000,-1000]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = sel.append("div.svg-container").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mousemove", mousemove);

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

    // root.children.forEach(collapse);
    collapse(root);
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
          .data(nodes, function(d) { return d.id || (d.id = ++i); })
          .each(function(d) { d.fisheye = fisheye({x: d.y, y: d.x}); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
          .each(function(d) { d.fisheye = fisheye({x: d.y, y: d.x}); })
          .classed("node", true)
          .classed("child", function(d) { return !d.children; })
          .classed("parent", function(d) { return d.children; })
          .classed("expandable", function(d) { return d._children && d._children.length; })
          .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
          .on("click", click);

      nodeEnter.append("rect")
          .attr("x", 1e-6)
          .attr("y", 1e-6)
          .attr("width", 1e-6)
          .attr("height", 1e-6);

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6)
          .style("font-size", function(d) { return 10*d.fisheye.z + "px" });

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
            if(!d.fisheye) d.fisheye = fisheye({x: d.y, y: d.x});
            return "translate(" + d.fisheye.x + "," + d.fisheye.y + ")";
          });

      nodeUpdate.select("rect")
          .attr("x", function(d) { return d.fisheye.z * -10; })
          .attr("y", function(d) { return d.fisheye.z * -10; })
          .attr("width", function(d) { return d.fisheye.z * 20; })
          .attr("height", function(d) { return d.fisheye.z * 20; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1)
          .attr("x", function(d) { return d.children || d._children ? -10*d.fisheye.z : 10*d.fisheye.z; })
          // .style("font-size", function(d) { return 10*d.fisheye.z + "px" });

      nodeUpdate.each(function(d) {
          d.iframe
            .transition()
            .duration(duration)
            .style("left", function(d) { return d.source.fisheye.x + margin.left + 'px'; })
            .style("top", function(d) { return d.source.fisheye.y + margin.top + 'px'; })
            .style("transform", function(d) { return "translate(-50%,-50%) scale(" + (.1*d.source.fisheye.z) + ")"; })
        })

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit()
        .each(function(d) { d.iframe.remove(); })
        .transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.fisheye.x + "," + source.fisheye.y + ")"; })
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
            var o = {x: d.source.y0, y: d.source.x0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", function(d) {
            var source = {x: d.source.fisheye.y, y: d.source.fisheye.x};
            var target = {x: d.target.fisheye.y, y: d.target.fisheye.x};
            return diagonal({source: source, target: target});
          });

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: d.source.fisheye.y, y: d.source.fisheye.x};
            return diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.fisheye.x;
        d.y0 = d.fisheye.y;
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

    function mousemove(d) {
      fisheye.focus(d3.mouse(this));

      var node = svg.selectAll("g.node");

      node.each(function(d) { d.fisheye = fisheye({x: d.y, y: d.x}); })
          .attr("transform", function(d) { return "translate(" + d.fisheye.x + "," + d.fisheye.y + ")"; });

      node.select("rect")
          .attr("x", function(d) { return d.fisheye.z * -10; })
          .attr("y", function(d) { return d.fisheye.z * -10; })
          .attr("width", function(d) { return d.fisheye.z * 20; })
          .attr("height", function(d) { return d.fisheye.z * 20; });

      node.select("text")
          .attr("x", function(d) { return d.children || d._children ? -10*d.fisheye.z : 10*d.fisheye.z; })
          // .style("font-size", function(d) { return 10*d.fisheye.z + "px" });

      var link = svg.selectAll("path.link")
          .attr("d", function(d) {
            var source = {x: d.source.fisheye.y, y: d.source.fisheye.x};
            var target = {x: d.target.fisheye.y, y: d.target.fisheye.x};
            return diagonal({source: source, target: target});
          })

      node.each(function(d) {
        d.iframe
          .style("left", function(d) { return d.source.fisheye.x + margin.left + 'px'; })
          .style("top", function(d) { return d.source.fisheye.y + margin.top + 'px'; })
          .style("transform", function(d) { return "translate(-50%,-50%) scale(" + (.1*d.source.fisheye.z) + ")"; })
      });

    }

    function appendIframe(d) {
      d.iframe = sel.select(".svg-container")
        .append("iframe")
        .datum({source: d})
        .style("left", function(d) { return d.source.x0 + margin.left + 'px'; })
        .style("top", function(d) { return d.source.y0 + margin.top + 'px'; })
        .style("transform", function(d) { return "translate(-50%,-50%) scale(" + (.1*d.source.fisheye.z) + ")"; });

      var iframeDocument = d.iframe.node().contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(d.ref.innerHTML);
      iframeDocument.close();
    }

    function getDomTree(node) {
      return {
        "name": "<"+node.nodeName+">",
        "ref": node,
        "size": node.innerHTML.length,
        "children": Array.prototype.slice.call(node.children).map(getDomTree)
      };
    }

  }

})();
