'use strict';

var $sprite = document.querySelector('.sprite');

var loop = undefined;
var min = 1;
var max = 4;
var index = min;
var FPS = 2;

loop = function () {
    $sprite.setAttribute('data-index', index);
    index++;
    if (index > max) index = min;
    setTimeout(function () {
        loop();
    }, 1000 / FPS);
};

loop();

