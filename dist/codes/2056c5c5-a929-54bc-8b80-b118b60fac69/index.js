(function($, window, document, undefined) {
    
    "use strict";

    $(".water").addClass("anime");

    $(".water").on("animationend webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationEnd", function() {
        alert("end");
    });
  
})(jQuery, window, window.document, undefined);
