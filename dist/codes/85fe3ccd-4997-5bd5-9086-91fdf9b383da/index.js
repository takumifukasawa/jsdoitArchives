// forked from takumifukasawa's "cookie確認: アプリ化 + window.openボタン" http://jsdo.it/takumifukasawa/2s1C
// forked from takumifukasawa's "cookie確認: アプリ化しない" http://jsdo.it/takumifukasawa/U7AM

// forked from takumifukasawa's "cookie確認" http://jsdo.it/takumifukasawa/yoUO

"use strict";

var KEY = "test";
var VALUE = "yes";

var loggerElem = document.querySelector(".js-logger");

function logger() {
    loggerElem.textContent = document.cookie ? "cookie: " + document.cookie : "no cookie.";
}

function redirect() {
    var url = "https://google.com/";
    if (window.navigator.standalone) {
        location.href = url;
    }
}

function setCookie(name, value) {
    document.cookie = name + "=" + value;
}

function clearCookie(name) {
    var date = new Date();
    document.cookie = name + "=; expires=" + date.toUTCString();
}

var setButton = document.querySelector(".js-set");
setButton.addEventListener("click", function () {
    setCookie(KEY, VALUE);
    logger();
});

var reloadButton = document.querySelector(".js-reload");
reloadButton.addEventListener("click", function () {
    location.reload();
});

var clearButton = document.querySelector(".js-clear");
clearButton.addEventListener("click", function () {
    clearCookie(KEY);
    logger();
});

var redirectButton = document.querySelector(".js-redirect");
redirectButton.addEventListener("click", function () {
    redirect();
});

var metaAppMobile = document.createElement("meta");
metaAppMobile.setAttribute("content", "yes");
metaAppMobile.setAttribute("name", "apple-mobile-web-app-capable");
document.getElementsByTagName('head')[0].appendChild(metaAppMobile);

var metaAppleStatusBar = document.createElement("meta");
metaAppleStatusBar.setAttribute("content", "default");
metaAppleStatusBar.setAttribute("default", "apple-mobile-web-app-status-bar-style");
document.getElementsByTagName('head')[0].appendChild(metaAppleStatusBar);

var webClipIconLink = document.createElement("link");
webClipIconLink.setAttribute("href", "/common/img/829d24cf.png");
webClipIconLink.setAttribute("rel", "apple-touch-icon");
document.getElementsByTagName('head')[0].appendChild(webClipIconLink);

// main

redirect();
logger();

