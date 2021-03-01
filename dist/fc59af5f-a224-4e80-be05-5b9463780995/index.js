(function(window, document, undefined) {
    
    "use strict";
    
    window.App = window.App || {};
    
})(window, window.document, undefined);





(function($, window, document, ns, undefined) {
    
    "use strict";
    
    //////////////////////////////////////////
    // slider
    //////////////////////////////////////////
    
    var Slider = function() {        
        var $inputRange,
            inputRangeLength,
            $slider;
       
        var initialize = function() {
            $inputRange = document.querySelectorAll(".input-range");
            inputRangeLength = ($inputRange) ? $inputRange.length : 0;
        
            $slider = document.createElement("input");
            $slider.id =  "slider" + inputRangeLength;
            $slider.classList.add("input-range");
            $slider.type = "range";
 
            document.body.appendChild($slider);
        };
        initialize();
        
        var getValue = function() {
            return $slider.value / 100;
        };
        
        return {
            getValue: getValue
        };
    };
    
    ns.Slider = Slider;
    
})(jQuery, window, window.document, window.App, undefined);



(function($, window, document, ns, undefined) {
    
    "use strict";

    var slider = ns.Slider();
    setInterval(function() {
        console.log(slider.getValue());
    }, 1000);
    
    var slider2 = ns.Slider();
    setInterval(function() {
        console.log(slider2.getValue());
    }, 1000);    

    
    
    
})(jQuery, window, window.document, window.App, undefined);

