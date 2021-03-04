// forked from takumifukasawa's "check: pixijsのfilters(autoDetectorRenderer)" http://jsdo.it/takumifukasawa/2bd6
// forked from takumifukasawa's "check: pixijsのfilters" http://jsdo.it/takumifukasawa/wyqU
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WIDTH = 465,
    HEIGHT = 465;

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.imageSrc = "/jsdoitArchives/assets/img/photo-1482351403047-56c184e23fe1.png";
        this.beginTime = +new Date();

        this.initialize();
    }

    _createClass(Main, [{
        key: "initialize",
        value: function initialize() {
            this.stage = new PIXI.Container();
            this.renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT, { backgroundColor: 0xFFFFFF });
            document.body.appendChild(this.renderer.view);

            this.bgRect = new PIXI.Graphics();
            this.bgRect.beginFill(0xFFFFFF);
            this.bgRect.drawRect(0, 0, WIDTH, HEIGHT);
            this.stage.addChild(this.bgRect);

            this.texture = null;
            this.texture = PIXI.Texture.fromImage(this.imageSrc);
            this.texture.baseTexture.addListener('loaded', onload.bind(this));

            function onload() {
                this.image = new PIXI.extras.TilingSprite(this.texture, 180, 1);
                this.image.position.x = (WIDTH - this.image._texture.width) / 2;
                this.image.position.y = (HEIGHT - this.image._texture.height) / 2;

                this.image.rotation = 45 * Math.PI / 180;

                this.stage.addChild(this.image);
                this.run();
                console.log(this.image);
            }
        }
    }, {
        key: "update",
        value: function update() {
            var currentTime = +new Date();
            var diff = currentTime - this.beginTime;

            this.image._width = 100 + 50 * Math.sin(diff * Math.PI / 180 / 10);

            //this.noiseFilter.noise = Math.sin(diff * Math.PI / 180);

            this.renderer.render(this.stage);
        }
    }, {
        key: "run",
        value: function run() {
            var _self = this;
            var update = function update() {
                _self.update();
                requestAnimationFrame(update);
            };

            update();
        }
    }]);

    return Main;
})();

new Main();

