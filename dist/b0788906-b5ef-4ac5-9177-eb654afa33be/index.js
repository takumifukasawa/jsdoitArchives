'use strict';

window.onload = function () {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var stage = new createjs.Stage(canvas);

    var circle = new createjs.Shape();
    circle.graphics.beginFill('red');
    circle.graphics.drawCircle(0, 0, 100);
    circle.x = window.innerWidth / 2;
    circle.y = window.innerHeight / 2;

    stage.addChild(circle);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', update);

    var tween = createjs.Tween.get(circle).wait(500).to({ alpha: 0.2 }, 1000).call(handleComplete);

    function handleComplete() {
        console.log('tween end');
        console.log(tween);
        createjs.Tween.removeTweens(circle.target);
        //console.log(tween);
    }

    function update() {
        stage.update();
    }
};

