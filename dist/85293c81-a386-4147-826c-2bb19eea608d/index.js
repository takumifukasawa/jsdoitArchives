'use strict';

var width = undefined,
    height = undefined;

var fragmentShader = '\nprecision mediump float;\nvarying vec2 vTextureCoord;\nvoid main(void) {\n    vec2 p = vec2(vTextureCoord) * 2. - 1.;\n    vec2 center = vec2(.5);\n    float alpha = .5 - distance(center, vTextureCoord);\n    gl_FragColor = vec4(1., 0., 0., alpha);\n}\n';

var wrapper = document.querySelector('.wrapper');
var canvas = document.querySelector('.canvas');

var renderer = new PIXI.WebGLRenderer({
    view: canvas,
    transparent: true,
    resolution: window.devicePixelRatio,
    antialias: true
});

var stage = new PIXI.Container();

var container = new PIXI.Container();
container.width = 200;
container.height = 200;
var graphics = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 200, 200);
container.addChild(graphics);
stage.addChild(container);

var filter = new PIXI.Filter(null, fragmentShader, {});
container.filters = [filter];

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    renderer.resize(width, height);
};

var tick = function tick() {
    //renderer.gl.clearColor(0, 0, 0, 0);
    renderer.render(stage);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

