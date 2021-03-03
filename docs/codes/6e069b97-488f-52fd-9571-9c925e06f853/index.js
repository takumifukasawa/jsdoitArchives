// forked from takumifukasawa's "forked: カントナ #3-2" http://jsdo.it/takumifukasawa/cRzg
// forked from takumifukasawa's "カントナ #3-2" http://jsdo.it/takumifukasawa/q87m
// forked from takumifukasawa's "カントナ #1" http://jsdo.it/takumifukasawa/k3Es


    // updateとrenderは切り離す
    // renderは何回連続で書いておいてもいいようにする

var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//var canvas = myCanvas;
var ctx = canvas.getContext("2d");

var image = new Image();
image.src = "/jsdoitArchives/assets/img/photo-1471898988302-3d79dfaad25d.jpeg";

var start = function() {
    var startTime = Date.now();
    //startTime = +new Date();
    var previousTime = 0;
    
    /*
    var _update = function() {
        var time = Date.now() - startTime;
        var elapsedTime = time - previousTime;
        console.log(elapsedTime);
        update(time, elapsedTime);
        previousTime = time;
        setTimeout(_update, 1000/60);
    };
    */
    
    // 
    var _update = function() {
        var time = Date.now() - startTime;
        
        // TimeBuffer
        // TimeAccumulator
        while(previousTime < time) {
            update(previousTime);
            previousTime += 1000/60;
            //console.log("update");
        }
        render();
        requestAnimationFrame(_update);
    };

    _update();
};

var x = 0;
var y = 0;

// 経過時間（FPS）に差があっても、同じ速度で動く
var update = function(time, elapsedTime) {
    x = time * 60 / 1000;
    y = y - 1;
};

/*
// 経過時間（FPS）に差があっても、同じ速度で動く
var update = function(time, elapsedTime) {
    x = time * 60 / 1000;
    y = y - elapsedTime / 16.6666;
};
*/

var render = function() {      
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.save();
        ctx.translate(image.naturalWidth/2, image.naturalHeight/2);
        ctx.rotate(Math.PI/3.5);
        ctx.translate(-image.naturalWidth/2, -image.naturalHeight/2);
    
        ctx.drawImage(
            image,
            x, 0
        );
    ctx.restore();
    x += 1;
};

if(image.complete) {
    start();
} else {
    image.onload = start();
}

