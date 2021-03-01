"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VoiceAnime = (function () {
    function VoiceAnime() {
        var _this = this;

        _classCallCheck(this, VoiceAnime);

        var _self = this;

        this.timer = null;
        this.timers = [];
        this.isStop = false;
        this.timersLength = 5;
        this.$spinner = $(".spinner");
        this.$spinnerChild = this.$spinner.find(".spinner__item");
        $("#button").on('click', function () {
            if (_this.$spinner.hasClass("anime")) {
                _this.stop();
            } else {
                _this.start();
            }
        });

        $(".spinner__item").on("animationend", function () {
            console.log("animationend");
            var index = $(this).index();
            _self.set(index);
            if (this.isStop) {
                this.$spinner.removeClass("anime");
                console.log("isstop");
            }
        });
    }

    _createClass(VoiceAnime, [{
        key: "start",
        value: function start() {
            this.isStop = false;
            this.beginTime = +new Date();
            for (var i = 0, len = this.timersLength; i < len; i++) {
                this.set(i);
            }
            this.$spinner.addClass("anime");
        }
    }, {
        key: "set",
        value: function set(index) {
            var _this2 = this;

            var base = 1 + Math.floor(Math.random() * 32) / 64;

            // TODO: ひとまず、interval登録の前に一回走らせる必要あるから入れている
            this.$spinnerChild.eq(index).css("animation-duration", base + "s");

            this.timers[index] = setInterval(function () {
                _this2.$spinnerChild.eq(index).css("animation-duration", base + "s");
            }, base * 1000);
        }
    }, {
        key: "stop",
        value: function stop() {
            this.isStop = true;
            //const diff = (+new Date) - this.beginTime;
            for (var i = 0, len = this.timersLength; i < len; i++) {
                clearInterval(this.timers[i]);
                this.timers[i] = null;
            }
            this.$spinner.removeClass("anime");
        }
    }]);

    return VoiceAnime;
})();

new VoiceAnime();

