function getElemClass(d) { return d.code + " " + d.year + " " + reduceString(d.region); }
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
