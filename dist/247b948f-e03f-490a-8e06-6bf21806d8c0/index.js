// forked from takumifukasawa's "random walk : fx, fy use cos, sin" http://jsdo.it/takumifukasawa/A6FW
// forked from takumifukasawa's "random walk : fx, fy" http://jsdo.it/takumifukasawa/88iq
// forked from takumifukasawa's "random walk : velocity" http://jsdo.it/takumifukasawa/WHfF
// forked from takumifukasawa's "simple random walk (node: 正規分布)" http://jsdo.it/takumifukasawa/06Y0
// forked from takumifukasawa's "simple random walk (node)" http://jsdo.it/takumifukasawa/ON2k
// forked from takumifukasawa's "simple random walk" http://jsdo.it/takumifukasawa/cnHx

//------------------------------------------------------
// パラメーター周り
//------------------------------------------------------

'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MATERIAL_COLOR = 'rgba(255, 255, 255, 1.0)';

var MATERIAL_NUM = 20;

function random() {
    var val = 0;
    var randomCount = 1;
    for (var i = 0; i < randomCount; i++) {
        val += Math.random() - .5;
    }
    return val / randomCount;
}

//------------------------------------------------------
// variables
//------------------------------------------------------

var cellX = undefined,
    cellY = 0;

var width = undefined,
    height = 0;
var currentTime = 0;
var elapsedTime = 0;

//------------------------------------------------------
// Nodeの基幹クラス
//------------------------------------------------------

var Node = (function () {
    function Node() {
        _classCallCheck(this, Node);

        this.x = 0;
        this.y = 0;

        this.px = 0;
        this.py = 0;
    }

    //------------------------------------------------------
    // Nodeクラス
    //------------------------------------------------------

    _createClass(Node, [{
        key: 'update',
        value: function update() {
            throw 'implement error';
        }
    }, {
        key: 'constraint',
        value: function constraint() {
            throw 'implement error';
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.x = width / 2;
            this.y = height / 2;

            this.px = this.x;
            this.py = this.y;
        }
    }]);

    return Node;
})();

var Material = (function (_Node) {
    _inherits(Material, _Node);

    function Material() {
        _classCallCheck(this, Material);

        _get(Object.getPrototypeOf(Material.prototype), 'constructor', this).call(this);

        this.v = 0;
        this.r = 0;
        this.rv = 0;

        this.friction = .95;
    }

    //------------------------------------------------------
    // canvas作ったり
    //------------------------------------------------------

    _createClass(Material, [{
        key: 'update',
        value: function update() {
            this.px = this.x;
            this.py = this.y;

            this.v += random() * 2 + .5;
            this.v *= this.friction;

            this.rv += random() * 2;
            this.rv *= this.friction;
            this.r += this.rv;

            var vx = Math.cos(this.r) * this.v;
            var vy = Math.sin(this.r) * this.v;

            this.x += vx;
            this.y += vy;
        }
    }, {
        key: 'constraint',
        value: function constraint() {
            if (this.x > width) {
                this.x = width;
                this.vx = -Math.abs(this.vx);
            }
            if (this.x < 0) {
                this.x = 0;
                this.vx = -Math.abs(this.vx);
            }
            if (this.y > height) {
                this.y = height;
                this.vy = -Math.abs(this.vy);
            }
            if (this.y < 0) {
                this.y = 0;
                this.vy = -Math.abs(this.vy);
            }
        }
    }]);

    return Material;
})(Node);

var wrapper = document.querySelector('.wrapper');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

wrapper.appendChild(canvas);

var materials = [];
for (var i = 0; i < MATERIAL_NUM; i++) {
    materials.push(new Material());
}

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    resetMaterials();
    clearAllCanvas();
}

function onClickCanvas() {
    resetMaterials();
    clearAllCanvas();
}

function resetMaterials() {
    for (var i = 0, len = materials.length; i < len; i++) {
        var material = materials[i];
        material.reset();
    }
}

function clearAllCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, .25)';
    ctx.fillRect(0, 0, width, height);
}

function tick(time) {
    elapsedTime = time - currentTime;

    clearCanvas();

    ctx.strokeStyle = MATERIAL_COLOR;

    for (var i = 0, len = materials.length; i < len; i++) {
        var material = materials[i];

        material.update();
        material.constraint();

        ctx.beginPath();

        ctx.moveTo(material.px, material.py);
        ctx.lineTo(material.x, material.y);

        ctx.closePath();

        ctx.stroke();
    }

    currentTime = time;
    requestAnimationFrame(tick);
}

onWindowResize();
window.addEventListener('resize', onWindowResize);
canvas.addEventListener('click', onClickCanvas);
requestAnimationFrame(tick);

