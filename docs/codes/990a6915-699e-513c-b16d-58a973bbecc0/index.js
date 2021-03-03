// forked from takumifukasawa's "pixijs canvas texture" http://jsdo.it/takumifukasawa/OB2d

'use strict';

var width = undefined,
    height = undefined;
var bgSprite = undefined;

var ratio = window.devicePixelRatio || 1;

var wrapper = document.querySelector('.wrapper');
var canvas = document.querySelector('.canvas');
var canvas2D = document.querySelector('.canvas2d');
var ctx2D = canvas2D.getContext('2d');

var renderer = new PIXI.autoDetectRenderer(1, 1, {
    view: canvas,
    antialias: true,
    transparent: true,
    resolution: ratio
});

var container = new PIXI.Container();

var bgImage = new Image();
bgImage.onload = function () {
    start();
};
bgImage.src = 'common/img/photo-1467521335787-2f0fc0f0e9a0.jpeg';

function onWindowResize() {
    wrapper.style.width = '';
    wrapper.style.height = '';
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    canvas2D.width = width * ratio;
    canvas2D.height = height * ratio;

    renderer.resize(width, height);
}

function update(time) {}

function render(time) {
    ctx2D.clearRect(0, 0, width, height);
    ctx2D.drawImage(bgImage, Math.sin(time) * 100, 0);
    bgSprite.texture.update();
    renderer.render(container);
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
    bgSprite = new PIXI.Sprite(new PIXI.Texture.fromCanvas(canvas2D));
    container.addChild(bgSprite);
    requestAnimationFrame(tick);
}

