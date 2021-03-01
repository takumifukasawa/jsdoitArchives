// forked from takumifukasawa's "simple random walk" http://jsdo.it/takumifukasawa/cnHx

//------------------------------------------------------
// パラメーター周り
//------------------------------------------------------

'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CELL_COLOR = 'rgba(255, 255, 255, 1.0)';

function random() {
    return Math.random() - .5;
}

function updateCell() {
    var deltaX = MOVE_DISTANCE * random();
    var deltaY = MOVE_DISTANCE * random();

    cellX += deltaX;
    cellY += deltaY;
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
    }

    //------------------------------------------------------
    // canvas作ったり
    //------------------------------------------------------

    _createClass(Material, [{
        key: 'update',
        value: function update() {
            this.px = this.x;
            this.py = this.y;

            this.x += random() * 80;
            this.y += random() * 80;
        }
    }, {
        key: 'constraint',
        value: function constraint() {
            if (this.x > width) {
                this.x = width;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.y > height) {
                this.y = height;
            }
            if (this.y < 0) {
                this.y = 0;
            }
        }
    }]);

    return Material;
})(Node);

var wrapper = document.querySelector('.wrapper');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

wrapper.appendChild(canvas);

var material = new Material();

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    material.reset();
    clearAllCanvas();
}

function onClickCanvas() {
    material.reset();
    clearAllCanvas();
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

    material.update();
    material.constraint();

    ctx.beginPath();

    ctx.strokeStyle = CELL_COLOR;

    ctx.moveTo(material.px, material.py);
    ctx.lineTo(material.x, material.y);

    ctx.closePath();

    ctx.stroke();

    currentTime = time;
    requestAnimationFrame(tick);
}

onWindowResize();
window.addEventListener('resize', onWindowResize);
canvas.addEventListener('click', onClickCanvas);
requestAnimationFrame(tick);

