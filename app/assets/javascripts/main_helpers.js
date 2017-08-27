// Javascript to display and hide the help box when the 'Help' button in the
// corner of the visualisation pages is clicked.
$(function() {
  $('.main-help-label').on('click', function(){
    var hidden = $(".main-help-textbox").css("visibility");
    if (hidden == "hidden") {
      $(".main-help-textbox").css("visibility", "visible");
    } else {
    $(".main-help-textbox").css("visibility", "hidden");
    }
  });
});

// Show visualisation name on hover of icons on home page.
$(function() {
  $('.index-icons').on('mouseenter', function(){
    var id = "#" + this.id + "label";
    $(id).css("display", "block");
  });

  $('.index-icons').on('mouseleave', function(){
    var id = "#" + this.id + "label";
    $(id).css("display", "none");
  });
});

// Clear visualisations before leaving a page
function clearVis() {
  $('.content-container').remove();
}
