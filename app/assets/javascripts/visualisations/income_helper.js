function getHighestPoint(d) {
  if(incomeDataDisplayed == "diff") return "diff";
  return (d.male[incomeCurrentYear] > d.female[incomeCurrentYear])? "male" : "female";
}

function removeDotElements(){
  var circles = ["male", "female", "diff"];
  for (var i in circles){
    d3.select("#dotPlotSvg").selectAll(".dot-plot-" + circles[i])
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
  updateBubbleInformation(d);
  // Highlight grid line
  d3.select("#" + getIncomeId(d.code)).classed("hover", true);
}

function hideDataInformation(d){
  // Un-highlight grid line
  d3.select("#" + getIncomeId(d.code)).classed("hover", false);

  // Fade out country label after 3 seconds of inactivity
  d3.select(".country-label").transition()
  .duration(3000)
  .style("opacity", 0);
}

function updateBubbleInformation(d) {
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
  .style("top", ($(".income-vis-container").height() + 10) + "px");

  label.transition()
  .duration(100)
  .style("opacity", 1);
}

function selectCountry(code, selected){
  var id = "#" + getIncomeId(code);
  d3.select(id).classed("highlighted-country", selected);

  data = d3.select(id)[0][0].__data__;
  updateBubbleInformation(data);
}

function changeDataSet(change){
  incomeData = fullDataSet;
  if(change != "World") {
    incomeData = _.filter(fullDataSet, {region: change});
  }
}

function clearSelections(){
  d3.selectAll('.highlighted-country').classed("highlighted-country", false);
}

function getIncomeId(code){
  return "code_" + code;
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
  if(incomeDataDisplayed == "male") return "Estimated Gross National Income (GNI) Male vs. Female" +
    "<i class=\"material-icons helper-tooltip large-help\">" +
    "help_outline<span class=\"helpertext helper-right\" id=\"gni-left-help\">" +
    "Estimated GNI for males and females is derived from: </br>- ratio of female to male wage, " +
    "</br>- share of males and females in the labour force, </br>- total GNI for the country (in terms of 2011 purchasing power pairty)</span>" +
    "</i>";
  return "Percentage Difference Between Male GNI and Female GNI";
}

function getDataInfo(d){
  if(incomeDataDisplayed == "diff")
    return "Female GNI is " + d[incomeDataDisplayed][incomeCurrentYear] + "% less than male GNI";
  return "<b>Male GNI</b></br>$" + d.male[incomeCurrentYear] + "</br><b>Female GNI</b></br>$" + d.female[incomeCurrentYear];
}
