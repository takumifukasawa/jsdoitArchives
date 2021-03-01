(function($) {

    "use strict";

    var $rect     = $(".rect"),
        $wrapper  = $(".wrapper"),
        isFadeout = false;
    
    
    $rect.on("animationend webkitAnimationEnd mozAnimationEnd", function() {
        if(!isFadeout) {
            $(this).removeClass("fadein-next");
            return;
        }
            
        $wrapper.toggleClass("bg");
        
        $(this).addClass("fadein-next");
        $(this).removeClass("fadeout-prev");
        isFadeout = false;
    });

    $rect.addClass("fadeout-prev");
    isFadeout = true;    
    
    setInterval(function() {
        $rect.addClass("fadeout-prev");
        isFadeout = true;
    }, 3000);
    
})(jQuery);
