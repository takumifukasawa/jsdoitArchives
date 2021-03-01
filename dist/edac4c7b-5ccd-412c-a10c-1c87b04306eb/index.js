// forked from kimmy's "2015-08-12 1st" http://jsdo.it/kimmy/67QR
(function($, window, document, undefined) {
    
    "use strict";

    var MIN_NUM = 2,
        MAX_NUM = 12;
    
    var $counter= document.getElementById("console"),
        $prev = document.getElementById("btn-prev"),
        $next = document.getElementById("btn-next");
   
    /**
     * Iterator
     *
     * param -> int : minIndex
     * param -> max : maxIndex
     *
     */
    var Iterator = function(minIndex, maxIndex) {
      
        if(typeof(minIndex) !== 'number' || typeof(maxIndex) !== 'number') throw new Error("please input number");  
        
        var i = minIndex,
            minNum = minIndex,
            maxNum = maxIndex;
       
        var prev = function() {
            i = (i > minNum) ? --i : maxNum;
            $counter.innerText = i;
        };
        
        var next = function() {
            i = (i < maxNum) ? ++i : minNum;
            $counter.innerText = i;
        };
        
        var getIndex = function() {
            return i;
        };
        
        return {
            prev: prev,
            next: next,
            getIndex: getIndex
        };
    };

    var iterator = Iterator(MIN_NUM, MAX_NUM);
    
    $counter.innerText = iterator.getIndex();
            
    $prev.addEventListener("click", function() {
        iterator.prev();
    });
            
    $next.addEventListener("click", function() {
        iterator.next();
    });
    
})(jQuery, window, window.document, undefined);