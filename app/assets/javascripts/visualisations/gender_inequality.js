var paraCoordsYear, paraYears;

function createGiiVis(id){
  var dataurl = $(id).data('url');
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: dataurl,
    dataType: 'json',
    success: function (data) {
      initGiiVis(id, data);
      $(".loading-left").fadeOut("slow");
    },
    error: function (result) {
      console.log('Error');
    }
  });
}

function initGiiVis(id, data) {
  // Define height, width and margins of visualisation
  var margin = { top: 30, right: 10, bottom: 10, left: 0};
  var width = $(".gii-vis-container").width() - margin.right - margin.left;
  var height = 550 - margin.top - margin.bottom;

  // Define scale
  var xScale = d3.scale.ordinal().rangePoints([0, width], 1),
  colorScale = d3.scale.category10();
  yScale = {},
  dragging = {};

  var line = d3.svg.line();
  var axis = d3.svg.axis().orient("left");
  var background, foreground;

  // Set most recent year
  paraCoordsYear = d3.max(data, function(d) {
    return d.year;
  });
  paraYears = getGIIYears(data);

  // Svg for the parallel coordinates graph
  var paraSvg = d3.select(id).append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("id", "paraSvg");

  // Tooltip to display country labels
  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Define drag behaviour for dimensions
  var onDrag = d3.behavior.drag()
  .on("dragstart", function(d) {
    dragging[d] = this.__origin__ = xScale(d);
    background.attr("visibility", "hidden");
  })
  .on("drag", function(d) {
    dragging[d] = Math.min(width, Math.max(0, this.__origin__ += d3.event.dx));
    foreground.attr("d", path);
    dimensions.sort(function(a, b) { return position(a) - position(b); });
    xScale.domain(dimensions);
    g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
  })
  .on("dragend", function(d) {
    delete this.__origin__;
    delete dragging[d];
    transition(d3.select(this)).attr("transform", "translate(" + xScale(d) + ")");
    transition(foreground).attr("d", path);
    background.attr("d", path).transition()
    .delay(500).duration(0)
    .attr("visibility", null);
  });

  // Extract dimensions and create a scale for each
  xScale.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    return d != "year" && d != "region" && d != "code" && d != "country" &&
    (yScale[d] = d3.scale.linear()
    .domain(d3.extent(data, function(elem) { return +elem[d]; }))
    .range([height, 0]));
  }));

  // Coloured by region. Lines displayed in the foreground
  foreground = paraSvg.append("g")
  .attr("class", "foreground")
  .selectAll("path")
  .data(data)
  .enter().append("path")
  .attr("d", path)
  .attr("class", getElemClass)
  .style("stroke", function(d) { return colorScale(d.region); })
  .style("stroke-opacity", 0.7)
  .style("display", "none")
  .on("mouseover", function(d){
    // Make line darker and thicker
    d3.select(this)
    .style("stroke-opacity", 1)
    .style("stroke-width", "3px");

    showParaCoordsTooltip(d, toolTip);
  })
  .on("mousemove", function(d){
    moveParaCoordsTooltip(toolTip);
  })
  .on("mouseout", function(d){
    d3.select(this)
    .style("stroke-opacity", 0.7)
    .style("stroke-width", "1px");
    hideParaCoordsTooltip(toolTip);
  });

  // Add group for each data dimension
  var g = paraSvg.selectAll(".dimension")
  .data(dimensions)
  .enter().append("g")
  .attr("class", "dimension")
  .attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
  .call(onDrag);

  // Add axis labels
  g.append("g")
  .attr("class", "axis")
  .each(function(d) {
    d3.select(this).call(axis.scale(yScale[d]));
  })
  .append("text")
  .attr("text-anchor", "middle")
  .attr("y", -9)
  .text(String);

  // Create brush elements to allow dynamic filtering of each dimension
  // Code below adapted from: http://bl.ocks.org/ABSegler/9791707
  g.append("g")
  .attr("class", "brush")
  .each(function(d) {
    d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d])
    .on("brushstart", brushstart)
    .on("brush", brush));
  })
  .selectAll("rect")
  .attr("x", -8)
  .attr("width", 16);

  function position(d) {
    var v = dragging[d];
    return v == null ? xScale(d) : v;
  }

  // Returns the path for given data
  function path(d) {
    return line(dimensions.map(function(p) { return [position(p), yScale[p](d[p])]; }));
  }

  // Brush event - toggle foreground lines
  function brush() {
    var actives = dimensions.filter(function(p) { return !yScale[p].brush.empty(); }),
    extents = actives.map(function(p) { return yScale[p].brush.extent(); });
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }

  updateParaCoordsYear();
  createLegend(colorScale, data);
}
