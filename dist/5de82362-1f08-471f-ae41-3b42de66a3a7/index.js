$(function() {

    "use strict";

    var $balloon = $(".balloon");
    var num = $balloon.text();

    var countUp = (function() {
        var i = num;
        return {
            increment: function() {
                i++;
            },
            get: function() {
                return i;
            }
        };
    })();
    
    for(var s=0, len=$balloon.length; s<len; s++) {
        $balloon.eq(s);
    }
        
    $(".btn").on("click", function() {
        countUp.increment();
        $balloon.text(countUp.get());
    });    

});