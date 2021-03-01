window.onload = function() {
    
    var $window = $(window);
    winWidth = $window.width();
    winHeight = $window.height();
    
    $(".wrapper")
        .width(winWidth)
        .height(winHeight);
    
    $(".stamp").css({
        "top": (winWidth - $(".stamp").width()) / 2,
        "left": (winHeight - $(".stamp").height()) / 2
    });
    
    setTimeout(function() {
        $(".stamp").addClass("animate");
    }, 100);
};