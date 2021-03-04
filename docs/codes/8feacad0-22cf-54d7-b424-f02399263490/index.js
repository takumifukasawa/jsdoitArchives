// forked from takumifukasawa's "にじませるshader" http://jsdo.it/takumifukasawa/s9bS
// forked from takumifukasawa's "pixijs: rendertexture" http://jsdo.it/takumifukasawa/Y0n1
// forked from takumifukasawa's "pixijs canvas texture + custom filter" http://jsdo.it/takumifukasawa/C6dP
// forked from takumifukasawa's "pixijs canvas texture + blur filter" http://jsdo.it/takumifukasawa/YC7J
// forked from takumifukasawa's "pixijs canvas texture" http://jsdo.it/takumifukasawa/OB2d

'use strict';

var width = 0;
var height = 0;
var bgSprite = undefined;
var bgFilter = undefined,
    outputFilter = undefined;
var isFirstRender = true;

//const ratio = window.devicePixelRatio || 1;
var ratio = 1;

var app = new PIXI.Application({
    antialias: true,
    transparent: true,
    resolution: ratio
});

var wrapper = document.querySelector('.wrapper');
var canvas = app.view;

canvas.classList.add('canvas');
wrapper.appendChild(canvas);

/*
const renderer = new PIXI.autoDetectRenderer(1, 1, {
    view: canvas,
    antialias: true,
    transparent: true,
    resolution: ratio
});
*/

onWindowResize();

var renderTexture = PIXI.RenderTexture.create(width, height);
var renderTexture2 = PIXI.RenderTexture.create(width, height);

var currentTexture = renderTexture;

var outputSprite = new PIXI.Sprite(currentTexture);
outputSprite.anchor.set(0.5);
app.stage.addChild(outputSprite);

var graphics = new PIXI.Graphics();
graphics.beginFill(0xffffff, .05);
graphics.drawRect(0, 0, 465, 465);

var bgTexture = PIXI.Texture.fromImage('/jsdoitArchives/assets/img/photo-1428999418909-363f8e091c50.jpeg');

bgTexture.baseTexture.addListener('loaded', function () {
    bgSprite = new PIXI.Sprite(bgTexture);
    bgSprite.anchor.set(.5);

    //app.stage.addChild(graphics);

    //let paperMapTexture = new PIXI.Texture.fromImage('/jsdoitArchives/assets/img/photo-1437422061949-f6efbde0a471.jpeg');
    var paperMapTexture = new PIXI.Texture.fromImage('/jsdoitArchives/assets/img/wdXqHcTwSTmLuKOGz92L_Landscape.jpg');

    paperMapTexture.baseTexture.addListener('loaded', function () {
        var vertexShader = document.querySelector('#vertex-shader');
        var fragmentShader = document.querySelector('#fragment-shader');

        var paperMapSprite = new PIXI.Sprite(paperMapTexture);
        var displacementFilter = new PIXI.filters.DisplacementFilter(paperMapSprite, 1);

        var bgUniforms = displacementFilter.uniforms;

        var bgFilter = displacementFilter;
        bgFilter.vertexSrc = vertexShader.textContent;
        bgFilter.fragmentSrc = fragmentShader.textContent;

        /*
        bgFilter = new PIXI.Filter(
            vertexShader.textContent,
            fragmentShader.textContent,
            bgUniforms
        );
        */
        //bgFilter = new PIXI.filters.BlurFilter();
        bgSprite.filters = [bgFilter];
        app.stage.addChild(bgSprite);

        var outputUniforms = {
            paper_map: {
                type: 'sampler2D',
                value: paperMapTexture
            },
            u_time: {
                type: 'f',
                value: 0
            },
            range: {
                type: 'f',
                value: .005
            }
        };
        //outputFilter = new PIXI.Filter('', fragmentShader.textContent, outputUniforms);
        //app.stage.filters = [ outputFilter ];

        start();
    });
});

function onWindowResize() {
    wrapper.style.width = '';
    wrapper.style.height = '';
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    if (renderTexture) {
        renderTexture.resize(width, height);
    }
    if (renderTexture2) {
        renderTexture2.resize(width, height);
    }

    if (outputSprite) {
        outputSprite.x = width / 2;
        outputSprite.y = height / 2;
    }

    if (bgSprite) {
        bgSprite.x = width / 2;
        bgSprite.y = height / 2;
    }

    /*
    if(filter) {
        filter.uniforms.u_resolution.x = width;
        filter.uniforms.u_resolution.y = height;
    }
    */

    app.renderer.resize(width, height);
}

function onMouseMove(e) {
    filter.uniforms.u_mouse.x = e.clientX;
    filter.uniforms.u_mouse.y = e.clientY;
}

function update(time) {
    //bgFilter.uniforms.scale.x = Math.sin(time) * 20;
    //bgFilter.uniforms.scale.y = Math.cos(time) * 20;

    /*
    bgFilter.uniforms.u_time = time / 4;
    outputFilter.uniforms.u_time = time / 16;
    */
}

function render(time) {
    var tmp = renderTexture;
    renderTexture = renderTexture2;
    renderTexture2 = tmp;

    //outputSprite.texture = renderTexture;   

    if (isFirstRender) {
        //bgSprite.texture = bgTexture;
        isFirstRender = false;
    } else {
        bgSprite.texture = renderTexture;
    }

    //app.renderer.render(app.stage);
    app.renderer.render(app.stage, renderTexture2, false);
}

function tick(time) {
    var currentTime = time / 1000;
    update(currentTime);
    render(currentTime);
    requestAnimationFrame(tick);
}

function start() {
    window.addEventListener('resize', onWindowResize);
    //window.addEventListener('mousemove', onMouseMove);
    onWindowResize();
    requestAnimationFrame(tick);
}

