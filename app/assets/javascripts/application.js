//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require d3
//= require d3.geo.projection.v0.min
//= require queue.v1.min
//= require topojson.v1.min
//= require crossfilter
//= require dc
//= require materialize-sprockets
//= require education_and_employment
//= require explore

// Clear visualisations before leaving a page
function clearVis() {
  $('.content-container').remove();
}
