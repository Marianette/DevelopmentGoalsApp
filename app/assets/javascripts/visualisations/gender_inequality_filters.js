// Adjust country selector
$(function() {
  $('#paracoords-country').select2();
});

function highlightCountry(action){
  // Get value in select country search box
  var value = $("#paracoords-country").val();
  if(action == null){
    clearParaCoordsSelections();
  } else {
    selectParaCoordsCountry(value, action);
  }
}

// React to change events on parallel coordinates filters
$(function(){
  // React to year slider change
  $("#gii-year-slider").on("change", function(){
    var newYear = $("#gii-years-selector").val();
    newYear = checkValidGIIYear(newYear);
    $('#gii-years-selector').val(newYear);
    if(paraCoordsYear != newYear){
      paraCoordsYear = newYear;
      updateParaCoordsYear();
    }
  });
});
