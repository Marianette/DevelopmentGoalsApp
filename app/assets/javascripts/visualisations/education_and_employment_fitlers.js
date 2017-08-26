// React to change events on map filters
$(function(){
  // React to indicator selection change
  $("#select-map-dataset").on("change", function(){
    if(this.value != selectedDataset) {
      selectedDataset = this.value;
      // disable irrelevant filter options
      if (selectedDataset == "comparison") {
        $("#map-gender-parity").attr("disabled", true);
        $("#gender-parity").attr("id", "disabled-label");
        // ensure that unavailable filter is not being applied to dataset
        if(selectedFilter == "diff") {
          selectedFilter = "female";
          $("#map-female").prop("checked", true);
        }
      } else {
        $("#map-gender-parity").attr("disabled", false);
        $("#disabled-label").attr("id", "gender-parity");
      }
      // if changing data set, choose most recent year for new data set (or current if year exists in data set)
      var curYear = $("#years-selector").val();
      var idx = yearArrays[selectedDataset].indexOf(curYear);
      currentYearIndex = (idx == -1)? yearArrays[selectedDataset].length - 1: idx;

      // Need to change slider values
      var years = yearArrays[selectedDataset];
      var minyear = d3.min(years);
      var maxyear = d3.max(years);
      $('#years-selector').attr("min", minyear);
      $('#years-selector').attr("max", maxyear);
      $('#min-year').text(minyear);
      $('#max-year').text(maxyear);
      updateLegend();
      applyFilter();
    }
  });

  // React to data selection change
  $("#map-gender-filter-selection input").on("change", function(){
    var value = $('input[name=gender-select]:checked', '#map-gender-filter-selection').val();
    if(value != selectedFilter){
      selectedFilter = value;
      updateLegend();
      applyFilter();
    }
  });

  // React to year slider change
  $("#year-slider").on("change", function(){
    var newYear = $("#years-selector").val();
    currentYearIndex = getValidYear(newYear);
    applyFilter();
  });
});
