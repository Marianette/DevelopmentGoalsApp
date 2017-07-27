function createComparisonVis(id) {
  var dataurl = $(id).data("url");
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: dataurl,
    dataType: 'json',
    success: function (data) {
      initBubbleGraph(id, data);
      $(".loading-left").fadeOut("slow");
    },
    error: function (result) {
      console.log('Error');
    }
  });
}

function initBubbleGraph(id, data) {
  // Specify the four dimensions of data to visualise
  function x(d) { return d.income; }
  function y(d) { return d.lifeExpectancy; }
  function radius(d) { return d.population; }
  function color(d) { return d.region; }
  function key(d) { return d.name; }

  // Give each dot an id
  function dotId(d) {
    var removedPunctuation = d.name.replace(/[.,'"\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var removedSpaces = removedPunctuation.replace(/\s/g,'');
    return removedSpaces;
  }

  // Set enabled property to allow filtering of data by a legend
  data.forEach(function (d) {
    d.enabled = true;
  });

  // Chart dimensions.
  var margin = {top: 19.5, right: 200, bottom: 19.5, left: 39.5};
  var width = 1000 - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // Scales and axis. (Domains are specified using assumptions from the data)
  var xScale = d3.scale.log().domain([300, 1e5]).range([0, width]);
  var yScale = d3.scale.linear().domain([10, 85]).range([height, 0]);

  var radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]);
  var colorScale = d3.scale.category10();

  var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d"));
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  // Set attributes of svg
  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      // move svg to to the left, and down from the top (using fixed margin values)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add x axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add y axis.
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Add label for the x axis.
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("income per capita, inflation-adjusted (dollars)");

  // Add label for the y axis.
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("life expectancy (years)");

  // Add large faded (css styling will do this) year label on graph.
  var label = svg.append("text")
      .attr("class", "year label")
      .attr("text-anchor", "end")
      .attr("y", height - 24)
      .attr("x", width)
      .attr("id", "yearLabel")
      .text(1800);

  // A bisector since many nation's data is sparsely-defined.
  var bisect = d3.bisector(function(d) { return d[0]; });

  // Add a dot per nation. Initialize the data at 1800, and set the colors.
  var dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(interpolateData(1800))
    .enter().append("circle")
      .attr("class", "dot")
      .attr("data-legend",function(d) { return d.name})
      .attr("id", function (d) {return dotId(d);})
      .style("fill", function(d) { return colorScale(color(d)); })
      .call(position)
      .sort(order);

  // Give each dot the name of the country.
  dot.append("title")
    .text(function(d) { return d.name; });

  // Add a legend
  var legendRectSize = 18;
  var legendSpacing = 4;

  var legend = svg.selectAll('.legend')
  .data(colorScale.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var horz = width + margin.left;
    var vert = i * height * 1.5;
    return 'translate(' + horz + ',' + vert + ')';
  });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', colorScale)
    .style('stroke', colorScale)
    .on('click', function (label) {
      // Get the element we clicked on
      var rect = d3.select(this);
      var enabled = true;

      // Toggle it
      if(rect.attr('class') === 'disabled') {
        rect.attr('class', '');
      } else {
        rect.attr('class', 'disabled');
        enabled = false;
      }

      // Set the relevent enabled value for each entry in the data data set
      data.forEach (function (d) {
        if (d.region === label) {
          d.enabled = enabled;
        }

        // Update display
        if(d.enabled) {
          d3.select("#" + dotId(d)).attr('class', 'dot');
        } else {
          d3.select("#" + dotId(d)).attr('class', 'unselected');
        }
      });
    });

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

  // Add an overlay for the year label. The overlay allows the year to be changed
  // as the user scrolls over the large year label.
  // var box = label.node().getBBox(); - with tabs, this line of code does not work,
  // as label has yet to be rendered. Returns{0, 0, 0, 0}.
  // Temporary hard coded values. Another option is to append elememt to an element
  // in the dom that will be visible, set the visibility to hidden, get the bounding
  // box, and then remove the element, and append it to the rightful place.
  var box = {x: 420, y: 262, width: 392, height: 217};

  var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        .on("mouseover", enableInteraction);  //  call enableInteraction method when mouse goes over label.

  // Add controls for animation
  var play = d3.select('#play-bubble-btn');
  var stop = d3.select('#stop-bubble-btn');

  play.on('click', function (d) {
    svg.transition()
        .duration(30000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);
  });

  stop.on('click', function (d) {
    svg.transition().duration(0);
  });

  // Positions the dots based on data.
  function position(dot) {
    dot .attr("cx", function(d) { return xScale(x(d)); })
        .attr("cy", function(d) { return yScale(y(d)); })
        .attr("r", function(d) { return radiusScale(radius(d)); });
  }

  // Make sure that smaller dots are on top so they can be seen.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // Change year by interacting with year label.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
        .domain([1800, 2009])  // data range
        .range([box.x + 10, box.x + box.width - 10])  // range of box
        .clamp(true); // Force values to be within specified range (eg. if something greater than
                      // 2009 was given, would give input as 2009).

    // Stop whatever transition is currently happening
    svg.transition().duration(0);

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
        name: d.name,
        region: d.region,
        income: interpolateValues(d.income, year),
        population: interpolateValues(d.population, year),
        lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
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
