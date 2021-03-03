// forked from takumifukasawa's "pixijs canvas texture + custom filter" http://jsdo.it/takumifukasawa/C6dP
// forked from takumifukasawa's "pixijs canvas texture + blur filter" http://jsdo.it/takumifukasawa/YC7J
// forked from takumifukasawa's "pixijs canvas texture" http://jsdo.it/takumifukasawa/OB2d

'use strict';

var width = 0;
var height = 0;
var water = undefined;
var bgSprite = undefined;
var uniforms = {};
var filter = undefined;

var matrix = new PIXI.Matrix();
matrix.scale(1, -0.8);
matrix.translate(0, 160);

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

var reflection = PIXI.RenderTexture.create(width, height);

var outputSprite = new PIXI.Sprite();

var bgTexture = PIXI.Texture.fromImage('assets/img/photo-1433208406127-d9e1a0a1f1aa.jpeg');

bgTexture.baseTexture.addListener('loaded', function () {
    bgSprite = new PIXI.Sprite(bgTexture);
    container.addChild(bgSprite);

    var paperMapTexture = new PIXI.Texture.fromImage('assets/img/photo-1455325528055-ad815afecebe.jpeg');

    paperMapTexture.baseTexture.addListener('loaded', function () {
        var displacementTexture = new PIXI.Texture.fromImage('assets/img/photo-1421749810611-438cc492b581.jpeg');

        displacementTexture.baseTexture.addListener('loaded', function () {
            var vertexShader = document.querySelector('#vertex-shader');
            var fragmentShader = document.querySelector('#fragment-shader');
            uniforms.paper_map = {
                type: 'sampler2D',
                value: paperMapTexture
            };
            uniforms.mapSampler = {
                type: 'sampler2D',
                value: displacementTexture
            }, uniforms.u_time = {
                type: 'f',
                value: 0
            }, uniforms.water_area = {
                type: 'f',
                value: 0.6
            }, uniforms.range = {
                type: 'f',
                value: .005
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
            //filter = new PIXI.Filter(vertexShader.textContent, fragmentShader.textContent, uniforms);
            bgSprite.filters = [filter];

            var displacementMap = PIXI.Sprite.fromImage('assets/img/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg');
            var displacementFilter = new PIXI.filters.DisplacementFilter(displacementMap);
            water = new PIXI.Sprite(reflection);
            water.filters = [displacementFilter];
            container.addChild(water);

            start();
        });
    });
});

function onWindowResize() {
    wrapper.style.width = '';
    wrapper.style.height = '';
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    reflection.resize(width, height * .3);

    filter.uniforms.u_resolution.x = width;
    filter.uniforms.u_resolution.y = height;

    renderer.resize(width, height);
}

function onMouseMove(e) {
    filter.uniforms.u_mouse.x = e.clientX;
    filter.uniforms.u_mouse.y = e.clientY;
}

function update(time) {
    filter.uniforms.u_time = time / 6;
    //console.log(filter);  
}

function render(time) {
    water.texture = reflection;
    renderer.render(container);tg;
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

