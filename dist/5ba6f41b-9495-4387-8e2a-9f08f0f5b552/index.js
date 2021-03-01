'use strict';

var wrapper = document.querySelector('.wrapper');

var xmlns = 'http://www.w3.org/2000/svg';

var frag = document.createDocumentFragment();
var svg = document.createElementNS(xmlns, 'svg');
var rect = document.createElementNS(xmlns, 'rect');

svg.setAttributeNS(null, "width", "300");
svg.setAttributeNS(null, "height", "300");

svg.setAttributeNS(null, "viewBox", "0 0 100 300");
svg.setAttributeNS(null, "enableBackground", "0 0 300 300");
//svg.setAttributeNS(null, "preserveAspectRatio", "xMidYMid slice");

rect.setAttributeNS(null, "width", "300");
rect.setAttributeNS(null, "height", "300");

svg.appendChild(rect);
frag.appendChild(svg);

setTimeout(function () {
    wrapper.appendChild(svg);
}, 500);

