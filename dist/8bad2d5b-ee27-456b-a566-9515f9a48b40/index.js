// forked from kimmy's "BTN" http://jsdo.it/kimmy/md6b
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
    
    $(".btn").on("click", function() {
        countUp.increment();
        $balloon.text(countUp.get());
    });
    
});