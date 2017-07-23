function initIncomeVis(id) {
  // TODO plot percentage gap. Don
  var data = $(id).data("data-attr");
  data = data.slice(0, 14);

  var fullPlotWidth = $('.income-vis-container').width();
  var fullPlotHeight = 400;

  // These are the margins around the graph. Axes labels go in margins.
  var margin = {top: 20, right: 20, bottom: 20, left: 40};

  var plotWidth = fullPlotWidth - margin.left - margin.right,
  plotHeight = fullPlotHeight - margin.top - margin.bottom;

  var widthScale = d3.scale.linear()
  .range([0, plotWidth]);

  var heightScale = d3.scale.ordinal()
  .rangeRoundBands([margin.top, plotHeight], 0.2);

  var xAxis = d3.svg.axis()
  .scale(widthScale)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(heightScale)
  .orient("left")
  .innerTickSize([0]);

  var dotPlotSvg = d3.select(id).append("svg")
  .attr("width", fullPlotWidth)
  .attr("height", fullPlotHeight);

  data.sort(function(a, b) {
      return d3.descending(a.male["2015"], b.male["2015"]);
    });

    widthScale.domain([0, 150000]);
    heightScale.domain(data.map(function(d) { return d.country; } ));

    // Make the faint lines from y labels to highest dot
    var linesGrid = dotPlotSvg.selectAll("lines.grid")
    .data(data)
    .enter()
    .append("line");

    linesGrid.attr("class", "grid")
    .attr("x1", margin.left)
    .attr("y1", function(d) {
      return heightScale(d.country) + heightScale.rangeBand()/2;
    })
    .attr("x2", function(d) {
      return margin.left + widthScale(d.male["2015"]);

    })
    .attr("y2", function(d) {
      return heightScale(d.country) + heightScale.rangeBand()/2;
    });

    // Make the dotted lines between the dots
    var linesBetween = dotPlotSvg.selectAll("lines.between")
    .data(data)
    .enter()
    .append("line");

    linesBetween.attr("class", "between")
    .attr("x1", function(d) {
      return margin.left + widthScale(d.female["2015"]);
    })
    .attr("y1", function(d) {
      return heightScale(d.country) + heightScale.rangeBand()/2;
    })
    .attr("x2", function(d) {
      return margin.left + widthScale(d.male["2015"]);
    })
    .attr("y2", function(d) {
      return heightScale(d.country) + heightScale.rangeBand()/2;
    })
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", function(d, i) {
      if (i == 7) {
        return "1";
      } else {
        return "0.5";
      }
    });


    // Make the dots for 1990
    var dotsFemale = dotPlotSvg.selectAll("circle.female")
    .data(data)
    .enter()
    .append("circle");

    dotsFemale
    .attr("class", "dot-plot-female")
    .attr("cx", function(d) {
      return margin.left + widthScale(d.female["2015"]);
    })
    .attr("r", heightScale.rangeBand()/2)
    .attr("cy", function(d) {
      return heightScale(d.country) + heightScale.rangeBand()/2;
    })
    .append("title")
    .text(function(d) {
      return d.country + " in 1990: " + d.female["2015"] + "%";
    });

    // Make the dots for 2015
    var dotsMale = dotPlotSvg.selectAll("circle.male")
    .data(data)
    .enter()
    .append("circle");

    dotsMale
    .attr("class", "dot-plot-male")
    .attr("cx", function(d) {
      return margin.left + widthScale(d.male["2015"]);
    })
    .attr("r", heightScale.rangeBand()/2)
    .attr("cy", function(d) {
      return heightScale(d.country) + heightScale.rangeBand()/2;
    })
    .append("title")
    .text(function(d) {
      return d.country + " in 2015: " + d.male["2015"] + "%";
    });

    // add the axes
    dotPlotSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + plotHeight + ")")
    .call(xAxis);

    dotPlotSvg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

    dotPlotSvg.append("text")
    .attr("class", "xlabel")
    .attr("transform", "translate(" + (margin.left + plotWidth / 2) + " ," +
    (plotHeight + margin.bottom) + ")")
    .style("text-anchor", "middle")
    .attr("dy", "12")
    .text("Percent");
}
