// forked from takumifukasawa's "[2015.9.6] animationendの検知" http://jsdo.it/takumifukasawa/aJqQ
(function($) {

    "use strict";

    var $rect     = $(".rect"),
        $wrapper  = $(".wrapper"),
        isFadeout = false;
    
    
    $rect.on("animationend webkitanimationend mozanimationend", function() {
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
