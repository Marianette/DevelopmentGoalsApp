// Source code at https://bl.ocks.org/mbostock/4062045 adapted to v3 D3.
forcegraph = function (graph) {
  var width = 960;
  var height = 600;

  var color = d3.scale.category20();

  var simulation = d3.layout.force()
  .charge(-120)
  .linkDistance(function(d) {return 4*d.value;})
  .size([width, height]);

  var svg = d3.select("#forcelayoutgraph")
  .attr("width", 960)
  .attr("height", 600);

  simulation
  .nodes(graph.nodes)
  .links(graph.links)
  .start()

  var link = svg.selectAll(".link")
  .data(graph.links)
  .enter().append("line")
  .attr("class", "link")
  .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
  .data(graph.nodes)
  .enter().append("circle")
  .attr("r", 5)
  .style("fill", function(d) {return color(d.group);})
  .call(simulation.drag);

  node.append("title")
  .text(function(d) {return d.name;});

  simulation.on("tick", function () {
    link.attr("x1", function(d) {return d.source.x;})
        .attr("y1", function(d) {return d.source.y;})
        .attr("x2", function(d) {return d.target.x;})
        .attr("y2", function(d) {return d.target.y;});

    node.attr("cx", function(d) {return d.x;})
        .attr("cy", function(d) {return d.y;});
  });

};
