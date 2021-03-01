'use strict';

var text_list = ['a', 'b', 'c', 'd', 'e'];

var htmlText = document.createDocumentFragment();
for (var i = 0; i < text_list.length; i++) {
    var span = document.createElement('span');
    span.classList.add('text_anime' + (i + 1));
    span.textContent = text_list[i];
    htmlText.appendChild(span);
    document.getElementById('wrapper').appendChild(span);
}

