'use strict';

var wrapper = document.querySelector('.wrapper');
var frag = document.createDocumentFragment();

for (var i = 0; i < 100; i++) {
    var awa = document.createElement('div');
    awa.classList.add('awa');

    var awaInner = document.createElement('a');
    awaInner.classList.add('awa-inner');
    awa.appendChild(awaInner);

    frag.appendChild(awa);
}

wrapper.appendChild(frag);

