"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = (function () {
    function Slider() {
        _classCallCheck(this, Slider);

        this.num = 0;
        this.maxNum = opts.maxNum;
        this.minNum = opts.minNum;
    }

    _createClass(Slider, [{
        key: "prev",
        value: function prev() {}
    }, {
        key: "next",
        value: function next() {}
    }]);

    return Slider;
})();

var slider = new Slider();

slider.next(); // 次のコンテンツに遷移
slider.prev(); // 前のコンテンツに遷移

