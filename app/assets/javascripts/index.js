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
