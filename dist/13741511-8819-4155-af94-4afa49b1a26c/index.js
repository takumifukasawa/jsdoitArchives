'use strict';

var a = document.querySelector('#a');
var text = 'テキスト';
var hashtags = 'ハッシュ・タグ';
var url = 'https://twitter.com/intent/tweet?text=' + encodeURI(text) + '&hashtags=' + encodeURI(hashtags);
a.setAttribute('href', url);

