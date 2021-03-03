//---------------------------------------------------
// constants
//---------------------------------------------------   

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BOX_SIZE = 30;
var OFFSET_NUM = 2;

//---------------------------------------------------
// page starts
//---------------------------------------------------   

var width = undefined,
    height = undefined;
var tex = undefined;
var rate = undefined;
var boxes = [];
var center = {};

var wrapper = document.querySelector(".wrapper");
var canvas = document.querySelector(".canvas");

var ctx = canvas.getContext("2d");

var img = document.createElement("img");
img.onload = function () {
    init();
};
img.src = "assets/img/photo-1422651355218-53453822ebb8.jpg";

//---------------------------------------------------
// box
//---------------------------------------------------   

var Box = (function () {
    function Box(p, s, coeff) {
        _classCallCheck(this, Box);

        this._point = p;
        this._size = s;
        this._coeff = coeff;
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
        key: "draw",
        value: function draw(ctx) {
            ctx.fillStyle = this._color;
            ctx.fillRect(this._point.x - this._size / 2, this._point.y - this._size / 2, this._size, this._size);
        }
    }]);

    return Box;
})();

function init() {
    onWindowResize();

    center.x = width / 2;
    center.y = height / 2;

    var rowNum = (width / BOX_SIZE | 1) + OFFSET_NUM;
    var colNum = (width / BOX_SIZE | 1) + OFFSET_NUM;

    var beginPos = {
        x: (width - rowNum * BOX_SIZE) / 2 | 0,
        y: (height - colNum * BOX_SIZE) / 2 | 0
    };

    console.log(beginPos);
    console.log(rowNum, colNum);

    for (var i = 0; i < rowNum; i++) {
        for (var j = 0; j < colNum; j++) {
            var x = beginPos.x + BOX_SIZE * (i % rowNum);
            var y = beginPos.y + BOX_SIZE * j;
            var p = { x: x, y: y };
            var v = { x: p.x - center.x, y: p.y - center.y };
            var d = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
            var coeff = d / (300 + Math.random() * 120);
            var box = new Box(p, BOX_SIZE, coeff);
            boxes.push(box);
        }
    }

    window.addEventListener("resize", onWindowResize);
    requestAnimationFrame(tick);
}

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    canvas.width = width;
    canvas.height = height;
}

function update(time) {
    rate = -.5 + time / 1500;
}

function render(time) {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        if (box.isContain(rate)) {
            box.draw(ctx);
        }
    }

    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.restore();
}

function tick(time) {
    update(time);
    render(time);
    requestAnimationFrame(tick);
}

