var graphWidth, graphHeight, margin;

function createEmptyGraph(id){
  // Dimensions of the bubble graph
  margin = {top: 20, right: 180, bottom: 40, left: 40};
  graphWidth = $("#compare-vis").width() - margin.right;
  graphHeight = 560 - margin.top - margin.bottom;

  var bubbleSvg = d3.select(id).append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphHeight + margin.top + margin.bottom)
  .append("g").attr("id", "bubbleSvg")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add temporary empty axis, year labels, and starter message
  createAxis(bubbleSvg);
  createYearLabel(bubbleSvg);
  createStarterMessage(bubbleSvg);
}

function updateBubbleGraph(data, xLabel, yLabel) {
  // Calculate max and min values
  var startYear = findMin(data, "x", 0);
  var endYear = findMax(data, "x", 0);
  var xmin = findMin(data, "x", 1), xmax = findMax(data, "x", 1);
  var ymin = findMin(data, "y", 1), ymax = findMax(data, "y", 1);
  var popMax = findMax(data, "population", 1);

  // Redefine dimension scales and axis values
  var xScale = d3.scale.linear().domain([xmin, xmax]).range([0, graphWidth]);
  var yScale = d3.scale.linear().domain([ymin, ymax]).range([graphHeight, 0]);
  var radiusScale = d3.scale.sqrt().domain([0, popMax]).range([0, 50]);
  var colorScale = d3.scale.category10();
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale);
  var yAxis = d3.svg.axis().orient("left").scale(yScale);

  var bubbleSvg = d3.select("#bubbleSvg");
  // Update axis and add labels
  bubbleSvg.selectAll("g.x.axis")
  .call(xAxis);
  bubbleSvg.selectAll("g.y.axis")
  .call(yAxis);
  d3.select("#x-axis-label").text(xLabel);
  d3.select("#y-axis-label").text(yLabel);

  // A bisector since data could be sparsely-defined.
  var bisect = d3.bisector(function(d) { return d[0]; });

  // Remove old dots and create new ones.
  d3.selectAll(".dots").transition()
  .duration(750)
  .attr("r", 0)
  .style("fill", "#fff")
  .remove()
  .call(endall, createDots);

  // Update year label on graph and overlay actions
  var label = d3.select("#year-label").text(endYear);
  var overlayBox = label.node().getBBox();
  var overlay = d3.select("#overlay")
  .attr("x", overlayBox.x)
  .attr("y", overlayBox.y)
  .attr("width", overlayBox.width)
  .attr("height", overlayBox.height)
  .on("mouseover", enableInteraction);

  // Add controls for animation
  d3.select('#play-bubble-btn')
  .on('click', function (d) {
    bubbleSvg.transition()
    .duration((endYear - label.text()) * 1000)  // 1 second to move 1 year
    .ease("linear")
    .tween("year", tweenYear)
    .each("end", enableInteraction);
  });

  d3.select('#stop-bubble-btn')
  .on('click', function (d) {
    bubbleSvg.transition().duration(0);
  });

  function createDots() {
    var dot = bubbleSvg.append("g")
    .attr("class", "dots")
    .selectAll(".dot")
    .data(interpolateData(endYear))
    .enter().append("circle")
    .attr("class", "dot")
    .attr("data-legend",function(d) { return d.country})
    .attr("id", function (d) {return dotId(d);})
    .style("fill", function(d) { return colorScale(color(d)); })
    .call(position)
    .sort(order);

    // Give each dot the name of the country.
    dot.append("title").text(function(d) { return d.country; });

    // Remove old legend and create new one
    d3.selectAll(".legend").transition()
    .duration(200)
    .style("opacity", 0)
    .remove()
    .call(endall, newLegend);

    function newLegend() {
      createLegend(bubbleSvg, colorScale, data);
    }
  }

  // Positions the dots based on data.
  function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
    .attr("cy", function(d) { return yScale(y(d)); })
    .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Change year by interacting with year label.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
    .domain([startYear, endYear])
    .range([overlayBox.x + 5, overlayBox.x + overlayBox.width - 5])
    .clamp(true);
    // Stop whatever transition is currently happening
    bubbleSvg.transition().duration(0);

    overlay.on("mouseover", highlightYearLabel(true))
    .on("mouseout", highlightYearLabel(false))
    .on("mousemove", changeVisYear)
    .on("touchmove", changeVisYear);

    // Change graph to display selected year as mouse moves over it.
    function changeVisYear() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
    }
  }

  // Tweens the entire chart by first tweening the year, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenYear() {
    var curYear = label.text();
    if(curYear == endYear) curYear = startYear;
    var year = d3.interpolateNumber(curYear, endYear);
    return function(t) { displayYear(year(t)); };
  }

  // Updates the display to show the specified year.
  function displayYear(year) {
    d3.selectAll(".dot").data(interpolateData(year), key)
    .call(position)
    .sort(order);
    label.text(Math.round(year));
  }

  // Interpolates the dataset for the given year.
  function interpolateData(year) {
    return data.map(function(d) {
      return {
        country: d.country,
        region: d.region,
        code: d.code,
        xVal: interpolateValues(d.x, year),
        population: interpolateValues(d.population, year),
        yVal: interpolateValues(d.y, year)
      };
    });
  }

  // Finds value for the specified year.
  function interpolateValues(values, year) {
    var i = bisect.left(values, year, 0, values.length - 1),
    a = values[i];
    if (i > 0) {
      var b = values[i - 1],
      t = (year - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
}
