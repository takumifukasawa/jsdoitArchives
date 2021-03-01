"use strict";

var isVideoPlaying = false;

var button = document.querySelector(".button");
var video = document.querySelector("#video");
var circle = document.querySelector(".circle");

var indicator = document.querySelector(".indicator");
var barWidth = indicator.offsetWidth;

function showButton() {
    button.style.display = "block";
}

function hideButton() {
    button.style.display = "none";
}

function updateIndicator(rate) {
    var x = Math.floor(barWidth * rate);
    circle.style.transform = "translate(" + x + "px, 0px";
}

function tick() {
    // if(isVideoPlaying) {
    var rate = video.currentTime / video.duration;
    updateIndicator(rate || 0);
    //}   
    requestAnimationFrame(tick);
}

button.addEventListener("click", function () {
    video.play();
});

video.addEventListener("click", function () {
    video.pause();
});

video.addEventListener("play", function () {
    hideButton();
    isVideoPlaying = true;
    console.log("play");
});

video.addEventListener("pause", function () {
    showButton();
    isVideoPlaying = false;
    console.log("pause");
});

video.addEventListener("ended", function () {
    console.log("ended");
    video.seek = 0;
});

requestAnimationFrame(tick);

