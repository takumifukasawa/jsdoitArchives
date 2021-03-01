'use strict';

//////////////////////////////////////////////
// defines
//////////////////////////////////////////////

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DOT_NUM = 80;

// dot間の角度
var MARGIN_DEG = 360 / 16;

// myframe増やす量
var DELTA_DEG = 2;

var MIN_DEG = 0;
var MAX_DEG = 360 * 8;

var MIN_RADIUS = 5;
var MAX_RADIUS = 10;
var DIFF_RAIDUS = MAX_RADIUS - MIN_RADIUS;

//////////////////////////////////////////////
// utils
//////////////////////////////////////////////

function r(theta) {
    var a = 1;
    var b = 0.13;
    return a * Math.pow(Math.E, b * theta);
}

//////////////////////////////////////////////
// dot
//////////////////////////////////////////////

var Dot = (function () {
    function Dot() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Dot);

        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.deg = opts.deg || 0;
        this.beginDeg = this.deg;
        this.radius = opts.radius || 2;
    }

    //////////////////////////////////////////////
    // main
    //////////////////////////////////////////////

    _createClass(Dot, [{
        key: 'check',
        value: function check() {
            if (this.deg >= MAX_DEG) this.deg = this.beginDeg;
        }
    }, {
        key: 'update',
        value: function update(centerX, centerY) {
            this.deg += DELTA_DEG;
            var rad = this.deg * Math.PI / 180;
            this.x = centerX + r(rad) * Math.cos(rad);
            this.y = centerY + r(rad) * Math.sin(rad);

            //console.log(this.x, this.y, this.deg);
            this.check();
        }
    }]);

    return Dot;
})();

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.beginTime = +new Date();

        this.initCanvas();
        this.initSize();
        this.initDots();
        this.run();
    }

    //////////////////////////////////////////////
    // action
    //////////////////////////////////////////////

    _createClass(Main, [{
        key: 'initCanvas',
        value: function initCanvas() {
            this.$canvas = document.querySelector('#container');
            this.ctx = this.$canvas.getContext('2d');
        }
    }, {
        key: 'initSize',
        value: function initSize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.$canvas.width = this.width;
            this.$canvas.height = this.height;
            this.$canvas.style.width = this.width + 'px';
            this.$canvas.style.height = this.height + 'px';
        }
    }, {
        key: 'initDots',
        value: function initDots() {
            this.dots = [];
            for (var i = 0; i < DOT_NUM; i++) {
                var dot = new Dot({
                    deg: MARGIN_DEG * i
                });
                this.dots.push(dot);
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }, {
        key: 'update',
        value: function update() {
            var currentTime = +new Date();
            var diff = currentTime - this.beginTime;
            if (diff / 1000 > 10) {
                this.beginTime = +new Date();
                this.initDots();
            }

            this.clear();

            for (var i = 0, len = this.dots.length; i < len; i++) {
                var dot = this.dots[i];
                dot.update(this.width / 2, this.height / 2);

                this.ctx.save();
                this.ctx.fillStyle = 'red';
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, dot.radius, 0, 360 * Math.PI / 180, false);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }, {
        key: 'run',
        value: function run() {
            var _this = this;

            var update = null;
            update = function () {
                _this.update();
                requestAnimationFrame(update);
            };
            update();
        }
    }]);

    return Main;
})();

new Main();

