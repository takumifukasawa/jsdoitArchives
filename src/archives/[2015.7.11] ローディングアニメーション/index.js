var $circles = $(".spinner__item");

var baseDelayTime = 0.15;
var delayTime;

$circles.each(function(i) {
    delayTime = (baseDelayTime * i) + "s";
    $(this).css("animation-delay", delayTime)
        .css("animation-name", "loading");
});