"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var Arc = (function (_createjs$Shape) {
    _inherits(Arc, _createjs$Shape);

    function Arc(opts) {
        _classCallCheck(this, Arc);

        _get(Object.getPrototypeOf(Arc.prototype), "constructor", this).call(this);
        opts = opts || {};
        this.x = WIDTH / 2;
        this.y = HEIGHT / 2;
        this.radius = opts.radius || 30;
        this.alpha = opts.alpha || 1;
        this.setting = {
            startAngle: 0,
            endAngle: 0
        };
        this.initialize();
    }

    _createClass(Arc, [{
        key: "initialize",
        value: function initialize() {
            var graphics = this.graphics;
            var color = createjs.Graphics.getHSL(Math.random() * 360, 100, 40);

            var thickness = 1;
            var randomAngle = Math.random() * Math.PI * 2;
            graphics.setStrokeStyle(thickness).beginStroke(color);

            var arcCommand = graphics.arc(0, 0, this.radius, randomAngle, randomAngle).command;

            var angle = randomAngle + Math.PI * 2 * (Math.random() > 0.5 ? 1 : -1);
            var tween = createjs.Tween.get(arcCommand, { loop: true }).to({ endAngle: angle }, Math.random() * angle * 100 + 3000, createjs.Ease.easeOut).to({ startAngle: angle }, Math.random() * 1000 + 3000, createjs.Ease.easeIn);
            createjs.Tween.get(this, { loop: true }).to({ rotation: -360 }, 15000, createjs.Ease.easeOut);
        }
    }]);

    return Arc;
})(createjs.Shape);

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.initialize();
    }

    _createClass(Main, [{
        key: "initialize",
        value: function initialize() {
            this.stats = new Stats();
            this.stats.setMode(0);
            this.stats.domElement.style.position = "fixed";
            this.stats.domElement.style.top = "0";
            this.stats.domElement.style.left = "0";
            document.body.appendChild(this.stats.domElement);

            this.canvas = document.getElementById('my-canvas');

            this.canvas.width = WIDTH;
            this.canvas.height = HEIGHT;

            this.stage = new createjs.Stage(this.canvas);

            this.arcs = [];
            for (var i = 0; i < 20; i++) {
                var arc = new Arc({
                    radius: 120 + i * 4,
                    alpha: 1
                });
                this.arcs.push(arc);
                this.stage.addChild(arc);
            }

            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener('tick', this.update.bind(this));
        }
    }, {
        key: "update",
        value: function update() {
            for (var i = 0, len = this.arcs.length; i < len; i++) {
                var arc = this.arcs[i];
                //arc.update();
            }

            this.stage.update();
            this.stats.update();
        }
    }]);

    return Main;
})();

new Main();

