// forked from takumifukasawa's "check: pixijsのfilters(autoDetectorRenderer)" http://jsdo.it/takumifukasawa/2bd6
// forked from takumifukasawa's "check: pixijsのfilters" http://jsdo.it/takumifukasawa/wyqU
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var WIDTH = 465,
    HEIGHT = 465;

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.imageSrc = "http://jsrun.it/assets/Y/8/8/R/Y88Ra";
        this.beginTime = +new Date();

        this.scale = 2;

        this.initialize();
    }

    _createClass(Main, [{
        key: 'initialize',
        value: function initialize() {
            this.stage = new PIXI.Container();
            this.renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT, { backgroundColor: 0xFFFFFF, resolution: 2 });
            document.body.appendChild(this.renderer.view);

            this.renderer.view.style.width = WIDTH + 'px';
            this.renderer.view.style.height = HEIGHT + 'px';

            this.twistFilter = new PIXI.filters.TwistFilter();
            this.blurFilter = new PIXI.filters.BlurFilter();
            this.noiseFilter = new PIXI.filters.NoiseFilter();

            this.stage.filters = [this.twistFilter];

            this.bgRect = new PIXI.Graphics();
            this.bgRect.beginFill(0xFFFFFF);
            this.bgRect.drawRect(0, 0, WIDTH, HEIGHT);
            this.stage.addChild(this.bgRect);

            this.texture = null;
            this.texture = PIXI.Texture.fromImage(this.imageSrc);
            this.texture.baseTexture.addListener('loaded', onload.bind(this));

            function onload() {
                this.image = new PIXI.Sprite(this.texture);
                this.image.position.x = (WIDTH - this.image._texture.width) / 2;
                this.image.position.y = (HEIGHT - this.image._texture.height) / 2;
                this.image.scale = { x: 1 / this.scale, y: 1 / this.scale };
                this.stage.addChild(this.image);

                console.log(this.image);
                this.run();
            }
        }
    }, {
        key: 'update',
        value: function update() {
            var currentTime = +new Date();
            var diff = currentTime - this.beginTime;

            this.twistFilter.radius = Math.sin(diff * Math.PI / 180 / 80);
            this.twistFilter.angle = 2;
            this.twistFilter.offset.x = 0.5;
            this.twistFilter.offset.y = 0.5;

            //this.blurFilter.blur = 5*Math.sin(diff * Math.PI / 180 / 8);

            //this.noiseFilter.noise = Math.sin(diff * Math.PI / 180);

            this.renderer.render(this.stage);
        }
    }, {
        key: 'run',
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

