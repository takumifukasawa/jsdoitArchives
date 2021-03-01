$(function() {

    "use strict";
   
    function Counter() {    
        var i = 0;
        function up() {
            return ++i;        
        }        

        return {
            up : up
        };
    }
    
    var countA = new Counter();
    var countB = new Counter();
    var countC = new Counter();
    
    $(".unitA").on("click", ".btn", function() {       
        $(".unitA").find(".balloon").text(countA.up());
    });
    
    $(".unitB").on("click", ".btn", function() {        
        $(".unitB").find(".balloon").text(countB.up());
    });
    
    $(".unitC").on("click", ".btn", function() {        
        $(".unitC").find(".balloon").text(countC.up());
    });
});