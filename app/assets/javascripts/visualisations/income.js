// Income dot plot variables
var incomeCurrentYear, incomeData, incomeDataDisplayed, fullDataSet;
// Income dot plot svg variables
var plotWidth, plotHeight, dotPlotWidthScale, dotPlotHeightScale, dotPlotMargins;

function createIncomeVis(id) {
  var dataurl = $(id).data('url');
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: dataurl,
    dataType: 'json',
    success: function (data) {
      initIncomeVis(id, data);
      $(".loading-income").fadeOut("slow");
    },
    error: function (result) {
      console.log('Error');
    }
  });
}

function initIncomeVis(id, data) {
  fullDataSet = data;
  incomeData = fullDataSet;
  incomeCurrentYear = 2015;
  incomeDataDisplayed = "male";

  var fullPlotWidth = $('.income-vis-container').width();
  var fullPlotHeight = 400;
  dotPlotMargins = {top: 20, right: 20, bottom: 20, left: 40};
  plotWidth = fullPlotWidth - dotPlotMargins.left - dotPlotMargins.right,
  plotHeight = fullPlotHeight - dotPlotMargins.top - dotPlotMargins.bottom;

  dotPlotWidthScale = d3.scale.ordinal()
  .rangeBands([dotPlotMargins.left, plotWidth], 0.2);

  dotPlotHeightScale = d3.scale.linear()
  .range([0, plotHeight]);

  var dotPlotSvg = d3.select(id).append("svg")
  .attr("id", "dotPlotSvg")
  .attr("width", fullPlotWidth)
  .attr("height", fullPlotHeight);

  // Create label for bottom value of y axis
  var label = (incomeDataDisplayed == "male")? "$0" : "0%";
  dotPlotSvg.append("text")
  .attr("class", "ylabel")
  .attr("id", 'bottom-y-label')
  .attr("transform", "translate(" + (dotPlotMargins.left/2) + "," + (plotHeight - dotPlotMargins.bottom/2) + ")")
  .style("text-anchor", "middle")
  .attr("dy", "12")
  .text(label);

  // Create label for top value of y axis
  dotPlotSvg.append("text")
  .attr("class", "ylabel")
  .attr("id", 'top-y-label')
  .attr("transform", "translate(" + (dotPlotMargins.left/1.6) + ", -2)")
  .style("text-anchor", "middle")
  .attr("dy", "12");

  // Create information circles
  createInformationCircles();

  // Create tooltip for on hover of dots
  d3.select("body").append("div")
  .attr("id", "dotToolTip")
  .attr("class", "tooltip")
  .style("opacity", 0);

  d3.select("body").append("div")
  .attr("class", "country-label")
  .style("opacity", 0);

  drawIncomeVisualisation();
}

function drawIncomeVisualisation() {
  // Sort data
  incomeData.sort(function(a, b) {
    return d3.descending(a[incomeDataDisplayed][incomeCurrentYear], b[incomeDataDisplayed][incomeCurrentYear]);
  });

  // Calculate max data value and adjust y label and height scale
  var dataMax = incomeData[0][incomeDataDisplayed][incomeCurrentYear];
  var offset = 0.05 * dataMax;

  // TODO delete these two lines for adjustable diff scale
  dataMax = (incomeDataDisplayed == "diff")? 100: dataMax;
  offset = (incomeDataDisplayed == "diff")? 0: offset;

  // Add top y label text
  var label = (incomeDataDisplayed == "male")? "$" + dataMax : dataMax + "%";
  $('#top-y-label').text(label);

  // Redefine x and y scale for plot according to sorted data
  dotPlotHeightScale.domain([0, dataMax + offset]);
  dotPlotWidthScale.domain(incomeData.map(function(d) { return d.country; } ));

  // Get dot plot svg
  var dotPlotSvg = d3.select("#dotPlotSvg");

  // Draw lines from y labels to highest dot
  var gridLines = dotPlotSvg.selectAll("lines.grid")
  .data(incomeData)
  .enter().append("line")
  .attr("class", "grid")
  .attr("id", function(d) { return getIncomeId(d.code); })
  .attr("x1", function(d) {
    return dotPlotWidthScale(d.country) + dotPlotWidthScale.rangeBand()/2;
  })
  .attr("y1", plotHeight)
  .attr("x2", function(d) {
    return dotPlotWidthScale(d.country) + dotPlotWidthScale.rangeBand()/2;
  })
  .attr("y2", plotHeight)
  .on("mouseover", function(d) {
    showDataInformation(d);
  })
  .on("mouseout", function(d) {
    hideDataInformation(d);
  })
  .on("click", function(d){
    var selected = d3.select(this).classed("selected");
    selectCountry(d.code, !selected);
  });

  gridLines.transition()
  .duration(750)
  .attr("y2", function(d) {
    var highest = getHighestPoint(d);
    return plotHeight - dotPlotHeightScale(d[highest][incomeCurrentYear]);
  });

  // Draw the dots on the plot
  if (incomeDataDisplayed == "male") createDots("female");
  createDots(incomeDataDisplayed);

  // Draw the x axis on top
  var xAxis = d3.svg.axis()
  .scale(dotPlotWidthScale)
  .orient("bottom")
  .innerTickSize([0])
  .outerTickSize([0]);

  dotPlotSvg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (plotHeight  + 1)+ ")")
  .call(xAxis);
}

