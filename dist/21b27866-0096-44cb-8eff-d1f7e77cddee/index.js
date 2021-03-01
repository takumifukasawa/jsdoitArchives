$("#wrapper")
    .width($(window).width())
    .height($(window).height());

window.onload = function() {
    setTimeout(function() {
        $("#pic1").addClass("fadeout");
        $("#pic2").addClass("fadein");
    }, 500);
};