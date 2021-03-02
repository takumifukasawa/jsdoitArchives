// forked from takumifukasawa's "selectの値を画像表示（00:00~23:59）" http://jsdo.it/takumifukasawa/q8fz

"use strict";

var hourTen = document.querySelector(".hour-ten");
var hourOne = document.querySelector(".hour-one");

var minutesTen = document.querySelector(".minutes-ten");
var minutesOne = document.querySelector(".minutes-one");

var inputTime = document.getElementById('input-time');
inputTime.addEventListener("change", function () {
    updateTime();
});
inputTime.addEventListener("input", function () {
    if (inputTime.value === "") {
        inputTime.value = "00:00";
        console.log("clear.");
    }
});

updateTime();

function updateTime(input) {
    var i = inputTime.value ? inputTime.value : "00:00";
    var time = i.split(":");
    var hour = time[0].split("");
    var minutes = time[1].split("");

    hourTen.setAttribute("data-num", hour[0]);
    hourOne.setAttribute("data-num", hour[1]);
    minutesTen.setAttribute("data-num", minutes[0]);
    minutesOne.setAttribute("data-num", minutes[1]);
}

