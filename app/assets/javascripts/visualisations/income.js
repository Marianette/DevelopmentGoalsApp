// Income dot plot variables
var incomeCurrentYear, incomeData, incomeDataDisplayed;
// Income dot plot svg variables
var plotWidth, plotHeight, dotPlotSvg, dotPlotWidthScale, dotPlotHeightScale,
dotPlotMargins, dotToolTip;

function initIncomeVis(id) {
  incomeData = $(id).data("attr");
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

  dotPlotSvg = d3.select(id).append("svg")
  .attr("width", fullPlotWidth)
  .attr("height", fullPlotHeight);

  // Create label for bottom value of y axis
  var label = (incomeDataDisplayed == "male")? "$0" : "0%";
  dotPlotSvg.append("text")
  .attr("class", "ylabel")
  .attr("transform", "translate(" + (dotPlotMargins.left/2) + "," + (plotHeight - dotPlotMargins.bottom/2) + ")")
  .style("text-anchor", "middle")
  .attr("dy", "12")
  .text(label);

  // TODO Create data circles

  // Create tooltip for on hover of dots
  dotToolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  drawIncomeVisualisation();
}

function drawIncomeVisualisation() {
  // Sort data
  incomeData.sort(function(a, b) {
    return d3.descending(a[incomeDataDisplayed][incomeCurrentYear], b[incomeDataDisplayed][incomeCurrentYear]);
  });

  var offset = (incomeDataDisplayed == "male")? 5000 : 10;
  var dataMax = incomeData[0][incomeDataDisplayed][incomeCurrentYear] + offset;

  // Redefine x and y scale for plot according to sorted data
  dotPlotHeightScale.domain([0, dataMax]);
  dotPlotWidthScale.domain(incomeData.map(function(d) { return d.country; } ));

  // Draw lines from y labels to highest dot
  var gridLines = dotPlotSvg.selectAll("lines.grid")
  .data(incomeData)
  .enter().append("line")
  .attr("class", "grid")
  .attr("id", getIncomeId)
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
  .attr("transform", "translate(0," + plotHeight + ")")
  .call(xAxis);
}

function createDots(id){
  var dots = dotPlotSvg.selectAll("circle." + id)
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

    hideDataInformation();
  })

  // Apply ease in effect
  dots.transition()
    .duration(750)
    .attr("r", dotPlotWidthScale.rangeBand()/2);
}

function updateDotPlot(){
  removeDotElements();

  // Wait for line transition to finish before calling draw again
  dotPlotSvg.selectAll(".grid")
  .transition()
  .duration(750)
  .attr("y2", plotHeight)
  .style("fill", "#fff")
  .remove()
  .call(endall, drawIncomeVisualisation);

  // Change y label text
  var label = (incomeDataDisplayed == "male")? "$0" : "0%";
  $('.ylabel').text(label);
}
