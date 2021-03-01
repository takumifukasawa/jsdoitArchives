'use strict';

var nodes = document.querySelectorAll('.selector');

for (var i = 0, len = nodes.length; i < len; i++) {
    var node = nodes[i];
    console.log(node.getAttribute('data-nest'));
}

