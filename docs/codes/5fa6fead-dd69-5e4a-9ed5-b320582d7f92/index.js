var canvas  = document.getElementById("myCanvas");
var ctx     = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = "#000";
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.quadraticCurveTo(0, 0, 100, 100);
ctx.bezierCurveTo(100, 100, 200, 100, 200, 20);
ctx.stroke();


ctx.fillStyle = "crimson";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Hoge Hoge.", 200, 200);

console.log(ctx.measureText("Hoge Hoge"));