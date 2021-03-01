/*
var stage;
var shape = new createjs.Shape();
var modeText = new createjs.Text("monochrome", "bold 20px Arial", "#fff").set({textAlign: "center", alpha: 0.5});
var tweens = [];
var shadow = new createjs.Shadow("#000", 2, 2, 20);
var colors = ["#fff", "#f00", "#f90", "#ff0", "#0f0", "#00f", "#90f", "#f0f"];
var mode = 0;
var modeStrings = ["monochrome", "hue shift", "rainbow", "random"];
function initialize(eventObject) {
	var canvasElement = document.getElementById("canvas");
	stage = new createjs.Stage(canvasElement);
	stage.addChild(shape);
	stage.addChild(modeText);
	shape.x = modeText.x = canvasElement.width / 2;
	shape.y = modeText.y = canvasElement.height / 2;
	toggleShadow(true);
	redraw();
	createjs.Tween.get(shape, {loop: true})
	.to({rotation: -360}, 3000);
	createjs.Ticker.addEventListener("tick", stage);
}
function toggleMode() {
	mode = (mode < 3) ? mode + 1 : 0;
	modeText.text = modeStrings[mode];
	redraw();
}
function redraw() {
	var graphics = shape.graphics;
	var pi_2 = Math.PI * 2;
	var hue = Math.random() * 360;
	var total = (mode == 2) ? colors.length : (Math.random() * 15 + 10 | 0);
	graphics.clear();
	initTweens();
	shape.scaleX = shape.scaleY = 2 / total;
	for (var i = 1; i < total; i++) {
		var color = getColor(mode, total, hue, i);
		graphics.setStrokeStyle(total * 10 + Math.random() * 100)
		.beginStroke(color);
		var randomAngle = Math.random() * pi_2;
		var arcCommand = graphics.arc(0, 0, i * 100 + 100, randomAngle, randomAngle).command;
		var angle = randomAngle + pi_2 * (Math.random() > 0.33 ? 1 : -1);
		var tween = createjs.Tween.get(arcCommand, {loop: true})
		.to({endAngle: angle}, Math.random()* 1500 + 3500, createjs.Ease.easeOut)
		.to({startAngle: angle}, Math.random()* 1500 + 3500, createjs.Ease.easeIn);
		tweens[i - 1] = tween;
	}
	createjs.Tween.get(shape, {loop: true})
	.to({rotation: -360}, 15000, createjs.Ease.easeOut);
}
function initTweens() {
	var length = tweens.length;
	for (var i = 0; i < length; i++) {
		createjs.Tween.removeTweens(tweens[i].target);
	}
	tweens.length = 0;
}
function getColor(mode, total, hue, i) {
	var lum;
	switch (mode) {
		case 0:
			lum = i / total * 50 + 10;
			break;
		case 1:	
			hue = i / total * 255;
			lum = 50;
			break;
		case 2:
			return colors[i];
		case 3:
			hue = Math.random() * 360;
			lum = Math.random() * 100;
			break;
	}
	return createjs.Graphics.getHSL(hue, 100, lum);
}
function toggleShadow(show) {
	if (typeof show == "boolean") {
		shape.shadow = show ? shadow : null;
	} else {
		shape.shadow = (shape.shadow == null) ? shadow : null;
	}
}
window.addEventListener("load", initialize);
*/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var Arc = (function (_PIXI$Graphics) {
    _inherits(Arc, _PIXI$Graphics);

    function Arc(opts) {
        _classCallCheck(this, Arc);

        _get(Object.getPrototypeOf(Arc.prototype), "constructor", this).call(this);

        opts = opts || {};
        //this.position = {};
        this.x = 0;
        this.y = 0;
        this.strokeSize = opts.strokeSize || 5;

        this.data = {
            endAngle: 340
        };

        this.initialize();
    }

    _createClass(Arc, [{
        key: "initialize",
        value: function initialize() {
            //this.lineTo(200, 400);
            //this.graphics.lineStyle(3, 0xFF0000);
            this.lineStyle(10, 0xffffff);

            $(this.data).animate({
                endAngle: 0
            }, {
                duration: 10000
            });
        }
    }, {
        key: "update",
        value: function update(diff) {
            //this.clear();
            //this.beginFill(0xffffff);
            this.lineStyle(10, 0xffffff);
            this.arc(WIDTH / 2, HEIGHT / 2, 100, 0, this.data.endAngle * Math.PI / 180);
            //this.endFill();
        }
    }]);

    return Arc;
})(PIXI.Graphics);

