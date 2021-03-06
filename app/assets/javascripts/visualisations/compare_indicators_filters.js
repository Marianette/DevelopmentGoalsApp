// React to an update graph request
function sendUpdateRequest(){
  var x = $("#select-compareX-dataset").val();
  var y = $("#select-compareY-dataset").val();
  var z = $("#select-compareZ-dataset").val();
  var dataurl = $("#compare-vis").data("url");
  dataurl = dataurl + "?x=" + x + "&y=" + y + "&z=" + z;

  // Show loading screen and make sure starter message is no longer displayed
  d3.select(".start-message").style("display", "none").remove();
  $(".loading-compare").fadeIn("slow");

  // Get new data
  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    url: dataurl,
    dataType: 'json',
    success: function (data) {
      updateBubbleGraph(data.data, data.xLabel, data.yLabel);
      $(".loading-compare").fadeOut("slow");
    },
    error: function (result) {
      console.log('Error');
    }
  });
}

// Initial generation of empty graph
function createComparisonVis(id) {
  createEmptyGraph(id);
  $(".loading-compare").fadeOut("slow");
}
