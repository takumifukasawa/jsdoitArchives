'use strict';

var logger = document.querySelector('#logger');
var obj = {};

obj.a = 'A';
obj.b = 'B';
obj.c = 'C';

var output = '';

for (var key in obj) {
    output += key + ': ' + obj[key] + '<br/>';
}

logger.innerHTML = output;

