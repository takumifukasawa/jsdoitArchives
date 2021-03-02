"use strict";

var hourTen = document.querySelector(".hour-ten");
var hourOne = document.querySelector(".hour-one");
var selectDateH = document.getElementById("selectedate-h");

var minutesTen = document.querySelector(".minutes-ten");
var minutesOne = document.querySelector(".minutes-one");
var selectDateM = document.getElementById("selectedate-m");

selectDateH.addEventListener("change", function () {
    console.log("change: h");
    console.log(selectDateH.value);
    var time = selectDateH.value.split("");
    hourTen.setAttribute("data-num", time[0]);
    hourOne.setAttribute("data-num", time[1]);
});

selectDateM.addEventListener("change", function () {
    console.log("change: m");
    console.log(selectDateM.value);
    var time = selectDateM.value.split("");
    minutesTen.setAttribute("data-num", time[0]);
    minutesOne.setAttribute("data-num", time[1]);
});

