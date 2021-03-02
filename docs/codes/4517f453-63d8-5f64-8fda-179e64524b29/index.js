"use strict";

console.log("======================================================");

/* ======================================================
 *
 * destructiong
 *
 * ======================================================
 */

function today() {
    return {
        y: 2015,
        m: 11,
        d: 16
    };
}

var _today = today();

var year = _today.y;
var month = _today.m;
// y->year, m->month
console.log(year, month); // 2015, 11

var hoge = "hoge",
    fuga = "fuga";

console.log(hoge, fuga); // hoge, fuga

var _ref = [fuga, hoge];
hoge = _ref[0];
fuga = _ref[1];

console.log(hoge, fuga); // fuga, hoge

/* ======================================================
 *
 * arrow func
 *
 * ======================================================
 */

var counter = {
    num: 0,
    countUp: function countUp() {
        setTimeout(function () {
            //this.num++; // 'this' = global
        }, 100);
    },
    countDown: function countDown() {
        var _this = this;

        setTimeout(function () {
            return _this.num--;
        }, 100); // 'this' = counter
    }
};

counter.countDown();
setTimeout(function () {
    console.log(counter.num);console.log("end.");
}, 1000); // -1
// ↑ 中括弧でくくれば1文以上書ける。

