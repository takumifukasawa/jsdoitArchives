'use strict';

var elem = document.querySelector('.elem');

setInterval(function () {
    elem.classList.toggle('is-show');
}, 1000);

