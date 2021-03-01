// forked from takumifukasawa's "check css-animation when toggled display none." http://jsdo.it/takumifukasawa/Ag5H
'use strict';

var elem = document.querySelector('.elem');

setInterval(function () {
    elem.classList.toggle('is-show');
}, 1000);

