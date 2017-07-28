var graphWidth, graphHeight, margin;

function createEmptyGraph(id){
  // Dimensions of the bubble graph
  margin = {top: 20, right: 180, bottom: 40, left: 40};
  graphWidth = $("#compare-vis").width() - margin.right - margin.left;
  graphHeight = 560 - margin.top - margin.bottom;

  var bubbleSvg = d3.select(id).append("svg")
      .attr("id", "bubbleSvg")
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add temporary empty axis
  createAxis(bubbleSvg);

  // Add message
  createStarterMessage(bubbleSvg);
}

function updateBubbleGraph(data, xLabel, yLabel) {
  // Redefine dimension scales and axis values
  var xScale = d3.scale.log().domain([300, 1e5]).range([0, graphWidth]);
  var yScale = d3.scale.linear().domain([10, 85]).range([graphHeight, 0]);
  var radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]);
  var colorScale = d3.scale.category10();
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d"));
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  var bubbleSvg = d3.select("#bubbleSvg");

  // Update axis and add labels
  bubbleSvg.selectAll("g.x.axis")
      .call(xAxis);
  bubbleSvg.append("g.y.axis")
      .call(yAxis);
  d3.select("#x-axis-label").text(xLabel);
  d3.select("#y-axis-label").text(yLabel);

  // A bisector since data could be sparsely-defined.
  var bisect = d3.bisector(function(d) { return d[0]; });

  // Add large faded year label on graph.
  var startYear = 1800; // TODO calculate this.
  var label = bubbleSvg.append("text")
      .attr("class", "year label")
      .attr("text-anchor", "end")
      .attr("y", graphHeight + margin.top)
      .attr("x", graphWidth + margin.left)
      .attr("id", "yearLabel")
      .text(startYear);

  // Add a dot per nation. Initialize the data at 1800, and set the colors.
  var dot = bubbleSvg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(interpolateData(startYear))
    .enter().append("circle")
      .attr("class", "dot")
      .attr("data-legend",function(d) { return d.country})
      .attr("id", function (d) {return dotId(d);})
      .style("fill", function(d) { return colorScale(color(d)); })
      .call(position)
      .sort(order);

  // Give each dot the name of the country.
  dot.append("title").text(function(d) { return d.country; });

  // Add a legend
  var legendRectSize = 18;
  var legendSpacing = 4;

  var legend = bubbleSvg.selectAll('.legend')
  .data(colorScale.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var horz = graphWidth + 39.5;
    var vert = i * graphHeight * 1.5;
    return 'translate(' + horz + ',' + vert + ')';
  });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', colorScale)
    .style('stroke', colorScale)
    .on('click', function (label) {
      // Get the element we clicked on and toggle it
      var rect = d3.select(this);
      if(rect.attr('class') == 'disabled') {
        rect.attr('class', '');
      } else {
        rect.attr('class', 'disabled');
      }

      // TODO Deselect data
    });

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

  // Add an overlay for the year label. The overlay allows the year to be changed
  // as the user scrolls over the large year label.
  // TODO Temporary hard coded values. Another option is to append elememt to an element
  // in the dom that will be visible, set the visibility to hidden, get the bounding
  // box, and then remove the element, and append it to the rightful place.
  var box = {x: 420, y: 262, width: 392, height: 217};

  var overlay = bubbleSvg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        .on("mouseover", enableInteraction);  //  call enableInteraction method when mouse goes over label.

  // Add controls for animation
  d3.select('#play-bubble-btn')
  .on('click', function (d) {
    bubbleSvg.transition()
        .duration(30000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);
  });
  d3.select('#stop-bubble-btn')
  .on('click', function (d) {
    bubbleSvg.transition().duration(0);
  });

  // Positions the dots based on data.
  function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
        .attr("cy", function(d) { return yScale(y(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Change year by interacting with year label.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
        .domain([1800, 2009])  // data range
        .range([box.x + 10, box.x + box.width - 10])  // range of box
        .clamp(true); // Force values to be within specified range (eg. if something greater than
                      // 2009 was given, would give input as 2009).

    // Stop whatever transition is currently happening
    bubbleSvg.transition().duration(0);

    // React to different mouse movements on the year label.
    overlay
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove);

    // Change class of label to allow css styling of mouse when over the label.
    function mouseover() {
      label.classed("active", true);
    }

    function mouseout() {
      label.classed("active", false);
    }

    // Change data vis to display specific year as mouse moves over it.
    function mousemove() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
    }
  }

  // Tweens the entire chart by first tweening the year, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenYear() {
    var curYear = d3.select('#yearLabel').text();
    if(curYear == 2009) curYear = 1800;
    var year = d3.interpolateNumber(curYear, 2009);
    return function(t) { displayYear(year(t)); };
  }

  // Updates the display to show the specified year.
  function displayYear(year) {
    dot.data(interpolateData(year), key)
      .call(position)
      .sort(order);
    label.text(Math.round(year));
  }

  // Interpolates the dataset for the given (fractional) year.
  function interpolateData(year) {
    return data.map(function(d) {
      return {
        country: d.country,
        region: d.region,
        x: interpolateValues(d.x, year),
        population: interpolateValues(d.population, year),
        y: interpolateValues(d.y, year)
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
