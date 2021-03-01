'use strict';

var wrapper = document.querySelector('.wrapper');

var xmlns = 'http://www.w3.org/2000/svg';

var frag = document.createDocumentFragment();
var svg = document.createElementNS(xmlns, 'svg');
var rect = document.createElementNS(xmlns, 'rect');

svg.setAttributeNS(null, "width", "300");
svg.setAttributeNS(null, "height", "300");

rect.setAttributeNS(null, "width", "300");
rect.setAttributeNS(null, "height", "300");

svg.appendChild(rect);
frag.appendChild(svg);

wrapper.appendChild(svg);

