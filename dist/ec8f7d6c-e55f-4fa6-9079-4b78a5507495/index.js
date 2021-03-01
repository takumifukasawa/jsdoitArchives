// forked from takumifukasawa's "黄金螺旋：中心点からの距離によって要素拡大" http://jsdo.it/takumifukasawa/2V5c
// forked from takumifukasawa's "黄金螺旋" http://jsdo.it/takumifukasawa/YTQM
'use strict';

//////////////////////////////////////////////
// defines
//////////////////////////////////////////////

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var RESET_TIME = 8;

var DOT_NUM = 80;

// dot間の角度
var MARGIN_DEG = 360 / 15;

// myframe増やす量
var DELTA_DEG = 2;

var MIN_DEG = 360 * 4;
var MAX_DEG = 360 * 10;

var MIN_RADIUS = 1;
var MAX_RADIUS = 10;
var DIFF_RADIUS = MAX_RADIUS - MIN_RADIUS;

// 簡易retina対応
var RATIO = window.devicePixelRatio > 1 ? 2 : 1;

//////////////////////////////////////////////
// utils
//////////////////////////////////////////////

function r(theta) {
    var a = 1;
    var b = 0.11;
    return a * Math.pow(Math.E, b * theta);
}

//////////////////////////////////////////////
// chara
//////////////////////////////////////////////

var Chara = (function () {
    function Chara() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Chara);

        this.text = opts.text;
        this.size = opts.size || 10;
        this.deg = opts.deg || 0;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
    }

    //////////////////////////////////////////////
    // main
    //////////////////////////////////////////////

    _createClass(Chara, [{
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
            this.radius = MIN_RADIUS + DIFF_RADIUS * (this.deg / MAX_DEG);

            this.check();
        }
    }]);

    return Chara;
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
            this.$canvas.width = this.width * RATIO;
            this.$canvas.height = this.height * RATIO;
            this.$canvas.style.width = this.width + 'px';
            this.$canvas.style.height = this.height + 'px';
        }
    }, {
        key: 'initDots',
        value: function initDots() {
            this.charas = [];
            for (var i = 0; i < DOT_NUM; i++) {
                var chara = new Chara({
                    deg: MIN_DEG + MARGIN_DEG * i
                });
                this.charas.push(chara);
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
            if (diff / 1000 > RESET_TIME) {
                this.beginTime = +new Date();
                this.initDots();
            }

            this.clear();

            for (var i = 0, len = this.charas.length; i < len; i++) {
                var chara = this.charas[i];
                chara.update(this.width / 2, this.height / 2);

                this.ctx.save();
                this.ctx.font = chara.size + ' \'Hiragino Mincho Pro\',\'MS Mincho\',\'TakaoMincho\'';
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(chara.text, chara.x, chara.y);
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

