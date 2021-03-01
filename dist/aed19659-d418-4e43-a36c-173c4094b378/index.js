'use strict';

var $knob = document.getElementById('knob');
var $bar = document.getElementById('bar');
var $garter = document.getElementById('garter');
var $monitor = document.getElementById('monitor');

var garterRects = $garter.getBoundingClientRect();
var garterWidth = parseInt(garterRects.width, 10);
var garterOffsetLeft = parseInt(garterRects.left, 10);

var adjustRateMin = 0;
var adjustRateMax = 1;

var allowUpdateSlider = false;

document.addEventListener('mousedown', function (e) {
    return mouseDown(e);
}, false);
document.addEventListener('mousemove', function (e) {
    return mouseMove(e);
}, false);
document.addEventListener('mouseup', function (e) {
    return mouseUp();
}, false);

function mouseDown(e) {
    if (e.target === $knob) {
        e.preventDefault();
        allowUpdateSlider = true;
        return;
    }

    if (e.target === $garter || e.target === $bar) {
        e.preventDefault();
        update(e.pageX);
        allowUpdateSlider = true;
        return;
    }

    allowUpdateSlider = false;
}

function mouseMove(e) {
    if (allowUpdateSlider) {
        e.preventDefault();
        update(e.pageX);
    }
}

function mouseUp() {
    allowUpdateSlider = false;
}

function adjustRate(rate) {
    if (rate <= adjustRateMin) return adjustRateMin;

    if (rate >= adjustRateMax) return adjustRateMax;

    return rate;
}

function update(pageX) {
    var rate = (pageX - garterOffsetLeft) / garterWidth;
    rate = adjustRate(rate);

    $monitor.textContent = rate * 100 + '％';
    $knob.style.left = garterWidth * rate + 'px';
    $bar.style.width = garterWidth * rate + 'px';
}

