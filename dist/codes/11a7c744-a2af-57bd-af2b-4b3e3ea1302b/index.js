'use strict';

var circleX = 0;
var circleY = 0;

var mouseX = 0;
var mouseY = 0;

var width = 465;
var height = 465;

var canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function lerp(start, end, t) {
    return (1 - t) * start + t * end;
}

function update() {
    circleX = lerp(circleX, mouseX, 0.15);
    circleY = lerp(circleY, mouseY, 0.15);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'red';
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleX, circleY, 50, 0, Math.PI * 2, false);
    //ctx.closePath();
    ctx.fill();
    ctx.restore();
    requestAnimationFrame(update);
}

canvas.addEventListener('mousemove', onMouseMove);
requestAnimationFrame(update);

