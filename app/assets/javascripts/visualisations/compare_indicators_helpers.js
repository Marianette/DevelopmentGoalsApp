// Helpers to extract data point information
function x(d) { return d.x; }
function y(d) { return d.y; }
function radius(d) { return d.population; }
function color(d) { return d.region; }
function key(d) { return d.country; }
// function dotId(d) { return "code_" + d.country; } // TODO Give each dot an id
function dotId(d) {
    var removedPunctuation = d.country.replace(/[.,'"\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var removedSpaces = removedPunctuation.replace(/\s/g,'');
    return removedSpaces;
  }

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
