// forked from takumifukasawa's "カントナ #3-2" http://jsdo.it/takumifukasawa/q87m
// forked from takumifukasawa's "カントナ #1" http://jsdo.it/takumifukasawa/k3Es
var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//var canvas = myCanvas;
var ctx = canvas.getContext("2d");

var image = new Image();
image.src = "/jsdoitArchives/assets/img/photo-1449942120512-7a6f1ea6b0c4.jpeg";

var run = function() {
    setInterval(function() {
        draw();
    }, 200);
};

var draw = function() {
      
    ctx.save();
        ctx.translate(image.naturalWidth/2, image.naturalHeight/2);
        ctx.rotate(Math.PI/3.5);
        ctx.translate(-image.naturalWidth/2, -image.naturalHeight/2);
    
        ctx.drawImage(
            image,
            0, 0
        );
    ctx.restore();

    /*
    ctx.save();
        ctx.fillStyle = "crimson";
        ctx.fillRect(100, 100, 100, 100);
        ctx.fill();
    ctx.restore();
    */
 
    
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    var getIndex = function(x, y) {
        return (y * canvas.width + x) * 4;
    }; 

    var i, r, g, b, a;
    
    for(var y=0, len=canvas.height; y<len; y++) {
        for(var x=0, xLen=canvas.width; x<xLen; x++) {
            i = getIndex(x, y);
            r = imageData.data[i];
            g = imageData.data[i+1];
            b = imageData.data[i+2];
            a = imageData.data[i+3];
            imageData.data[i] = 100;
            imageData.data[i+1] = g;
            imageData.data[i+2] = b;
            imageData.data[i+3] = Math.random()*255;
        }
    }
    
    /**
     * createImageData
     */
    //var imageData2 = ctx.createImageData(100, 100);
    ctx.putImageData(imageData, 0, 0);
    //ctx.drawImage(imageData, 
     
    //ctx.globalCompositeOperation = "destination-in";
    
    //ctx.fillStyle = "rgb(255, 100, 100)";
    //ctx.fillRect(60, 60, 200, 200);
};

if(image.complete) {
    run();
} else {
    image.onload = run();
}

