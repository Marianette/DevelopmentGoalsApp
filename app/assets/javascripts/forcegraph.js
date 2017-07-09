// Source code at https://bl.ocks.org/mbostock/4062045 adapted to v3 D3.
forcegraph = function (graph) {
  var all_graphs = [];
  var all_sims = [];
  var width = 300;
  var height = 200;

  var color = d3.scale.category20();

  for(var i = 1; i < 3; i++){
    var svg = d3.select("#mygraphs")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    all_graphs.push(svg);

    var simulation = d3.layout.force()
    .charge(-120)
    .linkDistance(function(d) {return d.value;})
    .size([width, height]);
    all_sims.push(simulation);

  //all_sims.forEach(function(elem) {
    //elem
    simulation
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
  //});

  // Filter to adjust link distance
  var first_change = d3.select('#first');
  first_change.on('click', function (d) {
    graph.links.forEach( function (elem) {
      elem.value = elem.value + 50;
    });
    simulation //all_sims[0]
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
  });

//  for(var i = 0; i < all_graphs.length; i++){
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
  }

};
