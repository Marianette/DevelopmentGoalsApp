var basicdataurl = $('#basic').data('url');
var filtersdataurl = $('#filters').data('url');
var interactivedataurl = $('#interactive').data('url');

$.ajax({
  type: 'GET',
  contentType: 'application/json; charset=utf-8',
  url: basicdataurl,
  dataType: 'json',
  success: function (data) {
    bargraph(data);
  },
  error: function (result) {
    console.log('Error');
  }
});

$.ajax({
  type: 'GET',
  contentType: 'application/json; charset=utf-8',
  url: filtersdataurl,
  dataType: 'json',
  success: function (data) {
    scatterplot(data);
  },
  error: function (result) {
    console.log('Error');
  }
});

$.ajax({
  type: 'GET',
  contentType: 'application/json; charset=utf-8',
  url: interactivedataurl,
  dataType: 'json',
  success: function (data) {
    console.log("Not yet implemented");
    // Work through https://dc-js.github.io/dc.js/docs/stock.html tutorial for this page
  },
  error: function (result) {
    console.log('Error');
  }
});
