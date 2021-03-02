"use strict";

var $target = document.querySelector('.empty-target');

setInterval(function () {
    var targetText = $target.textContent;
    if (targetText) {
        $target.textContent = "";
    } else {
        $target.textContent = "this is not empty!";
    }
}, 1000);

