$(function() {
  $(".dropdown-button").dropdown();
  $('select').material_select();
});

// Clear visualisations before leaving a page
function clearVis() {
  $('.content-container').remove();
}
