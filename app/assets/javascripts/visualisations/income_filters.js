// React to change events on income dot plot filters
$(function(){
  // React to year slider change
  $("#income-year-slider").on("change", function(){
    var newYear = $("#income-years-selector").val();
    newYear = checkValidIncomeYear(newYear);
    $('#income-years-selector').val(newYear);
    if(incomeCurrentYear != newYear){
      incomeCurrentYear = newYear;
      updateDotPlot();
    }
  });

  // React to data change
  $("#select-income-dataset").on("change", function(){
    if(this.value != incomeDataDisplayed) {
      incomeDataDisplayed = this.value;
      $('#dot-plot-title').text(getIncomePlotTitle);
      updateDotPlot();
    }
  });
});
