// Variables for filters
var selectedDataset, selectedFilter, yearArrays, currentYearIndex;
// Colour thresholds
var eduColScale, compColScale, employColScale, eduDiffColScale, employDiffColScale;
// Domains for colours
var percentDomain, eduDiffDomain, employDiffDomain, compDomain;
// Interaction Variables
var centered, mapTimer;

function createEducationEmploymentVis(id) {
  var dataurl = $(id).data('url');
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: dataurl,
    dataType: 'json',
    success: function (data) {
      initEducationEmploymentVis(id, data.data, data.world);
      $(".loading-left").fadeOut("slow");
    },
    error: function (result) {
      console.log('Error');
    }
  });
}

function initEducationEmploymentVis(id, data, world) {
  // Reset data values
  selectedDataset = "education";
  selectedFilter = "female";
  centered = null;

  // Reset any animations that may be running
  clearInterval(mapTimer);
  mapTimer = null;

  // Create map
  var width = $(".map-vis-container").width();
  var mapHeight = 560;
  var xoffset = 45;
  var yoffset = 45;

  var centerX = width/2 - xoffset;
  var centerY = mapHeight/2 + yoffset;

  // define projection with parameters
  var projection = d3.geo.naturalEarth()
  .scale(220)
  .translate([centerX, centerY])
  .precision(.1);

  // create path generator function
  var path = d3.geo.path()
  .projection(projection);

  var mapSvg = d3.select(id).append("svg")
  .attr("id",  "mapSvg")
  .attr("width", width)
  .attr("height", mapHeight);

  var mapContainer = mapSvg.append("g").attr("id", "mapContainer");

  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Set up colour thresholds
  setUpColours();

  // Set up animation
  d3.select('#play-map-btn')
  .on('click', function (d) {
    // guard against multiple clicks on play button by stopping old animation and starting a new one.
    stopAnimation(d);
    startAnimation(d);
  });

  d3.select('#stop-map-btn')
  .on('click', function (d) {
    stopAnimation(d);
  });

  // create map data object
  createMapData(data, world);

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

    // Add legend
    updateLegend();
}

function showTooltip(d, toolTip) {
  toolTip.transition()
  .duration(200)
  .style("opacity", 0.9);

  toolTip.html(getMessage(d))
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 28) + "px");

  d3.select("#mapContainer").select("#code_" + d.properties.id)
  .transition()
  .duration(200)
  .style("fill", "#000")
  .style("opacity", 0.5)
  .style("stroke", "white")
  .style("stroke-width", "1.5px");
}

function hideTooltip(d, toolTip) {
  toolTip.transition()
  .duration(300)
  .style("opacity", 0);

  d3.select("#mapContainer").select("#" + getId(d))
  .transition()
  .duration(200)
  .style("fill", getColour)
  .style("opacity", 1)
  .style("stroke", "white")
  .style("stroke-width", "0.6px");
}

function clicked(d, centerX, centerY, path){
  var dx, dy, scale;
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    dx = centroid[0];
    dy = centroid[1];
    scale = 2.8;
    centered = d;
  } else {
    dx = centerX;
    dy = centerY;
    scale = 1;
    centered = null;
  }

  // Apply zoom into selected country transformation
  d3.select("#mapContainer").selectAll("path")
  .classed("active", centered && function(d) { return d === centered; });
  d3.select("#mapContainer").transition()
  .duration(750)
  .attr("transform", "translate(" + centerX + "," + centerY + ")scale(" + scale + ")translate(" + -dx + "," + -dy + ")");
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
  currentYearIndex = (currentYearIndex == numYears)? 0: currentYearIndex + 1;

  // Change first year quickly, then pause for following years.
  d3.selectAll('.country').transition()
  .duration(750)
  .style("fill", getColour);
  updateYearViews();

  // Use Javascript setInterval() method to establish pauses between transitions
  mapTimer = setInterval(function(){
    currentYearIndex += 1;
    if (currentYearIndex > numYears) {   // If reached further than max year, stop animation
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

function createMapData(data, world) {
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
  // Create year array from map data
  yearArrays = {"education" : [], "employment": [], "comparison": []};
  yearArrays.education = Object.keys(countryYearData.education.male);
  yearArrays.employment = Object.keys(countryYearData.employment.male);
  yearArrays.comparison = Object.keys(countryYearData.comparison.male);
  currentYearIndex = yearArrays[selectedDataset].length - 1;
}
