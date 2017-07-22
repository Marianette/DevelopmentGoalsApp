// Variables for filters
var selectedDataset, selectedFilter, yearArrays, currentYearIndex;

// Interaction Variables
var container, centered, eduColScale, compColScale, employColScale;

function initEducationEmploymentVis(id) {
  // Get education and employment data
  var data = $(id).data("data-attr");

  // Reset data values
  selectedDataset = "education";
  selectedFilter = "female";
  centered = null;

  // Create map
  var width = 960
  var height = 500
  var xoffset = 45;
  var yoffset = 45;

  var centerX = width/2 - xoffset;
  var centerY = height/2 + yoffset;

  // define projection with parameters
  var projection = d3.geo.naturalEarth()
  .scale(185)
  .translate([centerX, centerY])
  .precision(.1);

  // create path generator function
  var path = d3.geo.path()
  .projection(projection);

  var svg = d3.select(id).append("svg")
  .attr("width", width)
  .attr("height", height);

  container = svg.append("g");

  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Setup colours for choropleth. Colours selected from http://colorbrewer2.org/
  eduColScale = d3.scale.threshold()
  .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 101])
  .range(['#8e0152','#c51b7d','#de77ae','#f1b6da','#fde0ef','#e6f5d0','#b8e186','#7fbc41','#4d9221','#276419']);

  employColScale = d3.scale.threshold()
  .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 101])
  .range(['#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b']);

  compColScale = d3.scale.threshold()
  .domain([20, 40, 80, 100])
  .range(['#a6611a','#dfc27d','#80cdc1','#018571']);

  // Load in world map data
  queue()
  .defer(d3.json, "../world-topo.json")
  .await(ready);

  function ready(error, world) {
    var mapObjects = world.objects.countries.geometries;
    var countryYearData = null;
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

        // Choose a country to determine year arrays values
        if(countryYearData == null && country.properties.education.male != null
          && country.properties.employment.male != null) {
            countryYearData = country.properties;
          }
        }
      }

    // Create year array
    yearArrays = {"education" : [], "employment": [], "comparison": []};
    yearArrays.education = Object.keys(countryYearData.education.male);
    yearArrays.employment = Object.keys(countryYearData.employment.male);
    yearArrays.comparison = Object.keys(countryYearData.comparison.male);
    currentYearIndex = yearArrays[selectedDataset].length - 1;

    // Draw choropleth map
    container.selectAll(".country")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "country")
    .attr("id", getId)
    .style("stroke", "white")
    .style("stroke-width", "0.6px")
    .style("vector-effect", "non-scaling-stroke")
    .style("fill", getColour)
    .style("opacity", 0.85)
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

function getColour(d) {
  var colours = eduColScale;
  if(selectedDataset == "employment") colours = employColScale;
  if(selectedDataset == "comparison") colours = compColScale;
  return colours(_.get(d.properties, [selectedDataset, selectedFilter, getCurrentYear()]));
}

function showTooltip(d, toolTip) {
  toolTip.transition()
  .duration(200)
  .style("opacity", .9);

  toolTip.html(getMessage(d))
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 28) + "px");

  container.select("#code_" + d.properties.id)
  .transition()
  .duration(200)
  .style("opacity", 1)
  .style("stroke", "black")
  .style("stroke-width", "0.9px");
}

function hideTooltip(d, toolTip) {
  toolTip.transition()
  .duration(500)
  .style("opacity", 0);

  container.select("#" + getId(d))
  .transition()
  .duration(200)
  .style("opacity", 0.85)
  .style("stroke", "white")
  .style("stroke-width", "0.6px");
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

function getCurrentYear(){
  return yearArrays[selectedDataset][currentYearIndex];
}

function getId(d){
  return "code_" + d.properties.id;
}

function getMessage(d){
  var value = _.get(d.properties, [selectedDataset, selectedFilter, getCurrentYear()], "No Data");
  if (value != "No Data") value = value + "%";
  var name = d.properties.admin;
  return name + "</br>" + value;
}

// React to change events on filters
$(function(){
  $("#select-map-dataset").on("change", function(){
    if(this.value != selectedDataset) {
      selectedDataset = this.value;
      // disable irrelevant filter options
      if (selectedDataset == "comparison") {
        $("#map-gender-parity").attr("disabled", true);
        // ensure that unavailable filter is not being applied to dataset
        if(selectedFilter == "diff") {
          selectedFilter = "female";
          $("#map-female").prop("checked", true);
        }
      } else {
        $("#map-gender-parity").attr("disabled", false);
      }
      // if changing data set, choose most recent year for new data setAnimataion
      currentYearIndex = yearArrays[selectedDataset].length - 1;
      applyFilter();
    }
  });

  $("#map-gender-filter-selection input").on("change", function(){
    var value = $('input[name=gender-select]:checked', '#map-gender-filter-selection').val();
    if(value != selectedFilter){
      selectedFilter = value;
      applyFilter();
    }
  });
});

function applyFilter(){
  updateMapTitleAndInfo(selectedDataset, selectedFilter);
  d3.selectAll('.country').transition()
  .duration(750)
  .style("fill", getColour);
}
