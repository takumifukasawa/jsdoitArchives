"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var Ball = (function (_createjs$Shape) {
    _inherits(Ball, _createjs$Shape);

    function Ball(opts) {
        _classCallCheck(this, Ball);

        opts = opts || {};

        _get(Object.getPrototypeOf(Ball.prototype), "constructor", this).call(this);
        this.radius = opts.radius || 4;
        this.x = opts.x || Math.floor(Math.random() * window.innerWidth);
        this.y = opts.y || Math.floor(Math.random() * window.innerHeight);
        this.initialize();
    }

    _createClass(Ball, [{
        key: "initialize",
        value: function initialize() {
            this.color = "rgb(255, 150, 100)";
            this.graphics.beginFill(this.color);
            this.graphics.drawCircle(0, 0, this.radius);
            this.graphics.endFill();
        }
    }]);

    return Ball;
})(createjs.Shape);

var Line = (function (_createjs$Shape2) {
    _inherits(Line, _createjs$Shape2);

    function Line(opts) {
        _classCallCheck(this, Line);

        opts = opts || {};
        _get(Object.getPrototypeOf(Line.prototype), "constructor", this).call(this);
        this.x = 0;
        this.dx = 2;
        this.y = 0;
        this.width = 2;
        this.height = HEIGHT;

        this.initialize();
    }

    _createClass(Line, [{
        key: "initialize",
        value: function initialize() {
            this.graphics.setStrokeStyle(this.width);
            this.graphics.beginStroke("rgba(255, 150, 100, 1)");
            this.graphics.moveTo(this.x, 0);
            this.graphics.lineTo(this.x, this.height);
            this.graphics.endStroke();
        }
    }, {
        key: "update",
        value: function update() {
            if (this.x > WIDTH) {
                this.x = 0;
                return;
            }
            this.x += this.dx;
        }
    }]);

    return Line;
})(createjs.Shape);

var Music = (function () {
    function Music(opts) {
        _classCallCheck(this, Music);

        opts = opts || {};

        this.audio = document.createElement('audio');
        this.audio.src = opts.src;
    }

    _createClass(Music, [{
        key: "play",
        value: function play() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.play();
        }
    }]);

    return Music;
})();

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.line = null;

        this.balls = [];
        this.ballsNum = 0;

        this.music = new Music({
            src: "/common/audio/next_time.mp3"
        });

        this.initialize();
    }

    //////////////////////

    _createClass(Main, [{
        key: "initialize",
        value: function initialize() {
            var _this = this;

            this.canvas = document.getElementById('my-canvas');

            if (!this.canvas.getContext) throw new Error('cannot get canvas');
            this.ctx = this.canvas.getContext('2d');

            this.canvas.width = WIDTH;
            this.canvas.height = HEIGHT;

            this.stage = new createjs.Stage(this.canvas);

            this.initObjects();

            this.canvas.addEventListener('click', function () {
                var ball = new Ball({ x: _this.stage.mouseX, y: _this.stage.mouseY });
                _this.balls.push(ball);
                _this.stage.addChild(ball);
            });

            this.update();
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener('tick', this.update.bind(this));
        }
    }, {
        key: "initEvent",
        value: function initEvent() {}
    }, {
        key: "initObjects",
        value: function initObjects() {
            var ball = new Ball();
            this.balls.push(ball);
            this.stage.addChild(ball);

            this.line = new Line();
            this.stage.addChild(this.line);
        }
    }, {
        key: "update",
        value: function update(event) {
            this.line.update();

            for (var i = 0, len = this.balls.length; i < len; i++) {
                if (this.line.x - 4 < this.balls[i].x && this.balls[i].x < this.line.x + 4) {
                    this.music.play();
                }
            }

            this.stage.update(event);
        }
    }, {
        key: "run",
        value: function run() {}
    }]);

    return Main;
})();

var main = undefined;

window.addEventListener('load', function () {
    main = new Main();
});

