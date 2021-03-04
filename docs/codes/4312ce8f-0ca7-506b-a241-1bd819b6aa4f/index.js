// forked from takumifukasawa's "canvasでパタパタ画像切り替え" http://jsdo.it/takumifukasawa/AZY5
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function clamp(x, a, b) {
    if (x < a) {
        return a;
    }
    if (x > b) {
        return b;
    }
    return x;
}

// forked from takumifukasawa's "canvasでパタパタ画像切り替え" http://jsdo.it/takumifukasawa/q6dO
//---------------------------------------------------
// constants
//---------------------------------------------------   

var RATIO = window.devicePixelRatio || 1;
//const RATIO = .2;

var BOX_SIZE = 40 * RATIO;
var OFFSET_NUM = 2;
var DIRECTIONS = ["top", "left", "right", "bottom"];

//---------------------------------------------------
// page starts
//---------------------------------------------------   

var width = undefined,
    height = undefined;
var tex = undefined;
var rate = 0;
var boxes = [];
var center = {};

var wrapper = document.querySelector(".wrapper");
var canvas = document.querySelector(".canvas");

var ctx = canvas.getContext("2d");

var img = document.createElement("img");
img.onload = function () {
    init();
};
img.src = "/jsdoitArchives/assets/img/photo-1416512149338-1723408867e9.jpeg";

//---------------------------------------------------
// box
//---------------------------------------------------   

var Box = (function () {
    function Box(p, s, direction, coeff) {
        _classCallCheck(this, Box);

        // 箱の中心
        this._point = p;
        // 大きさ
        this._size = {
            x: s, y: s
        };
        // drawRectの起点
        this._basePoint = {
            x: this._point.x - this._size.x / 2,
            y: this._point.y - this._size.y / 2
        };

        this._coeff = coeff;

        this._direction = direction;

        this._sizeRate = {
            x: 0, y: 0
        };

        this._speed = 18;
        this._accel = .3;

        // debug
        //this._color = `rgb(${255 * this._coeff | 0}, 255, 255)`;
    }

    //---------------------------------------------------
    // functions
    //---------------------------------------------------   

    _createClass(Box, [{
        key: "setSize",
        value: function setSize() {}
    }, {
        key: "isContain",
        value: function isContain(rate) {
            return this._coeff < rate;
        }
    }, {
        key: "update",
        value: function update(time, rate) {
            var t = Math.pow((rate - this._coeff) * this._speed, this._accel);
            //let t = rate - this._coeff;

            var currentRate = clamp(t, 0, 1);
            //console.log(this._direction, currentRate, rate, this._coeff, t)

            switch (this._direction) {
                case "top":
                    this._sizeRate.x = 1;
                    this._sizeRate.y = currentRate;
                    break;
                case "bottom":
                    this._sizeRate.x = 1;
                    this._sizeRate.y = currentRate;
                    break;
                case "left":
                    this._sizeRate.x = currentRate;
                    this._sizeRate.y = 1;
                    break;
                case "right":
                    this._sizeRate.x = currentRate;
                    this._sizeRate.y = 1;
                    break;
            }
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            //console.log(this._sizeRate.x, this._sizeRate.y);
            switch (this._direction) {
                // 上へ
                case "top":
                    ctx.fillRect(
                    // point
                    this._basePoint.x, this._basePoint.y + this._size.y - this._size.y * this._sizeRate.y,
                    // size
                    this._size.x, this._size.y * this._sizeRate.y);
                    break;

                // 下へ  
                case "bottom":
                    ctx.fillRect(
                    // point
                    this._basePoint.x, this._basePoint.y,
                    // size
                    this._size.x, this._size.y * this._sizeRate.y);
                    break;

                // 左へ
                case "left":
                    ctx.fillRect(
                    // point
                    this._basePoint.x + this._size.x - this._size.x * this._sizeRate.x, this._basePoint.y,
                    // size
                    this._size.x * this._sizeRate.x, this._size.y);
                    break;

                // 右へ   
                case "right":
                    ctx.fillRect(
                    // poiiit
                    this._basePoint.x, this._basePoint.y,
                    // size
                    this._size.x * this._sizeRate.x, this._size.y);
                    break;

            }
        }
    }]);

    return Box;
})();

function init() {
    onWindowResize();

    center.x = width / 2;
    center.y = height / 2;

    var rowNum = (width / BOX_SIZE | 1) + OFFSET_NUM;
    var colNum = (height / BOX_SIZE | 1) + OFFSET_NUM;

    var beginPos = {
        x: (width - rowNum * BOX_SIZE) / 2 | 0,
        y: (height - colNum * BOX_SIZE) / 2 | 0
    };

    for (var i = 0; i < rowNum; i++) {
        for (var j = 0; j < colNum; j++) {
            var x = beginPos.x + BOX_SIZE * (i % rowNum);
            var y = beginPos.y + BOX_SIZE * j;
            var p = { x: x, y: y };
            var v = { x: p.x - center.x, y: p.y - center.y };
            var d = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
            var coeff = d / (400 + Math.random() * 120);

            var directions = [];
            if (p.x > center.x) {
                directions.push("right");
            } else {
                directions.push("left");
            }
            if (p.y > center.y) {
                directions.push("bottom");
            } else {
                directions.push("top");
            }
            var directionIndex = directions[Math.random() * directions.length | 0];

            var box = new Box(p, BOX_SIZE, directionIndex, coeff);
            boxes.push(box);
        }
    }
    console.log(width, height, BOX_SIZE, rowNum, colNum, beginPos, boxes);

    window.addEventListener("resize", onWindowResize);
    requestAnimationFrame(tick);
}

function onWindowResize() {
    width = wrapper.offsetWidth * RATIO;
    height = wrapper.offsetHeight * RATIO;
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = width / RATIO + "px";
    canvas.style.height = height / RATIO + "px";
}

function update(time) {
    rate = time / (6000 / RATIO);

    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        box.update(time, rate);
    }
}

function render(time) {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        box.draw(ctx);
    }
    ctx.globalCompositeOperation = "source-in";

    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
}

function tick(time) {
    update(time);
    render(time);
    requestAnimationFrame(tick);
}

