'use strict';

var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.querySelector('#my-canvas');
canvas.width = width;
canvas.height = height;

var stage = new createjs.Stage(canvas);

var circle = new createjs.Shape();
circle.graphics.beginFill('red').drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;

circle.addEventListener('click', function () {
  return alert('ciecle click!');
});

stage.addChild(circle);

stage.update();

