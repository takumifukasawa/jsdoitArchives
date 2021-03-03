'use strict';

var width = undefined,
    height = undefined;

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
bgImage.src = '/jsdoitArchives/assets/img/photo-1471539491521-29b5b92d0e47.jpeg';

function onWindowResize() {
    wrapper.style.width = '';
    wrapper.style.height = '';
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    canvas2D.width = width;
    canvas2D.height = height;

    renderer.resize(width, height);
}

function update() {}

function render() {
    ctx2D.clearRect(0, 0, width, height);
    ctx2D.drawImage(bgImage, 0, 0);
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
    var bgSprite = new PIXI.Sprite(new PIXI.Texture.fromCanvas(canvas2D));
    container.addChild(bgSprite);
    requestAnimationFrame(tick);
}

