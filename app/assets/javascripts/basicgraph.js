bargraph = function (data) {
  var color = d3.scale.category10();
  var width = 420,
  barHeight = 20;

  var x = d3.scale.linear()
  .range([0, width])
  .domain([0, d3.max(data)]);

  var chart = d3.select("#basicgraph")
  .attr("width", width)
  .attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
  .data(data)
  .enter().append("g")
  .attr("transform", function (d, i) {
    return "translate(0," + i * barHeight + ")";
  });

  bar.append("rect")
  .attr("width", x)
  .attr("height", barHeight - 1)
  .style("fill", function (d) {
    return color(d);
  });

  bar.append("text")
  .attr("x", function (d) {
    return x(d) - 10;
  })
  .attr("y", barHeight / 2)
  .attr("dy", ".35em")
  .style("fill", "white")
  .text(function (d) {
    return d;
  });

  // create circles with data
  var padding = 30;  // to ensure that no circles get cut off.
  var w = 400;
  var h = 400;

  var graph = d3.select("#circles")
  .attr("width", w)
  .attr("height", h);

  var xScale = d3.scale.linear()
  .domain([0, d3.max(data, function(d) { return d; })])
  .range([padding, w - padding * 2]);

  var yScale = d3.scale.linear()
  .domain([0, d3.max(data, function(d) { return d; })])
  .range([h - padding, padding]);

  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .ticks(5);

  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(5);

  var circles = graph.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("cx", function(d) { return xScale(d); })
  .attr("cy", function(d) { return yScale(d); })
  .attr("r", function(d) { return d * 5; })
  .style("fill", function (d) {
    return color(d);
  })

  graph.selectAll('text')
  .data(data)
  .enter().append('text')
  .text(function (d) {
    return "Point " + d;
  })
  .attr("x", function(d) {
    return xScale(d);
  })
  .attr("y", function(d) {
    return yScale(d);
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "black");

  graph.append("g")
  .attr("class", "axis")  //Assign "axis" class
  .attr("transform", "translate(0," + (h - padding) + ")")
  .call(xAxis);

  graph.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);
}
