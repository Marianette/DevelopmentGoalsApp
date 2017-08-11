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
