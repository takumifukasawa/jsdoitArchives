// forked from yumikokh_'s "test: create.js | パララックス" http://jsdo.it/yumikokh_/4DiI
// forked from yumikokh_'s "test: create.js | preload + マスク" http://jsdo.it/yumikokh_/MEtS
// forked from yumikokh_'s "base: create.js" http://jsdo.it/yumikokh_/KhSO

"use strict";

var $w = $(window);
var ww = $w.width(),
    wh = $w.height();
$('#myCanvas').css({ width: ww, height: wh });

//ステージ作成
var stage = new createjs.Stage("myCanvas");

//キャンパスの中心
var cw = stage.canvas.width;
var ch = stage.canvas.height;
var centerX = cw / 2;
var centerY = ch / 2;

//オブジェクト作成
var donkey = new createjs.Bitmap();
donkey.set({
    x: 10,
    y: 10,
    image: image2
});
//stage.addChild(donkey);

var props = [],
    pikachu = [];
for (var i = 0; i < 20; i++) {

    pikachu[i] = new createjs.Bitmap();

    var x = Math.random() * 600 - 300;
    var y = Math.random() * 600 - 300;

    props.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        z: Math.random() * 300 + 200,
        regX: 100,
        regY: 100,
        scaleX: 1,
        scaleY: 1,
        image: image1
    });
    pikachu[i].set(props[i]);
}

//基準点描画
var centerPoint = new createjs.Shape();
centerPoint.graphics.beginFill("blue").drawCircle(0, 0, 10);
centerPoint.x = centerX;
centerPoint.y = centerY;
stage.addChild(centerPoint);

//重なりの整合性とる
pikachu.sort(function (a, b) {
    return b.z - a.z;
});

for (var i = 0, len = pikachu.length; i < len; i++) {
    stage.addChild(pikachu[i]);
}

//カメラの作成
var camera = {
    x: 0,
    y: 0,
    z: 100,
    f: 200
};

function setCameraPosition(x, y, z) {
    var newX = x - cw / 2;
    var newY = y - ch / 2;

    camera.x = newX;
    camera.y = newY;
    camera.z = z;
}

//オブジェクト描画
function renderObject(obj) {
    var scale = camera.f / (obj.z - camera.z);
    obj.scaleX = obj.scaleY = scale;

    var point = obj.globalToLocal(centerX, centerY);

    obj.x = obj.baseX - camera.x * scale;
    obj.y = obj.baseY - camera.y * scale;
}

function render() {
    for (var i = 0; i < pikachu.length; i++) {
        renderObject(pikachu[i]);
    }
}

createjs.Ticker.addEventListener("tick", handleTick);

function handleTick() {
    setCameraPosition(stage.mouseX - cw / 2, stage.mouseY - ch / 2, camera.z);
    //console.log(stage.mouseX);
    render();

    stage.update();
}

