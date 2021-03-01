'use strict';

var log = document.getElementById('log');
var frag = document.createDocumentFragment();

var ua = navigator.userAgent;

// ios
var isiOS = /iphone|ipad|ipod/.test(ua.toLowerCase()) ? true : false;
logger(frag, 'isiOS', isiOS);

// android
var isAndroid = /android/.test(ua.toLowerCase()) ? true : false;
logger(frag, 'isAndroid', isAndroid);

// webview
var isWebView = (isiOS || isAndroid) && /twitter|fbav|line/.test(ua.toLowerCase()) ? true : false;
logger(frag, 'isWebView(twitter,facebook,line)', isWebView);

// fullscreen
var canFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullscreenEnabled || document.msFullscreenEnabled || false;
logger(frag, 'canFullscreen', canFullscreen);

var uaLog = document.createElement('p');
logger(frag, 'userAgent', ua);

log.appendChild(frag);

function logger(parent, label, status) {
    var para = document.createElement('p');
    para.innerHTML = '<span>' + label + ': </span>' + status;
    parent.appendChild(para);
}

