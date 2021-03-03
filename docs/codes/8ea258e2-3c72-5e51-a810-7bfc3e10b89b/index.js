// forked from konma's "pixi.jsデモ1" http://jsdo.it/konma/vluZ
"use strict";

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

// create an new instance of a pixi stage
var stage = new PIXI.Container();

// create a renderer instance
var renderer = new PIXI.WebGLRenderer(WIDTH, HEIGHT, { backgroundColor: 0xEEEEEE });

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// create a texture from an image path
var texture = PIXI.Texture.fromImage("/jsdoitArchives/assets/img/photo-1465205568425-23fdd3805e49.png");
var smokes = [];

for (var i = 0, len = 200; i < len; i++) {
    var smoke = new PIXI.Sprite(texture);
    smoke.position.x = Math.random() * WIDTH;
    smoke.position.y = Math.random() * HEIGHT;
    smoke.anchor.x = 0.5;
    smoke.anchor.y = 0.5;
    var scale = 0.1 + Math.random() * 9 / 10;
    smoke.scale.x = scale;
    smoke.scale.y = scale;
    stage.addChild(smoke);
    smokes.push(smoke);
}

requestAnimationFrame(animate);

function animate() {

    requestAnimationFrame(animate);

    // just for fun, lets rotate mr rabbit a little
    for (var i = 0, len = smokes.length; i < len; i++) {
        smokes[i].rotation += 0.01;
    }

    // render the stage
    renderer.render(stage);
}

