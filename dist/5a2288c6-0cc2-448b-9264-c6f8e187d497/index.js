
// forked from takumifukasawa's "cookie確認" http://jsdo.it/takumifukasawa/yoUO
"use strict";

var KEY = "test";
var VALUE = "yes";

var loggerElem = document.querySelector(".js-logger");

function logger() {
    loggerElem.textContent = document.cookie ? "cookie: " + document.cookie : "no cookie.";
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

logger();

