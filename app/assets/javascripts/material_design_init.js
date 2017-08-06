$(function() {
  $(".dropdown-button").dropdown();
  $('select').material_select();
  $(".button-collapse").sideNav();
  $('.collapsible').collapsible();
});

// Clear visualisations before leaving a page
function clearVis() {
  $('.content-container').remove();
}
