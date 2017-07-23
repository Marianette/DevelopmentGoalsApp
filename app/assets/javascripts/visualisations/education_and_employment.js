// Variables for filters
var selectedDataset, selectedFilter, yearArrays, currentYearIndex;

// Colour thresholds
var eduColScale, compColScale, employColScale, diffColScale;

// Interaction Variables
var mapContainer, centered, mapTimer;

function initEducationEmploymentVis(id) {
  // Get education and employment data
  var data = $(id).data("data-attr");

  // Reset data values
  selectedDataset = "education";
  selectedFilter = "female";
  centered = null;

  // Reset any animations that may be running
  clearInterval(mapTimer);
  mapTimer = null;

  // Create map
  var width = $(".map-vis-container").width();
  var height = 540;
  var xoffset = 45;
  var yoffset = 45;

  var centerX = width/2 - xoffset;
  var centerY = height/2 + yoffset;

  // define projection with parameters
  var projection = d3.geo.naturalEarth()
  .scale(210)
  .translate([centerX, centerY])
  .precision(.1);

  // create path generator function
  var path = d3.geo.path()
  .projection(projection);

  var svg = d3.select(id).append("svg")
  .attr("width", width)
  .attr("height", height);

  mapContainer = svg.append("g");

  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Setup colours for choropleth. Colours selected from http://colorbrewer2.org/
  percentDomain = [10, 20, 30, 40, 50, 60, 70, 80, 90, 101];
  diffDomain = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

  eduColScale = d3.scale.threshold()
  .domain(percentDomain)
  .range(['#8e0152','#c51b7d','#de77ae','#f1b6da','#fde0ef','#e6f5d0','#b8e186','#7fbc41','#4d9221','#276419']);

  employColScale = d3.scale.threshold()
  .domain(percentDomain)
  .range(['#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b']);

  diffColScale = d3.scale.threshold()
  .domain(diffDomain)
  .range(['#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac']);

  compColScale = d3.scale.threshold()
  .domain(diffDomain)
  .range(['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4']);

  // Set up animation
  d3.select('#play-map-btn')
  .on('click', function (d) {
    startAnimation(d);
  });

  d3.select('#stop-map-btn')
  .on('click', function (d) {
    stopAnimation(d);
  });

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
        if(countryYearData == null && country.properties.education.male != null && country.properties.employment.male != null) {
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
    mapContainer.selectAll(".country")
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
      clicked(d, centerX, centerY, path);
    });

    mapContainer.append("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "mesh")
    .attr("d", path);
  }
}

function getColour(d) {
  // Check if data exists for current country
  var countryData = _.get(d.properties, [selectedDataset, selectedFilter, getCurrentYear()], null);
  if (countryData == null) return "#F5F5F5";

  // Use relevant colour scale
  var colours = eduColScale;
  if(selectedDataset == "employment") colours = employColScale;
  if(selectedDataset == "comparison") colours = compColScale;
  if(selectedFilter == "diff") colours = diffColScale;
  return colours(countryData);
}

function showTooltip(d, toolTip) {
  toolTip.transition()
  .duration(200)
  .style("opacity", .9);

  toolTip.html(getMessage(d))
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 28) + "px");

  mapContainer.select("#code_" + d.properties.id)
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

  mapContainer.select("#" + getId(d))
  .transition()
  .duration(200)
  .style("opacity", 0.85)
  .style("stroke", "white")
  .style("stroke-width", "0.6px");
}

function clicked(d, centerX, centerY, path){
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
  mapContainer.selectAll("path")
  .classed("active", centered && function(d) { return d === centered; });
  mapContainer.transition()
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

function applyFilter(){
  updateYearViews();
  updateMapTitleAndInfo(selectedDataset, selectedFilter);
  d3.selectAll('.country').transition()
  .duration(750)
  .style("fill", getColour);
}

function startAnimation(d) {
  var numYears = yearArrays[selectedDataset].length - 1;

  // Reset animation if current year is most recent
  if (currentYearIndex == numYears) currentYearIndex = 0;

  // Use Javascript setInterval() method to establish pauses between transitions
  mapTimer = setInterval(function(){
    // Increment year
    currentYearIndex += 1;
    // If reached further, stop animation
    if (currentYearIndex > numYears) {
      currentYearIndex = numYears;
      stopAnimation(d);
      return;
    }

    d3.selectAll('.country').transition()
    .duration(750)
    .style("fill", getColour);
    updateYearViews();
  }, 2000);
}

function stopAnimation(d){
  clearInterval(mapTimer);
}

function snapToValidYear(newYear){
  var years = yearArrays[selectedDataset];
  var newIndex = years.indexOf(newYear)
  if (newIndex != -1) {
    return newIndex;
  }

  // Selected year is not in data set, snap to closest year values
  var closestYear = years.reduce(function (prev, curr) {
    return (Math.abs(curr - newYear) < Math.abs(prev - newYear) ? curr : prev);
  });
  return years.indexOf(closestYear);
}

function updateYearViews(){
  var years = yearArrays[selectedDataset];
  $('#years-selector').val(years[currentYearIndex]);
  $('#map-year-label').text(years[currentYearIndex]);
}
