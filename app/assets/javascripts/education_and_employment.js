// Variables for filters
var selectedDataset, selectedFilter, currentYear;

// Interaction Variables
var centered;

function initEducationEmploymentVis(id) {
  // Get education and employment data
  var data = $(id).data("data-attr");

  // Reset data values
  selectedDataset = "education";
  selectedFilter = "male";
  currentYear = 2015;
  centered = null;

  // Create map
  var width = 960
  var height = 500
  var xoffset = 60;
  var yoffset = 45;

  var centerX = width/2 - xoffset;
  var centerY = height/2 + yoffset;

  // define projection with parameters
  var projection = d3.geo.naturalEarth()
  .scale(180)
  .translate([centerX, centerY])
  .precision(.1);

  // create path generator function
  var path = d3.geo.path()
  .projection(projection);

  var svg = d3.select(id).append("svg")
  .attr("width", width)
  .attr("height", height);

  var container = svg.append("g");

  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Setup colours for choropleth
  var colourScale = d3.scale.threshold()
  .domain([10, 20, 30, 40, 50, 60, 70, 80, 101])
  .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);

  var comparisonColourScale = d3.scale.threshold()
  .domain([10, 20, 30, 40, 50, 60, 70, 80, 101])
  .range(["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]);

  // Load in world map data
  queue()
  .defer(d3.json, "../world-topo.json")
  .await(ready);

  function ready(error, world) {
    var mapObjects = world.objects.countries.geometries;
    // For each map object, link relevant education and employment data to it
    for (var countryIndex in mapObjects) {
      var country = mapObjects[countryIndex];
      var currentCountry = data[country.properties.admin];
      // if country exists in data, add data properities to country object
      if(currentCountry != null) {
        country.properties.region = currentCountry.region;
        country.properties.education = currentCountry.education;
        country.properties.employment = currentCountry.employment;
        country.properties.comparison = currentCountry.comparison;
      }
    }

    // Draw choropleth map
    container.selectAll(".country")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "country")
    .attr("id", function (d) { return "code_" + d.properties.id; })
    .style("stroke", "white")
    .style("stroke-width", "0.6px")
    .style("vector-effect", "non-scaling-stroke")
    .style("fill", function (d,i) {
      var colours = (selectedDataset == "comparison")? comparisonColourScale : colourScale;
      return determineColour(d, colours);
    })
    // Add interations with mouse click/hover events
    .on("mouseover", function(d) {
      showTooltip(d, toolTip);
    })
    .on("mouseout", function(d) {
      hideTooltip(d, toolTip);
    })
    .on("click", function(d){
      clicked(d, centerX, centerY, container, path);
    });

    container.append("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "mesh")
    .attr("d", path);
  }
}

function determineColour(d, colourScale) {
  if (_.get(d.properties, [selectedDataset, selectedFilter, 2015])) {
    return colourScale(d.properties[selectedDataset][selectedFilter][2015]);
  }
  return "#000";
}

function showTooltip(d, toolTip) {
  toolTip.transition()
  .duration(200)
  .style("opacity", .9);

  var msg = _.get(d.properties, [selectedDataset, selectedFilter, 2015], "No Data");
  toolTip.html(d.properties.id + "<br/>" + msg)
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 28) + "px");
}

function hideTooltip(d, toolTip) {
  toolTip.transition()
  .duration(500)
  .style("opacity", 0);
}

function clicked(d, centerX, centerY, container, path){
  var dx, dy, scale;
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    dx = centroid[0];
    dy = centroid[1];
    scale = 2.5;
    centered = d;
  } else {
    dx = centerX;
    dy = centerY;
    scale = 1;
    centered = null;
  }

  // Apply zoom into selected country transformation
  container.selectAll("path")
  .classed("active", centered && function(d) { return d === centered; });
  container.transition()
  .duration(750)
  .attr("transform", "translate(" + centerX + "," + centerY + ")scale(" + scale + ")translate(" + -dx + "," + -dy + ")");
}