function createDots(id){
  // Get tool tip for mouseover action on dots
  var dotToolTip = d3.select("#dotToolTip");

  var dots = d3.select("#dotPlotSvg").selectAll("circle." + id)
  .data(incomeData)
  .enter().append("circle")
  .attr("class", "dot-plot-" + id)
  .attr("cx", function(d) {
    return dotPlotWidthScale(d.country) + dotPlotWidthScale.rangeBand()/2;
  })
  .attr("r", 0)
  .attr("cy", function(d) {
    return plotHeight - dotPlotHeightScale(d[id][incomeCurrentYear]);
  })
  .on("mouseover", function(d) {
    dotToolTip.transition()
    .duration(200)
    .style("opacity", 0.9);
    dotToolTip.html(getIncomeDotHoverMessage(d, id))
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");

    showDataInformation(d);
  })
  .on("mouseout", function(d) {
    dotToolTip.transition()
    .duration(200)
    .style("opacity", 0);

    hideDataInformation(d);
  })

  // Apply ease in effect
  dots.transition()
    .duration(750)
    .attr("r", Math.min(12, dotPlotWidthScale.rangeBand()/2));
}

function createInformationCircles(){
  var radius = 65,
  x      = plotWidth - radius,
  y      = plotHeight/5.0,
  side   = 2 * radius * Math.cos(Math.PI / 4),
  dx     = radius - side / 2,
  padding = 25;

  var ids = ["data", "year", "country"];
  for(var i in ids) {
    var infoCircle = d3.select("#dotPlotSvg").append('g')
    .attr('transform', 'translate(' + [ dx, dx ] + ')');

    infoCircle.append('circle')
    .attr("class", "info-circle")
    .attr("id", ids[i] + "-circle")
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', radius);

    infoCircle.append('foreignObject')
    .attr('x', x - (side/2))
    .attr('y', y - (side/2))
    .attr('width', side)
    .attr('height', side)
    .append('xhtml:p')
    .text('')
    .attr("class", "info-text")
    .attr("id", ids[i] + "-text");

    // Update x for next circle
    x = x - 2*radius - padding;
  }

  // Add temp text
  d3.select("#country-text").html("Hover over data to view details");
  d3.select("#data-text").html("Data");
  d3.select("#year-text").html("Year");
}

function updateDotPlot(){
  removeDotElements();
  d3.select(".country-label").transition()
  .duration(400)
  .style("opacity", 0);

  // Wait for line transition to finish before calling draw again
  d3.select("#dotPlotSvg").selectAll(".grid")
  .transition()
  .duration(750)
  .attr("y2", plotHeight)
  .style("fill", "#fff")
  .remove()
  .call(endall, drawIncomeVisualisation);

  // Change y label text
  var label = (incomeDataDisplayed == "male")? "$0" : "0%";
  $('#bottom-y-label').text(label);
}
