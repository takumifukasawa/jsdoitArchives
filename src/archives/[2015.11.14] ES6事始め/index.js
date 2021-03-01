'use strict';

/**
 * ============================================
 *
 * クラスをつくる & 継承
 *
 * ============================================
 *
 */

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animal = (function () {
    // デフォルト引数

    function Animal() {
        var name = arguments.length <= 0 || arguments[0] === undefined ? "animal" : arguments[0];

        _classCallCheck(this, Animal);

        this._name = name;
    }

    // extends class

    _createClass(Animal, [{
        key: "sayName",
        value: function sayName() {
            console.log("this is " + this._name);
        }
    }]);

    return Animal;
})();

var Cat = (function (_Animal) {
    _inherits(Cat, _Animal);

    function Cat() {
        _classCallCheck(this, Cat);

        _get(Object.getPrototypeOf(Cat.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(Cat, [{
        key: "sayName",

        // override
        value: function sayName() {
            console.log("my name is " + this._name);
        }
    }]);

    return Cat;
})(Animal);

var animal = new Animal("neko");
animal.sayName();

var cat = new Cat("tama");
cat.sayName();

var unknown = new Animal();
unknown.sayName();

// undefinedを引数に渡すとデフォルト引数になる
var animalFalse = new Animal(false);
animalFalse.sayName();
var animalNull = new Animal(null);
animalNull.sayName();
var animalUndefined = new Animal(undefined);
animalUndefined.sayName();

/**
 * ============================================
 *
 * 可変長引数
 *
 * ============================================
 *
 */

var argFunc = function argFunc() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    args.forEach(function (x) {
        return console.log("arg num: " + x);
    });
};
argFunc(1, 2, 3, 4, 5, 6);

/**
 * ============================================
 *
 * spread operator
 *
     * 配列を展開して格納できる
 *
 * ============================================
 *
 */

var arr = [8, 11, 12];
var arrNums = [1, 2].concat(arr, [14], [20]);
console.log(arrNums);

/**
 * ============================================
 *
 * promise
 *
 * ============================================
 *
 */

function sleep(msec) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, msec);
    });
}

sleep(1000).then(function () {
    console.log("good moning. -> 1000msec");
});

