"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Preload = (function () {
    function Preload() {
        var _this = this;

        _classCallCheck(this, Preload);

        window.onload = function () {
            _this.initialize();
        };
    }

    _createClass(Preload, [{
        key: "initialize",
        value: function initialize() {
            this.$images = $("[class^=js-preload-img]");
            console.log(this.$images);
            this.queue = new createjs.LoadQueue(false);

            this.manifest = [];

            for (var i = 0, len = this.$images.length; i < len; i++) {
                var id = "js-preload-img-" + i;
                var $el = this.$images.eq(i);
                var obj = {
                    "src": $el.attr('data-src'), "id": id
                };
                $el.addClass(id);
                this.manifest.push(obj);
            }

            this.queue.addEventListener('fileload', this.handleFileLoad.bind(this));
            this.queue.addEventListener('complete', this.handleComplete.bind(this));

            this.queue.loadManifest(this.manifest, true);
        }
    }, {
        key: "handleFileLoad",
        value: function handleFileLoad(event) {
            var item = event.item;
            if (item.type === createjs.LoadQueue.IMAGE) {
                var src = event.result.src;
                var id = event.item.id;
                console.log(event);
                $("." + id).attr('src', src);
            }
        }
    }, {
        key: "handleComplete",
        value: function handleComplete(event) {}
    }]);

    return Preload;
})();

new Preload();

