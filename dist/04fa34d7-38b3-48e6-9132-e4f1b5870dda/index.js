    

    var circle = document.getElementById("circle");


    var path = document.getElementById("my-path");
    var pathLength = path.getTotalLength();
    
    var nowPos = 0;

    anime();

    function anime() {
        
        if(nowPos > pathLength) {
            nowPos = 0;
        }
        
        var point = path.getPointAtLength(nowPos);
        circle.style.left = point.x-15 + "px";
        circle.style.top = point.y-15 + "px";
        nowPos++;
    
        setTimeout(function() { anime(); }, 1000/120);
    }
