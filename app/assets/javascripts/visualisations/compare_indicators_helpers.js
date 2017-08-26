// Helpers to extract data point information
function x(d) { return d.xVal; }
function y(d) { return d.yVal; }
function radius(d) { return d.zVal; }
function color(d) { return d.region; }
function key(d) { return d.country; }
function dotId(d) { return "code_" + d.code; } // Give each dot an id

// Make sure that smaller dots are on top so they can be seen.
function order(a, b) {
  return radius(b) - radius(a);
}

function createAxis(bubbleSvg){
  var xScale = d3.scale.linear().domain([0, 100]).range([0, graphWidth]);
  var yScale = d3.scale.linear().domain([0, 100]).range([graphHeight, 0]);
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(10, "").tickFormat("");
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10, "").tickFormat("");

  // Draw axis
  bubbleSvg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + graphHeight + ")")
  .call(xAxis);
  bubbleSvg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

  // Create axis labels
  bubbleSvg.append("text")
  .attr("class", "axis-label")
  .attr("id", "x-axis-label")
  .attr("transform", "translate(" + (graphWidth / 2) + " ," + (graphHeight + margin.bottom) + ")")
  .style("text-anchor", "middle")
  .text("");

  bubbleSvg.append("text")
  .attr("class", "axis-label")
  .attr("id", "y-axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (graphHeight / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("");
}

function createStarterMessage(bubbleSvg) {
  var radius = 180,
  x      = graphWidth/2.0,
  y      = graphHeight/2.5,
  side   = 2 * radius * Math.cos(Math.PI / 4),
  dx     = radius - side / 2;

  var startCircle = bubbleSvg.append('g')
  .attr("class", "start-message")
  .attr('transform', 'translate(' + [ dx, dx ] + ')');

  startCircle.append('circle')
  .attr("class", "start-circle")
  .attr('cx', x)
  .attr('cy', y)
  .attr('r', radius);

  startCircle.append('foreignObject')
  .attr('x', x - (side/2))
  .attr('y', y - (side/2))
  .attr('width', side)
  .attr('height', side)
  .append('xhtml:p')
  .html("Compare Indicators! </br>" +
  "</br> Look at the options on the right for more info.")
  .attr("class", "start-text");
}

function createLegend(bubbleSvg, colorScale, data){
  var legendRectSize = 18;
  var legendSpacing = 4;

  var legend = bubbleSvg.selectAll('.legend')
  .data(colorScale.domain())
  .enter().append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var horz = graphWidth + 10;
    var vert = i * height * 1.5 + margin.top;
    return 'translate(' + horz + ',' + vert + ')';
  });

  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', colorScale)
  .style('stroke', colorScale)
  .on('click', function (label) {
    // Get the element we clicked on and toggle it and react to data selection
    var selected = d3.select(this).classed("disabled");
    d3.select(this).classed("disabled", !selected);
    data.forEach (function (d) {
      if (d.region == label) {
        d3.select("#" + dotId(d)).classed("dots-selected", !selected);
      }
    });
  });

  legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });
}

function highlightYearLabel(state) {
  d3.select("#year-label").classed("active", state);
}

function findMin(data, value, i){
  return d3.min(data, function(country) {
    return d3.min(country[value], function (d) {return d[i]; });
  });
}

function findMax(data, value, i){
  return d3.max(data, function(country) {
    return d3.max(country[value], function (d) {return d[i]; });
  });
}

function updateYearSliderView(start, end){
  $('#ci-years-selector').attr("min", start);
  $('#ci-years-selector').attr("max", end);
  $('#min-year').text(start);
  $('#max-year').text(end);
}
