'use strict';

var w = 2048;
var h = 2048;

var canvas = document.getElementById('canvas');
canvas.width = w;
canvas.height = h;

var ctx = canvas.getContext('2d');

var tick = function tick() {
    var color = 'red';
    ctx.fillRect(0, 0, w, h);
    requestAnimationFrame(tick);
};

requestAnimationFrame(tick);

