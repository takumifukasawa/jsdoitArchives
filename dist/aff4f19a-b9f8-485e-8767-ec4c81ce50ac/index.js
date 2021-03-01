// forked from takumifukasawa's "forked: ツイート文言の中にハッシュタグ" http://jsdo.it/takumifukasawa/2gSV
// forked from takumifukasawa's "ツイート文言の中にハッシュタグ" http://jsdo.it/takumifukasawa/ynse
"use strict";

var button = document.getElementById('tweet');

var text = encodeURIComponent(" ツイート文言のハッシュタグに「.」");
var url = encodeURIComponent("http://example.com/a.b.c");
var hashtagsArray = ["a.b.c.d.e.f.g", "h.i.j.k.l.m.n"];

var hashtags = encodeURIComponent(Array.prototype.join.call(hashtagsArray, ","));

var shareUrl = "https://twitter.com/intent/tweet?text=" + text + "&url=" + url + "&hashtags=" + hashtags;
console.log(shareUrl);

button.setAttribute('href', shareUrl);

