// forked from takumifukasawa's "pixijs canvas texture + blur filter" http://jsdo.it/takumifukasawa/YC7J
// forked from takumifukasawa's "pixijs canvas texture" http://jsdo.it/takumifukasawa/OB2d

'use strict';

var width = 0;
var height = 0;
var bgSprite = undefined;
var uniforms = {};
var filter = undefined;

//const ratio = window.devicePixelRatio || 1;
var ratio = 1;

var wrapper = document.querySelector('.wrapper');
var canvas = document.querySelector('.canvas');

var renderer = new PIXI.autoDetectRenderer(1, 1, {
    view: canvas,
    antialias: true,
    transparent: true,
    resolution: ratio
});

var container = new PIXI.Container();

var bgTexture = PIXI.Texture.fromImage('/jsdoitArchives/assets/img/photo-1461770354136-8f58567b617a.jpeg');

bgTexture.baseTexture.addListener('loaded', function () {
    bgSprite = new PIXI.Sprite(bgTexture);
    container.addChild(bgSprite);

    var paperMapTexture = new PIXI.Texture.fromImage('/jsdoitArchives/assets/img/photo-1475475690428-61534882b644.jpeg');

    paperMapTexture.baseTexture.addListener('loaded', function () {
        var fragmentShader = document.querySelector('#fragment-shader');
        uniforms.paper_map = {
            type: 'sampler2D',
            value: paperMapTexture
        };
        uniforms.u_time = {
            type: 'f',
            value: 0
        };
        uniforms.range = {
            type: 'f',
            value: .01
        }, uniforms.u_resolution = {
            type: 'v2',
            value: {
                x: width,
                y: height
            }
        };
        uniforms.u_mouse = {
            type: 'v2',
            value: {
                x: 0,
                y: 0
            }
        };

        filter = new PIXI.Filter('', fragmentShader.textContent, uniforms);
        container.filters = [filter];

        start();
    });
});

function onWindowResize() {
    wrapper.style.width = '';
    wrapper.style.height = '';
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    filter.uniforms.u_resolution.x = width;
    filter.uniforms.u_resolution.y = height;

    renderer.resize(width, height);
}

function onMouseMove(e) {
    filter.uniforms.u_mouse.x = e.clientX;
    filter.uniforms.u_mouse.y = e.clientY;
}

function update(time) {
    filter.uniforms.u_time = time / 4;
    //console.log(filter);  
}

function render(time) {
    renderer.render(container);
}

function tick(time) {
    var currentTime = time / 1000;
    update(currentTime);
    render(currentTime);
    requestAnimationFrame(tick);
}

function start() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    onWindowResize();
    requestAnimationFrame(tick);
}

