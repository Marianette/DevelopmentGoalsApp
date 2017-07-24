$(function() {
  $('.button-collapse').sideNav();
  $('select').material_select();
});

// Other functions that need to be defined after the DOM is completely loaded

// React to change events on map filters
$(function(){
  // React to indicator selection change
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

      // Need to change slider values
      var years = yearArrays[selectedDataset];
      $('#years-selector').attr("min", d3.min(years));
      $('#years-selector').attr("max", d3.max(years));
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

// React to change events on income dot plot filters
$(function(){
  // React to year slider change
  $("#income-year-slider").on("change", function(){
    var newYear = $("#income-years-selector").val();
    newYear = checkValidIncomeYear(newYear);
    if(incomeCurrentYear != newYear){
      incomeCurrentYear = newYear;
      $('#income-years-selector').val(incomeCurrentYear);
      updateDotPlot();
    }
  });

  // React to data change
  $("#select-income-dataset").on("change", function(){
    if(this.value != incomeDataDisplayed) {
      incomeDataDisplayed = this.value;
      $('.dot-plot-title').text("Percentage Difference Between Male GNI and Female GNI");
      updateDotPlot();
    }
  });
});

// Clear visualisations before leaving a page
function clearVis() {
  $('.content-container').remove();
}
