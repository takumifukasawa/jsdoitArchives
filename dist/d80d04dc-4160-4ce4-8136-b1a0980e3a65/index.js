var $circles = $(".spinner__item");

var baseDelayTime = 0.2;
var delayTime;

var num;

$circles.each(function(i) {
    
    if(i === 0 || i === 4) {
        num = 2;
    } else if(i === 1 || i === 3) {
        num = 1;
    } else {
        num = 0;
    }
    
    delayTime = (baseDelayTime * num) + "s";
    
    $(this).css("animation-delay", delayTime)
        .css("animation-name", "loading");
});