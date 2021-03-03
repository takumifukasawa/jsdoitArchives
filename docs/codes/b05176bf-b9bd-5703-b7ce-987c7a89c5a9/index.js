// forked from takumifukasawa's "2017-11-30 1st" http://jsdo.it/takumifukasawa/UliE
'use strict';

var width = undefined,
    height = undefined;

var fragmentShader = '\nprecision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nvoid main(void) {\n    vec2 center = vec2(0.);\n    vec2 p = vTextureCoord.xy * 2. - 1.;\n    float alpha = 1. - distance(center, vTextureCoord);\n    float len = 0.1 / length(p);\n\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    vec4 destColor = texColor;\n    \n    gl_FragColor = vec4(len, 0., 0., 1. * len);    \n    \n    if(gl_FragColor.a < .01) {\n        discard;\n    }\n}\n';

var wrapper = document.querySelector('.wrapper');
var canvas = document.querySelector('.canvas');

var renderer = new PIXI.WebGLRenderer({
    view: canvas,
    transparent: true,
    resolution: window.devicePixelRatio,
    antialias: true
});

var stage = new PIXI.Container();

var src = '/common/img/photo-1462903004115-f8e27d6a3985.png';
var texture = PIXI.Texture.fromImage(src);
texture.baseTexture.addListener('loaded', function () {
    var container = new PIXI.Container();
    container.width = 465;
    container.height = 465;
    var graphics = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 465, 465);
    container.addChild(graphics);
    /*
        const sprite = new PIXI.Sprite.fromImage(src);
        container.addChild(sprite);
        */
    stage.addChild(container);

    var filter = new PIXI.Filter(null, fragmentShader, {});
    container.filters = [filter];
});

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

