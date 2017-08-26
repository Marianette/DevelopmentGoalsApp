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
  // React to year change
  $("#select-year").on("change", function(){
    if(paraCoordsYear != this.value){
      paraCoordsYear = this.value;
      updateParaCoordsYear();
    }
  });
});
