(function($, window, document, undefined) {
    
    "use strict";
    
    var $circles = $(".circle");
    
    setInterval(function() {
        $circles.each(function(index) {
            var $el = $circles.eq(index);
            var pos = Number($el.attr("data-pos"));
            var switchPos = (pos > 2) ? 1 : pos+1;
            $el.removeClass("pos" + pos);
            $el.addClass("pos" + switchPos);
            $el.attr("data-pos", switchPos);
        });
    }, 2000);
    
})(jQuery, window, window.document, undefined);