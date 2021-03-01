var range = "50px";
var clipValue;
var $clip = $("#clip");

$("#wrapper")
    .width(window.innerWidth)
    .height(window.innerHeight);

$(window).load(function() {

    $(".bg").css("display", "block");

    $clip.on("mousemove", function(e) {
        clipValue = "circle(" + range + " at " + e.clientX + "px " + e.clientY + "px)";
        $clip.css("clip-path", clipValue);
        $clip.css("-webkit-clip-path", clipValue);
    });
    
});
