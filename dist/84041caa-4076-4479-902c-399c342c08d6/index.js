"use strict";

var a = Math.pow(10, 9);
var counter = 1;
while (true) {
  if (Math.pow(2, counter) > a) break;
  counter++;
}
console.log(counter - 1);

