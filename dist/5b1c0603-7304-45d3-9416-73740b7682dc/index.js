'use strict';

var $display = document.querySelector('#wrapper');

document.addEventListener('mousemove', handleMouseMove);

function handleMouseMove(e) {
    displayMousePosition(e.clientX, e.clientY);
}

function displayMousePosition(x, y) {
    $display.textContent = 'x: ' + x + 'px y: ' + y + 'px';
}

