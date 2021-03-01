var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var SIZE = 300;
var MAX = 360;

var count = 0;
var rad = 0;

function loop() {
  canvas.width = canvas.height = SIZE;

  count++;
  rad = count / MAX;
  if(rad > SIZE) {
    count = 0;
  }
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(
    SIZE/2, // 中心点X
    SIZE/2, // 中心点Y
    SIZE/2, // 半径
    0,
    Math.PI * 2 * rad
  );
  ctx.stroke();
}

setInterval(loop, 40);