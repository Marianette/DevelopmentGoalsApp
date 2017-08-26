// Adjust country selector
$(function() {
  $('#select-country').select2();
});

function highlightData(action){
  // Get value in select country search box
  var value = $("#select-country").val();
  if(action == null){
    clearSelections();
  } else {
    selectCountry(value, action);
  }
}

// React to change events on income dot plot filters
$(function(){
  // React to year change
  $("#income-select-year").on("change", function(){
    if(incomeCurrentYear != this.value){
      incomeCurrentYear = this.value;
      updateDotPlot();

      // Update bubble info
      d3.select("#country-text").html("Hover over data to view details");
      d3.select("#data-text").html("Data");
      d3.select("#year-text")
      .html("<b>Year</b> <br/>" + incomeCurrentYear);
    }
  });

  $("#income-filter-view input").on("change", function(){
    var value = $('input[name=view-select]:checked', '#income-filter-view').val();
    if(value != incomeDataDisplayed){
      incomeDataDisplayed = this.value;
      $('#dot-plot-title').html(getIncomePlotTitle);
      updateDotPlot();
    }
  });

  // React to data change
  $("#select-regions").on("change", function(){
    changeDataSet(this.value);
    updateDotPlot();
  });
});
