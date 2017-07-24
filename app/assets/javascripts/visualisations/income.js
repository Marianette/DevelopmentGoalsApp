var incomeCurrentYear;

function initIncomeVis(id) {
  // Add loading icon & stop after load
  var url = $(id).data('url');
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: url,
    dataType: 'json',
    success: function (data) {
      createIncomeVis(data, id);
    },
    error: function (result) {
      console.log('Error');
    }
  });
}

function createIncomeVis(data, id) {
  var fullPlotWidth = $('.income-vis-container').width();
  var fullPlotHeight = 400;

  incomeCurrentYear = "2015";
  // These are the margins around the graph. Axes labels go in margins.
  var margin = {top: 20, right: 20, bottom: 20, left: 40};

  var plotWidth = fullPlotWidth - margin.left - margin.right,
  plotHeight = fullPlotHeight - margin.top - margin.bottom;

  var widthScale = d3.scale.ordinal()
  .rangeRoundBands([margin.left, plotWidth], 0.2);

  var heightScale = d3.scale.linear()
  .range([0, plotHeight]);

  var xAxis = d3.svg.axis()
  .scale(widthScale)
  .orient("bottom")
  .innerTickSize([0])
  .outerTickSize([0]);

  var dotPlotSvg = d3.select(id).append("svg")
  .attr("width", fullPlotWidth)
  .attr("height", fullPlotHeight);

  data.sort(function(a, b) {
      return d3.descending(a.male[incomeCurrentYear], b.male[incomeCurrentYear]);
    });

  var dataMax = data[0].male[incomeCurrentYear] + 5000;

    heightScale.domain([0, dataMax]);
    widthScale.domain(data.map(function(d) { return d.country; } ));

    // Make the faint lines from y labels to highest dot
    var linesGrid = dotPlotSvg.selectAll("lines.grid")
    .data(data)
    .enter()
    .append("line");

    linesGrid.attr("class", "grid")
    .attr("x1", function(d) {
      return widthScale(d.country) + widthScale.rangeBand()/2;
    })
    .attr("y1", plotHeight)
    .attr("x2", function(d) {
      return widthScale(d.country) + widthScale.rangeBand()/2;
    })
    .attr("y2", function(d) {
      return plotHeight - heightScale(d.male[incomeCurrentYear]);
    });

    // Make the dots for 1990
    var dotsFemale = dotPlotSvg.selectAll("circle.female")
    .data(data)
    .enter()
    .append("circle");

    dotsFemale
    .attr("class", "dot-plot-female")
    .attr("cx", function(d) {
      return widthScale(d.country) + widthScale.rangeBand()/2;
    })
    .attr("r", widthScale.rangeBand()/2)
    .attr("cy", function(d) {
      return plotHeight - heightScale(d.female[incomeCurrentYear]);
    });

    // Make the dots for 2015
    var dotsMale = dotPlotSvg.selectAll("circle.male")
    .data(data)
    .enter()
    .append("circle");

    dotsMale
    .attr("class", "dot-plot-male")
    .attr("cx", function(d) {
      return widthScale(d.country) + widthScale.rangeBand()/2;
    })
    .attr("r", widthScale.rangeBand()/2)
    .attr("cy", function(d) {
      return plotHeight - heightScale(d.male[incomeCurrentYear]);
    });

    dotPlotSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + plotHeight + ")")
    .call(xAxis);

    dotPlotSvg.append("text")
    .attr("class", "ylabel")
    .attr("transform", "translate(" + (margin.left/2) + "," + (plotHeight - margin.bottom/2) + ")")
    .style("text-anchor", "middle")
    .attr("dy", "12")
    .text("$0");
}
