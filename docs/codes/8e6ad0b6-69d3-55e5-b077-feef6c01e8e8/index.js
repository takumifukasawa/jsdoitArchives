// forked from takumifukasawa's "canvas: 煙っぽいテクスチャ乗せる" http://jsdo.it/takumifukasawa/QBcp
// forked from takumifukasawa's "pixijs canvas texture（ratioも合わせる）" http://jsdo.it/takumifukasawa/yVUW
// forked from takumifukasawa's "pixijs canvas texture" http://jsdo.it/takumifukasawa/OB2d

'use strict';

var width = undefined,
    height = undefined;
var bgSprite = undefined;

var ratio = window.devicePixelRatio || 1;
//const ratio = 1;

var wrapper = document.querySelector('.wrapper');

var canvas = document.querySelector('.canvas');
var ctx = canvas.getContext('2d');

var canvasFilter = document.querySelector('.canvas-filter');
var ctxFilter = canvasFilter.getContext('2d');

var bgImage = new Image();
bgImage.src = '/jsdoitArchives/assets/img/photo-1414502622871-b90b0bec7b1f.jpeg';

var texImage = new Image();
texImage.onload = function () {
    start();
};
texImage.src = '/jsdoitArchives/assets/img/photo-1464468164664-850fcaf6be4a.png';

function onWindowResize() {
    wrapper.style.width = '';
    wrapper.style.height = '';

    width = wrapper.offsetWidth * ratio;
    height = wrapper.offsetHeight * ratio;

    canvas.width = width;
    canvas.height = height;

    canvasFilter.width = width;
    canvasFilter.height = height;
}

function clear() {
    ctx.clearRect(0, 0, width, height);
    ctxFilter.clearRect(0, 0, width, height);
}

function update(time) {}

function render(time) {
    if (!bgImage.complete) {
        return;
    }

    clear();

    ctx.save();
    ctx.fillStyle = '#0c194e';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.drawImage(bgImage, (width - bgImage.width) / 2, (height - bgImage.height) / 2);

    ctxFilter.drawImage(canvas, 0, 0);

    ctxFilter.save();
    ctxFilter.globalAlpha = .3;
    ctxFilter.globalCompositeOperation = 'source-over';
    ctxFilter.drawImage(texImage, 0, 0);
    ctxFilter.restore();
}

function tick(time) {
    var currentTime = time / 1000;
    update(currentTime);
    render(currentTime);
    requestAnimationFrame(tick);
}

function start() {
    onWindowResize();
    window.addEventListener('resize', onWindowResize);
    requestAnimationFrame(tick);
}

