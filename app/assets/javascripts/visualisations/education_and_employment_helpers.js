function getColour(d) {
  // Check if data exists for current country
  var countryData = _.get(d.properties, [selectedDataset, selectedFilter, getCurrentYear()], null);
  if (countryData == null) return "#D8D8D8";
  // Use relevant colour scale
  var colours = getColourScale();
  return colours(countryData);
}

function getColourScale(){
  var colours = eduColScale;
  if(selectedDataset == "employment") colours = employColScale;
  if(selectedDataset == "comparison") colours = compColScale;
  if(selectedFilter == "diff") {
    colours = (selectedDataset == "education")? eduDiffColScale: employDiffColScale;
  }
  return colours;
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

function getValidYear(newYear){
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

function setUpColours(){
  percentDomain = [10, 20, 30, 40, 50, 60, 70, 80, 90, 101];
  eduDiffDomain = [-15, -2, 2, 15, 100];
  employDiffDomain = [-10, -2, 5, 50, 100];
  compDomain = [-50, -10, 10, 25, 100];

  eduColScale = d3.scale.threshold()
  .domain(percentDomain)
  .range(colorbrewer.PiYG[10]);

  employColScale = d3.scale.threshold()
  .domain(percentDomain)
  .range(colorbrewer.PuOr[10]);

  compColScale = d3.scale.threshold()
  .domain(compDomain)
  .range(colorbrewer.RdYlBu[5]);

  eduDiffColScale = d3.scale.threshold()
  .domain(eduDiffDomain)
  .range(colorbrewer.RdBu[5]);

  employDiffColScale = d3.scale.threshold()
  .domain(employDiffDomain)
  .range(colorbrewer.RdBu[5]);
}

function updateLegend(){
  var lgWt = 20, lgHt = 20;
  var mapDomain = getMapDomain();
  var mapLegendLabels = getMapLegendLabels();

  var mapLegend = d3.selectAll(".map-legend");

  // Remove current legend if one exists
  if (mapLegend) mapLegend.transition().duration(350).style("opacity", 0).remove();

  // Create new legend
  mapLegend = d3.select("#mapSvg").selectAll("g.legend")
  .data(mapDomain)
  .enter().append("g")
  .attr("class", "map-legend");

  mapLegend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return ($("#mapSvg").height()) - (i*lgHt) - lgHt;})
  .attr("width", lgWt)
  .attr("height", lgHt)
  .style("fill", function(d, i) {
    var colours = getColourScale();
    return colours(d);
  })
  .style("opacity", 0.85);

  mapLegend.append("text")
  .attr("x", 50)
  .attr("y", function(d, i){ return ($("#mapSvg").height()) - (i*lgHt) - 4;})
  .text(function(d, i){ return mapLegendLabels[i]; });
}

function getMapLegendLabels(){
  if(selectedDataset == "comparison"){
    return ["Extremely Labour Force Favoured", "Labour Force Favoured", "Equal", "Education Favoured", "Extremely Education Favoured"];
  }
  if(selectedFilter == "diff") {
    return ["Extremely Female Favoured", "Female Favoured", "Equal", "Male Favoured", "Extremely Male Favoured"]
  }
  return ["< 10%", "10 - 20", "20 - 30", "30 - 40", "40 - 50", "50 - 60", "60 - 70", "70 - 80", "80 - 90", "> 90%"];
}

function getMapDomain(){
  var mapDomain = percentDomain.slice();
  mapDomain.unshift(0)
  if(selectedDataset == "comparison"){
    mapDomain = compDomain.slice();
    mapDomain.unshift(-100);
  } else if(selectedFilter == "diff") {
    mapDomain = (selectedDataset == "education")? eduDiffDomain.slice() : employDiffDomain.slice();
    mapDomain.unshift(-50);
  }
  mapDomain.pop();
  return mapDomain;
}

// Information updates for choropleth map page
function updateMapTitleAndInfo(dataset, filter){
  var title = '';
  var info = '';

  switch(dataset) {
    case "education": title = "Education";
    switch(filter) {
      case "female":
      info = "Percentage of female population (aged 25+) with at least some secondary education.";
      break;
      case "male":
      info = "Percentage of male population (aged 25+) with at least some secondary education.";
      break;
      default:
      info = "The % difference between the male population and the female population with at least some secondary education.";
    }
    break;
    case "employment": title = "Labour Force Rates";
    switch(filter) {
      case "female":
      info = "Percentage of female population (aged 15+) in the labor force.";
      break;
      case "male":
      info = "Percentage of male population (aged 15+) in the labor force.";
      break;
      default:
      info = "The % difference between the labour force participation rates of males and females.";
    }
    break;
    default: title = "Education vs. Employment";
    switch(filter) {
      case "female":
      info = "The % difference between the female population in the labour force and females with at least some secondary education.";
      break;
      default:
      info = "The % difference between the male population in the labour force and males with at least some secondary education.";
    }
  }
  // Add text updates
  $('#data-name').text(title);
  $('#data-info').text(info);
}
