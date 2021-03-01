// ここの値を変えれば解像度が変わる
'use strict';

var ratio = 1.5;

var width = 0;
var height = 0;

var wrapper = document.querySelector('.wrapper');

var canvas = document.querySelector('.canvas');
var ctx = canvas.getContext('2d');

wrapper.appendChild(canvas);

function onWindowResize() {
    var originalWidth = window.innerWidth;
    var originalHeight = window.innerHeight;

    width = originalWidth * ratio;
    height = originalHeight * ratio;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = originalWidth + 'px';
    canvas.style.height = originalHeight + 'px';
}

function tick() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(width / 2, height / 2, 150 * ratio, 0, Math.PI * 2 / 180, true);
    ctx.fill();

    requestAnimationFrame(tick);
}

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

