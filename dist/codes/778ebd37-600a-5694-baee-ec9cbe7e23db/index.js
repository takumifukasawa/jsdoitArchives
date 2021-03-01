'use strict';

var timerId = setInterval(function () {
    console.log('timer dayo');

    console.log(timerId); // intervalidId

    clearInterval(timerId);
    console.log(timerId); // intervalId
    console.log(timerId == null); // false

    timerId = null;
    console.log(timerId); // null
    console.log(timerId == null); // true
}, 1000);

