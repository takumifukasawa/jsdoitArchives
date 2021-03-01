"use strict";

var button = document.getElementById('tweet');

var text = encodeURIComponent("てきすと #ハッシュタグだお");
var url = encodeURIComponent("http://google.com");

var shareUrl = "https://twitter.com/intent/tweet?text=" + text + "&url=" + url;
console.log(shareUrl);

button.setAttribute('href', shareUrl);

