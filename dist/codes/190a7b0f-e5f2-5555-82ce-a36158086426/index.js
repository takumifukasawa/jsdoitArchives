// forked from takumifukasawa's "pixijs: 画像をどんどんにじませる" http://jsdo.it/takumifukasawa/wtAt
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

var canvas2D = document.querySelector('.canvas2d');
var ctx2D = canvas2D.getContext('2d');

var copyCanvas = document.querySelector('.copyCanvas');
var copyCtx = copyCanvas.getContext('2d');

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

var bgTexture = PIXI.Texture.fromImage('/common/img/photo-1429305336325-b84ace7eba3b.jpeg');

var bgSprites = [];
for (var i = 0; i < 4; i++) {
    var sprite = new PIXI.Sprite();
    bgSprites.push(sprite);
    app.stage.addChild(sprite);
}

bgTexture.baseTexture.addListener('loaded', function () {
    bgSprite = new PIXI.Sprite(new PIXI.Texture.fromCanvas(canvas2D));
    bgSprite.anchor.set(.5);

    //app.stage.addChild(graphics);

    //let paperMapTexture = new PIXI.Texture.fromImage('/common/img/photo-1444837881208-4d46d5c1f127.jpeg');
    var paperMapTexture = new PIXI.Texture.fromImage('/common/img/photo-1473865327424-e85f6d40d354.jpeg');

    paperMapTexture.baseTexture.addListener('loaded', function () {
        var vertexShader = document.querySelector('#vertex-shader');
        var fragmentShader = document.querySelector('#fragment-shader');

        var paperMapSprite = new PIXI.Sprite(paperMapTexture);
        var displacementFilter = new PIXI.filters.DisplacementFilter(paperMapSprite, 10);

        var bgUniforms = displacementFilter.uniforms;

        bgUniforms.uSampler1 = {
            type: 'sampler2D',
            value: bgTexture
        };
        bgUniforms.uSampler2 = {
            type: 'sampler2D',
            value: bgTexture
        };
        bgUniforms.uSampler3 = {
            type: 'sampler2D',
            value: bgTexture
        };
        bgUniforms.uSampler4 = {
            type: 'sampler2D',
            value: bgTexture
        };

        bgFilter = displacementFilter;
        bgFilter.vertexSrc = vertexShader.textContent;
        bgFilter.fragmentSrc = fragmentShader.textContent;
        //console.log(bgFilter);

        //bgFilter = new PIXI.filters.BlurFilter();

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

    canvas2D.width = width;
    canvas2D.height = height;

    copyCanvas.width = width;
    copyCanvas.height = height;

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

    if (bgSprites) {
        bgSprites.forEach(function (sprite) {
            sprite.x = width / 2;
            sprite.y = height / 2;
        });
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

    bgSprite.x = width / 2 + Math.sin(time);
}

function render(time) {
    ctx2D.clearRect(0, 0, width, height);
    ctx2D.drawImage(bgTexture.baseTexture.source, 20 + Math.sin(time * 2) * 20, 0);

    /*    
        const tmp = renderTexture;
        renderTexture = renderTexture2;
        renderTexture2 = tmp;
    
        bgFilter.uniforms.uSampler4 = bgFilter.uniforms.uSampler3;
        bgFilter.uniforms.uSampler3 = bgFilter.uniforms.uSampler2;
        bgFilter.uniforms.uSampler2 = bgFilter.uniforms.uSampler1;    
        bgFilter.uniforms.uSampler1 = bgTexture;
    
        //outputSprite.texture = renderTexture;    
    
        if(isFirstRender) {    
            //bgSprite.texture = bgTexture;
            isFirstRender = false;
        } else {
            //bgSprite.texture = renderTexture;
        }
        */

    bgSprite.texture.update();

    app.renderer.render(app.stage);
    //app.renderer.render(app.stage, renderTexture2, false);

    //copyCtx.drawImage(canvas2D, 0, 0);
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

