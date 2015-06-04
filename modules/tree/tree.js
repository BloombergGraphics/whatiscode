!(function(){

  var module = {sel: d3.select('#put-tree-here')}
  addModule(module)

  module.bot = bot();
  module.sel.append("div.bot.aside").call(module.bot);

  module.onload = function() {
    if(module.sel.attr("data-loaded")) return;
    treeMe(module.sel, document.getElementById("text-2-8"));
    module.sel.attr("data-loaded", true);
    module.bot.mode("on").speak("Even this Web page is a tree. Here's the tree for just this section of the article. Click a branch to expand it and see what part of the page it represents. Every paragraph is a branch; images and tables are branches, too. In a table, every row is a branch, and then every column is a branch off of that. And in a paragraph, anything with its own formatting is a branch. Even the tree visualization itself is a branch (try to find the branch labeled 'svg').");
  }

  // based on http://bl.ocks.org/mbostock/4339083
  function treeMe(sel, node) {

    sel.classed("module-tree", true);

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = sel.node().offsetWidth - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = sel.append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

    root.children.forEach(collapse);
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
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", click)
          .on("mouseover", mouseover);

      nodeEnter.append("circle")
          .attr("r", 1e-6);

      nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

      // Update classes
      node
          .classed("child", function(d) { return !d.children; })
          .classed("parent", function(d) { return d.children; })
          .classed("expandable", function(d) { return d._children && d._children.length; })

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 4.5);

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", diagonal);

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
      var iframe = sel.selectAll("iframe").data([d]);
      iframe.enter().append("iframe");
      var iframeDocument = iframe.node().contentWindow.document;

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