(function ($, win, doc) {

    "use strict";

    ///////////////////////////////////////////////
    // graphics
    ///////////////////////////////////////////////   

    var Graphics = function Graphics(opt) {
        opt = opt || {};

        PIXI.Graphics.call(this);

        this.position.x = opt.x || 100;
        this.position.y = opt.y || 100;

        this.points = this.makePoints(0, 0);
        this.color = Math.random() * 0x00ff00;
    };

    Graphics.prototype = new PIXI.Graphics();

    Graphics.prototype.makePoints = function (baseX, baseY, distance) {
        var points = [];
        var t, dt, dx, dy, type;
        for (var i = 0; i < 3; i++) {
            t = Math.floor(Math.random() * 360);
            dt = Math.floor(Math.random() * 2);
            dx = Math.floor(Math.random() * 160);
            dy = Math.floor(Math.random() * 80);
            type = "tan";
            points.push({
                baseX: baseX,
                baseY: baseY,
                x: this.makePoint(baseX, dx, t, type),
                y: this.makePoint(baseY, dy, t, type),
                t: t,
                dt: dt,
                dx: dx,
                dy: dy,
                type: type
            });
        }
        return points;
    };

    // いろんな変化量を作ってみる
    Graphics.prototype.makePoint = function (base, d, t, type) {
        var c;
        switch (type) {
            case "sincos":
                c = Math.sin(t * Math.PI / 180) * Math.cos(t * Math.PI / 180) * d;
                break;
            case "tan":
                c = Math.sin(Math.tan(t * Math.PI / 180) * 0.05) * d;
                break;
            case "pow":
                c = Math.sin(Math.pow(8, Math.sin(t * Math.PI / 180)) * Math.PI / 180) * d;
                break;
            default:
                c = Math.sin(t * Math.PI / 180) * d;
                break;
        }
        return base + c;
    };

    Graphics.prototype.update = function (i) {
        var point = this.points[i];
        point.t += point.dt;

        if (point.t > 360) point.t = 0;

        point.x = this.makePoint(point.baseX, point.dx, point.t, point.type);
        point.y = this.makePoint(point.baseY, point.dy, point.t, point.type);
    };

    Graphics.prototype.render = function () {
        this.clear();

        this.beginFill(this.color, 0.6);

        for (var i = 0, len = this.points.length; i < len; i++) {
            this.update(i);

            if (i === 0) {
                this.moveTo(this.points[i].x, this.points[i].y);
                continue;
            }
            this.lineTo(this.points[i].x, this.points[i].y);
        }
    };

    ///////////////////////////////////////////////
    // main
    ///////////////////////////////////////////////   

    var Main = function Main() {
        this.graphicsNum = 10;
        this.beginTime = +new Date();
        this.arcs = [];
        this.initialize();
    };

    Main.prototype.initialize = function () {
        this.width = win.innerWidth;
        this.height = win.innerHeight;
        this.ratio = win.devicePixelRatio;

        this.$view = $("#my-canvas");
        this.$view.width(this.width).height(this.height);

        //最近のバージョンはstageを作る必要がないらしい
        //this.stage = new PIXI.Stage(0x000000);
        // this.stage.interactive = true;

        this.stage = new PIXI.Container();
        this.stage.interactive = true;

        // rendererのサイズを決める
        // resolution: 2 -> retina対応
        // antialias: true -> antialiasをオン
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
            resolution: this.ratio,
            antialias: true
        });

        // rendererのcanvasをコンテナに追加
        this.$view[0].appendChild(this.renderer.view);

        // retina対応分縮める -> でも本当は Line:123のresolutionだけでいいらしい。
        this.renderer.view.style.width = this.width + "px";
        this.renderer.view.style.height = this.height + "px";

        // グラフィクスインスタンス追加
        this.graphicsArray = [];
        var graphics;
        for (var i = 0, len = this.graphicsNum; i < len; i++) {
            graphics = new Graphics({
                x: Math.random() * this.width,
                y: Math.random() * this.height
            });
            this.graphicsArray.push(graphics);
            this.stage.addChild(graphics);
        }

        var arc = new Arc();
        this.stage.addChild(arc);
        this.arcs.push(arc);

        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = "fixed";
        this.stats.domElement.style.top = "0";
        this.stats.domElement.style.left = "0";
        doc.body.appendChild(this.stats.domElement);

        this.run();
    };

    Main.prototype.update = function () {};

    Main.prototype.render = function () {

        var currentTime = +new Date();
        var diff = currentTime - this.beginTime;

        for (var i = 0, len = this.graphicsArray.length; i < len; i++) {
            this.graphicsArray[i].render();
        }

        for (var _i = 0, _len = this.arcs.length; _i < _len; _i++) {
            var arc = this.arcs[_i];
            arc.update(diff);
        }

        this.renderer.render(this.stage);
        this.stats.update();
    };

    Main.prototype.run = function () {
        //pixiのticker。でもrequestanimationframeを使う方法が見つからなかった
        //this.ticker = PIXI.ticker.shared;
        //this.ticker.add(this.render.bind(this)); 

        // 自分でrequestanimation指定してもOK
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        var loop = (function () {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        }).bind(this);
        loop();
        //requestAnimationFrame(loop);
    };

    window.onload = function () {
        new Main();
    };
})(jQuery, window, window.document);

