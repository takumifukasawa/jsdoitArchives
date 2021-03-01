// forked from takumifukasawa's "時計回りの対数螺旋に文字を配置" http://jsdo.it/takumifukasawa/sv5g
// forked from takumifukasawa's "undefinedの螺旋" http://jsdo.it/takumifukasawa/iz5G
// forked from takumifukasawa's "黄金螺旋：中心点からの距離によって要素拡大" http://jsdo.it/takumifukasawa/2V5c
// forked from takumifukasawa's "黄金螺旋" http://jsdo.it/takumifukasawa/YTQM
'use strict';

//////////////////////////////////////////////
// defines
//////////////////////////////////////////////

// 簡易retina対応

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var IS_SP = window.UA.isSp;
var RATIO = window.devicePixelRatio <= 1 || !IS_SP ? 1 : 2;

var RESET_TIME = 12;

// dot間の角度
var MARGIN_DEG = 360 / 20;

// myframe増やす量
// プラスで拡大
// マイナスで収束
var DELTA_DEG = 0.6;

// 文字をどれくらい回転させるかを決めうち
var BASE_CHARA_DEG = 100;
var MIN_DEG = 360 * 3;
var MAX_DEG = 360 * 10;

var MIN_TEXT_SIZE = 0 * RATIO;
var MAX_TEXT_SIZE = 100 * RATIO;
var DELTA_TEXT_SIZE = 0.4;

//const TEXT = 'あいうえおか';
var TEXT = '精神を凌駕することのできるのは習慣という怪物だけなのだ。世界が必ず滅びるといふ確信がなかつたら、精神を凌駕することのできるのは習慣という怪物だけなのだ。世界が必ず滅びるといふ確信がなかつたら、';
var TEXT_ARRAY = TEXT.split('').reverse();

//const TEXT_LENGTH = 1;
var TEXT_LENGTH = TEXT_ARRAY.length;

//////////////////////////////////////////////
// utils
//////////////////////////////////////////////

function r(theta) {

    var a = 0.105;
    return Math.pow(Math.E, a * theta);

    //const a = 1*RATIO;
    //const b = 0.1;
    //return a * Math.pow(Math.E, b * theta);
}

function round(num) {
    return 0.5 + num << 0;
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
        key: 'update',
        value: function update(centerX, centerY) {
            this.deg += DELTA_DEG;
            var rad = this.deg * Math.PI / 180;
            var range = r(rad);

            //this.size = MIN_TEXT_SIZE + (MAX_TEXT_SIZE - MIN_TEXT_SIZE) * (this.deg / MAX_DEG);       
            this.size = MIN_TEXT_SIZE + DELTA_TEXT_SIZE * range;
            this.x = centerX + range * Math.cos(rad);
            this.y = centerY + range * Math.sin(rad);
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
            this.width = window.innerWidth * RATIO;
            this.height = window.innerHeight * RATIO;

            // 引き伸ばして、       
            this.$canvas.width = this.width;
            this.$canvas.height = this.height;
            // 戻す
            this.$canvas.style.width = this.width / RATIO + 'px';
            this.$canvas.style.height = this.height / RATIO + 'px';
        }
    }, {
        key: 'initDots',
        value: function initDots() {
            this.charas = [];
            for (var i = 0; i < TEXT_LENGTH; i++) {
                var chara = new Chara({
                    text: TEXT_ARRAY[i],
                    deg: MIN_DEG + MARGIN_DEG * i
                });
                this.charas.push(chara);
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.width * RATIO, this.height * RATIO);
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

            // 背景
            this.ctx.save();
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.restore();

            // 文字
            for (var i = 0, len = this.charas.length; i < len; i++) {
                var chara = this.charas[i];

                chara.update(this.width / 2, this.height / 2);

                // 回転角
                var deg = (BASE_CHARA_DEG + chara.deg) % 360 * (Math.PI / 180);
                // 座標をテキストボックスの中心にする
                var x = chara.x + chara.size / 2;
                var y = chara.y + chara.size / 2;

                this.ctx.save();
                // とりあえず毎回設定
                this.ctx.font = chara.size + 'px \'Hiragino Mincho Pro\',\'MS Mincho\',\'TakaoMincho\'';
                this.ctx.fillStyle = 'white';

                // 文字自体の回転
                this.ctx.translate(x, y);
                this.ctx.rotate(deg);
                this.ctx.translate(-x, -y);

                this.ctx.translate(x, y);
                this.ctx.fillText(chara.text, 0, 0);
                this.ctx.translate(-x, -y);

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

