// forked from takumifukasawa's "いんらいんチェック" http://jsdo.it/takumifukasawa/SNwh

'use strict';

var videoDom = document.querySelector("video");

function load() {
    return new Promise(function (resolve) {
        videoDom.addEventListener('canplaythrough', function () {
            resolve();
        });
        videoDom.src = '/jsdoitArchives/assets/video/sample-1.mp4';
    });
}

load().then(function () {
    videoDom.play();
});

function isAvailableInlinePlay() {
    var ua = navigator.userAgent;
    var isIOS = /iphone|ipad|ipod/i.test(ua);
    return !isIOS || 'playsInline' in videoDom;
}

var text = 'abailable inline play: ' + isAvailableInlinePlay();

var para = document.querySelector("#para");
para.textContent = text;

