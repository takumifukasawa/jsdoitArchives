"use strict";

var recycleCanvas = document.getElementById("canvas");
var cached = {};
var recycleFPS = 2;

render();

setInterval(function () {
    cached.stage.destroy();
    cached.graphics.destroy();
    disposeRenderer(cached.renderer);

    render();
}, 1000 / recycleFPS);

function render() {
    var test = testRender(recycleCanvas);
    cached.stage = test.stage;
    cached.renderer = test.renderer;
    cached.graphics = test.graphics;
}

function testRender(canvas) {
    var renderer = new PIXI.WebGLRenderer(465, 465, {
        view: canvas,
        backgroundColor: 0x000000
    });

    var stage = new PIXI.Container();

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xff0000);
    graphics.drawCircle(Math.random() * 465, Math.random() * 465, 50 + Math.random() * 50);

    stage.addChild(graphics);

    renderer.render(stage);

    return { renderer: renderer, stage: stage, graphics: graphics };
}

function disposeRenderer(renderer) {
    renderer.destroyPlugins();

    // remove listeners
    // これがエラーになる原因
    // renderer.view.removeEventListener('webglcontextlost', this.handleContextLost);
    // renderer.view.removeEventListener('webglcontextrestored', this.handleContextRestored);

    renderer.textureManager.destroy();

    // 継承元の system renderer's destroy
    renderer.type = PIXI.RENDERER_TYPE.UNKNOWN;
    renderer.view = null;
    renderer.screen = null;
    renderer.resolution = 0;
    renderer.transparent = false;
    renderer.autoResize = false;
    renderer.blendModes = null;
    renderer.options = null;
    renderer.preserveDrawingBuffer = false;
    renderer.clearBeforeRender = false;
    renderer.roundPixels = false;
    renderer._backgroundColor = 0;
    renderer._backgroundColorRgba = null;
    renderer._backgroundColorString = null;
    renderer._tempDisplayObjectParent = null;
    renderer._lastObjectRendered = null;
    // end system renderer's destroy

    renderer.uid = 0;
    // destroy the managers
    renderer.maskManager.destroy();
    renderer.stencilManager.destroy();
    renderer.filterManager.destroy();
    renderer.maskManager = null;
    renderer.filterManager = null;
    renderer.textureManager = null;
    renderer.currentRenderer = null;
    renderer.handleContextLost = null;
    renderer.handleContextRestored = null;
    renderer._contextOptions = null;

    /* これも呼ばない
    if (renderer.gl.getExtension('WEBGL_lose_context')) {
        renderer.gl.getExtension('WEBGL_lose_context').loseContext();
    }
    */

    renderer.gl = null;
}

