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
  // update three data circles = country, year, data
  // display country name under x axis
  // highlight line
}

function hideDataInformation(d){
  // unhighlight line
}

function getIncomeId(d){
  var name = d.country;
  name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
  return "code_" + name;
}

function getIncomeDotHoverMessage(d, dataset){
  if(dataset == "male"){
    return "Male GNI for " + d.country + ": $" + d[dataset][incomeCurrentYear];
  } else if (dataset == "female"){
    return "Female GNI for " + d.country + ": $" + d[dataset][incomeCurrentYear];
  }
  return "Female GNI  for " + d.country + " is </br> " + d[dataset][incomeCurrentYear] + "% less than the male GNI"
}

function getIncomePlotTitle(){
  if(incomeDataDisplayed == "male") return "Estimated Gross National Income (GNI) Male vs. Female";
  return "Percentage Difference Between Male GNI and Female GNI";
}
