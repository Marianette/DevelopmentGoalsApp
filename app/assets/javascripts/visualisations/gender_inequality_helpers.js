function getElemClass(d) { return "dataLines code_" + d.code + " year_" + d.year + " region_" + reduceString(d.region); }
function reduceString(s) { return s.replace(/[^a-zA-Z0-9]/g, ""); }

function showParaCoordsTooltip(d, toolTip){
  toolTip.text(d.country);
  toolTip.style("opacity", 1);
}

function hideParaCoordsTooltip(toolTip){
  toolTip.style("opacity", 0);
}

function moveParaCoordsTooltip(toolTip){
  toolTip
  .style("top", (d3.event.pageY - 10) + "px")
  .style("left", (d3.event.pageX + 10) + "px");
}

// Make sure brushing doesn't start dragging action
function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

function transition(g) {
  return g.transition().duration(500);
}

function updateParaCoordsYear(year){
  d3.selectAll(".dataLines").transition()
  .duration(300)
  .style("display", "none");

  d3.selectAll(".year_" + year).transition()
  .duration(300)
  .style("display", "");
}

function createLegend(colorScale, data){
  var width = $(".gii-filter-container").width();
  var height = 200;
  var legendRectSize = 18;
  var legendSpacing = 4;

  var svg = d3.select("#region-filters").append("svg")
  .attr("width", width)
  .attr("height", height);

  var legend = svg.selectAll('.legend')
  .data(colorScale.domain())
  .enter().append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var vert = i * height * 1.5;
    return 'translate(0,' + vert + ')';
  });

  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', colorScale)
  .style('stroke', colorScale)
  .attr("class", "region-legend")
  .on('click', function (label) {
    // Get the element we clicked on and toggle it and react to data selection
    var selected = d3.select(this).classed("disabled");
    d3.select(this).classed("disabled", !selected);
    data.forEach (function (d) {
      if (d.region == label) {
        var display = selected? "" : "none";
        d3.selectAll(".year_" + paraCoordsYear).filter(" .region_" + reduceString(label)).style("display", display);
      }
    });
  });

  legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });
}
