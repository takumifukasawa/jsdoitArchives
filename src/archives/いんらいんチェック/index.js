"use strict";

var videoDom = document.querySelector("video");

function isAvailableInlinePlay() {
    var ua = navigator.userAgent;
    var isIOS = /iphone|ipad|ipod/i.test(ua);
    return !isIOS || 'playsInline' in videoDom;
}

var text = "abailable inline play: " + isAvailableInlinePlay();

var para = document.querySelector("#para");
para.textContent = text;

