// forked from takumifukasawa's "線形補間（lerp）でマウスに追尾する円" http://jsdo.it/takumifukasawa/IqWy
'use strict';

var width = 465;
var height = 465;

var centerX = width / 2;
var centerY = height / 2;

var circleX = centerX;
var circleY = centerY;

var mouseX = centerX;
var mouseY = centerY;

var canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function update() {
    var toX = centerX + (mouseX - centerX) / 4;
    var toY = centerY + (mouseY - centerY) / 4;

    circleX += (toX - circleX) * .1;
    circleY += (toY - circleY) * .1;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'red';
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleX, circleY, 100, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
    requestAnimationFrame(update);
}

canvas.addEventListener('mousemove', onMouseMove);
requestAnimationFrame(update);

