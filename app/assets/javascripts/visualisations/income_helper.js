function getHighestPoint(d) {
  if(incomeDataDisplayed == "diff") return "diff";
  return (d.male[incomeCurrentYear] > d.female[incomeCurrentYear])? "male" : "female";
}

function removeDotElements(){
  var circles = ["male", "female", "diff"];
  for (var i in circles){
    dotPlotSvg.selectAll(".dot-plot-" + circles[i])
    .transition()
    .duration(750)
    .attr("r", 0)
    .style("fill", "#fff")
    .remove();
  }
}

function checkValidIncomeYear(newYear){
  var years = Object.keys(incomeData[0][incomeDataDisplayed]);
  if (years.indexOf(newYear) != -1) return newYear;

  // Selected year is not in data set, snap to closest year values
  var closestYear = years.reduce(function (prev, curr) {
    return (Math.abs(curr - newYear) < Math.abs(prev - newYear) ? curr : prev);
  });
  return closestYear;
}

function showDataInformation(d){
  // Show country name
  var textBox = d3.select("#country-text").html("<b>Country</b><br/>" + d.country);
  var margin = (d.country.length > 25)? "0px": null; // reduce margin size for long names
  textBox.style("margin", margin);
  // Show current year
  d3.select("#year-text")
  .html("<b>Year</b> <br/>" + incomeCurrentYear);
  // Give detailed data
  d3.select("#data-text")
  .html(getDataInfo(d));

  var left = dotPlotWidthScale(d.country) + dotPlotWidthScale.rangeBand()/2;
  var label = d3.select(".country-label")
  .html(d.country)
  .style("left", left + "px")
  .style("top", "460px");
  label.transition()
  .duration(100)
  .style("opacity", 1);

  // Highlight grid line
  d3.select("#" + getIncomeId(d)).classed("hover", true);
}

function hideDataInformation(d){
  // Un-highlight grid line
  d3.select("#" + getIncomeId(d)).classed("hover", false);
}

function getIncomeId(d){
  return "code_" + d.code;
}

function getIncomeDotHoverMessage(d, dataset){
  if(dataset == "male"){
    return "Male GNI: $" + d[dataset][incomeCurrentYear];
  } else if (dataset == "female"){
    return "Female GNI: $" + d[dataset][incomeCurrentYear];
  }
  return "Difference: " + d[dataset][incomeCurrentYear] + "%";
}

function getIncomePlotTitle(){
  if(incomeDataDisplayed == "male") return "Estimated Gross National Income (GNI) Male vs. Female";
  return "Percentage Difference Between Male GNI and Female GNI";
}

function getDataInfo(d){
  if(incomeDataDisplayed == "diff")
    return "Female GNI is " + d[incomeDataDisplayed][incomeCurrentYear] + "% less than male GNI";
  return "<b>Estimated GNI</b></br>Male: $" + d.male[incomeCurrentYear] + "</br>Female: $" + d.female[incomeCurrentYear];
}
