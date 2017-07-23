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
