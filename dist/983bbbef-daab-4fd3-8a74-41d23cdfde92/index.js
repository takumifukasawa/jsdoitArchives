// forked from takumifukasawa's "simple random walk" http://jsdo.it/takumifukasawa/cnHx

//------------------------------------------------------
// パラメーター周り
//------------------------------------------------------

'use strict';

var CELL_SIZE = 2;
var MOVE_DISTANCE = 4;

var CELL_COLOR = 'rgba(255, 255, 255, .1)';

function random() {
    var randCount = 6;
    var rand = 0;
    for (var i = 0; i < randCount; i++) {
        rand += Math.random() - .5;
    }
    return rand / randCount;
}

function updateCell() {
    var deltaX = MOVE_DISTANCE * random();
    var deltaY = MOVE_DISTANCE * random();

    cellX += deltaX;
    cellY += deltaY;
}

//------------------------------------------------------
// canvas作ったり
//------------------------------------------------------

var cellX = undefined,
    cellY = 0;

var width = undefined,
    height = 0;
var currentTime = 0;
var elapsedTime = 0;

var wrapper = document.querySelector('.wrapper');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

wrapper.appendChild(canvas);

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    resetCell();
    clearAllCanvas();
}

function onClickCanvas() {
    resetCell();
    clearAllCanvas();
}

function resetCell() {
    cellX = width / 2;
    cellY = height / 2;
}

function clearAllCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, .95)';
    ctx.fillRect(0, 0, width, height);
}

function tick(time) {
    elapsedTime = time - currentTime;

    updateCell();

    ctx.fillStyle = CELL_COLOR;
    ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);

    currentTime = time;
    requestAnimationFrame(tick);
}

onWindowResize();
window.addEventListener('resize', onWindowResize);
canvas.addEventListener('click', onClickCanvas);
requestAnimationFrame(tick);

