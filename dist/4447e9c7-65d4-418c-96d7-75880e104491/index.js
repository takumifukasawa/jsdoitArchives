'use strict';

var tagFrag = false;
var timerID = null;

document.body.addEventListener('touchstart', function (e) {
    if (tapFrag) {
        e.preventDefault();
    }
});

document.body.addEventListener('touchend', function (e) {
    tapFrag = true;
    clearTimeout(timerID);
    timerID = null;
    timerID = setTimeout(function () {
        tapFrag = false;
    }, 200);
});

