'use strict';

var width = 0;
var height = 0;

var wrapper = document.querySelector('.wrapper');

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (width > height) {
        console.log('landscale');
    } else {
        console.log('not landscape');
    }

    wrapper.style.width = width + 'px';
}

window.addEventListener('resize', onWindowResize);
onWindowResize();

