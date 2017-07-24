function getHighestPoint(d) {
  if(incomeDataDisplayed == "diff") return "diff";
  return (d.male[incomeCurrentYear] > d.female[incomeCurrentYear])? "male" : "female";
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
  });

  dots.transition()
    .duration(750)
    .attr("r", dotPlotWidthScale.rangeBand()/2);
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
