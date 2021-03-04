// forked from takumifukasawa's "cookie確認" http://jsdo.it/takumifukasawa/yoUO

"use strict";

var KEY = "test";
var VALUE = "yes";

var loggerElem = document.querySelector(".js-logger");

function logger(name) {
    var value = localStorage.getItem(name);
    loggerElem.textContent = value ? "localStorage: " + name + "=" + value : "no localStorage.";
}

function setStorage(name, value) {
    localStorage.setItem(name, value);
}

function clearStorage(name) {
    localStorage.removeItem(name);
}

var metaAppMobile = document.createElement("meta");
metaAppMobile.setAttribute("content", "yes");
metaAppMobile.setAttribute("name", "apple-mobile-web-app-capable");
document.getElementsByTagName('head')[0].appendChild(metaAppMobile);

var metaAppleStatusBar = document.createElement("meta");
metaAppleStatusBar.setAttribute("content", "default");
metaAppleStatusBar.setAttribute("default", "apple-mobile-web-app-status-bar-style");
document.getElementsByTagName('head')[0].appendChild(metaAppleStatusBar);

var webClipIconLink = document.createElement("link");
webClipIconLink.setAttribute("href", "/jsdoitArchives/assets/img/photo-1465935343323-d742334bcbda.png");
webClipIconLink.setAttribute("ref", "apple-touch-icon");
document.getElementsByTagName('head')[0].appendChild(webClipIconLink);

var setButton = document.querySelector(".js-set");
setButton.addEventListener("click", function () {
    setStorage(KEY, VALUE);
    logger(KEY);
});

var reloadButton = document.querySelector(".js-reload");
reloadButton.addEventListener("click", function () {
    location.reload();
});

var clearButton = document.querySelector(".js-clear");
clearButton.addEventListener("click", function () {
    clearStorage(KEY);
    logger(KEY);
});

logger(KEY);

