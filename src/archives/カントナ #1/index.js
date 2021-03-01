var canvas = document.getElementById("myCanvas");
//var canvas = myCanvas;
var ctx = canvas.getContext("2d");
var image = document.getElementById("myImage");

ctx.beginPath();

ctx.moveTo(100, 100);
ctx.lineTo(200, 300);
ctx.lineTo(300, 200);

ctx.closePath();

ctx.strokeStyle = "#447282";
ctx.lineWidth = 5;


// つながった点（角）の描画方法
ctx.lineJoin = "round";


// 始点と終点の描画方法
// ctx.lineCap = "round";


ctx.stroke();

ctx.fillStyle = "#388338";
ctx.fill();

var drawImageFunc = function() {
    ctx.drawImage(
        image,
        0, 0,
        image.naturalWidth,
        image.naturalHeight,
        200, 200,
        100, 100
    );
};

// drawImageのjavascriptが読み込まれる前にdrawImageが呼ばれたら、描画されないので、
// image.completeで分岐をつけておく
if(image.complete) {
    drawImageFunc();
} else {
    image.onload = drawImageFunc();
}


setTimeout(function() {
    ctx.clearRect(
        0, 0,
        canvas.width, canvas.height
    );
}, 1000);



// imageにじつは生えている -> image.naturalWidth, image.Height
// drawImage(imag, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);