'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function ($, win, doc) {

    //////////////////////////////////////////////
    // main
    //////////////////////////////////////////////

    var Main = (function () {
        function Main() {
            _classCallCheck(this, Main);

            this.timer = 0;
            this.divideNum = 80;
            this.divideAdd = 10;

            this.color = { r: 255 / 2, g: 255 / 2, b: 255 / 2 };

            this.start = Date.now();
            this.beginTime = +new Date();
            this.diffTime = 0;
            this.beforeTimeDomain = 0;
            this.beforeUpdateLoop = 0;

            this.imgSrc = "/jsdoitArchives/assets/img/iYvDeqVGRbebiQv2PIJi_DSC_8407.jpeg";
        }

        _createClass(Main, [{
            key: 'initialize',
            value: function initialize() {
                this.canvas = document.getElementById('canvas');
                if (!this.canvas.getContext) throw new Error('cannot make canvas');

                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.ctx.fillStyle = 'rgb(255, 255, 255)';
                //this.loadImage();
                this.update();
            }
        }, {
            key: 'loadImage',
            value: function loadImage() {
                var _this = this;

                this.img = new Image();
                this.img.src = this.imgSrc;

                var drawImage = function drawImage() {
                    _this.resetCanvas();
                    _this.drawText();
                    _this.defImgData = _this.ctx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
                    //this.resetCanvas();
                    _this.update();
                };

                if (this.img.complete) {
                    drawImage();
                } else {
                    this.img.onload = function () {
                        drawImage();
                    };
                }
            }
        }, {
            key: 'resetCanvas',
            value: function resetCanvas() {
                this.ctx.fillStyle = "rgb(0, 0, 0)";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fill();
            }
        }, {
            key: 'drawText',
            value: function drawText() {
                this.ctx.save();
                this.ctx.fillStyle = "white";
                this.ctx.textBaseline = "middle";
                this.ctx.textAlign = "center";
                this.ctx.font = "400px 'Hiragino Mincho Pro','MS Mincho','TakaoMincho'";
                this.ctx.fillText("明", window.innerWidth / 2, window.innerHeight / 2);
                this.ctx.restore();
            }
        }, {
            key: 'drawMosaicImage',
            value: function drawMosaicImage() {
                this.ctx.save();

                var imgData = this.ctx.createImageData(this.defImgData.width, this.defImgData.height);
                imgData.data.set = this.defImgData.data;

                var dot = Math.floor(465 / this.divideNum);
                for (var y = dot, yLen = imgData.height; y < yLen; y += dot) {
                    for (var x = dot, xLen = imgData.width; x < xLen; x += dot) {
                        var i = y * 4 * imgData.width + x * 4;
                    }
                }
                this.ctx.putImageData(imgData, 0, 0);

                this.ctx.restore();
            }
        }, {
            key: 'getPixelData',
            value: function getPixelData(data, i) {
                return [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
            }
        }, {
            key: 'getRGBA',
            value: function getRGBA(pixels) {
                return "rgba(" + pixels[0] + "," + pixels[1] + "," + pixels[2] + "," + pixels[3] + ")";
            }
        }, {
            key: 'update',
            value: function update() {

                this.resetCanvas();
                this.drawText();

                this.nowTime = +new Date();
                this.diffTime = this.beginTime - this.nowTime;
            }
        }, {
            key: 'run',
            value: function run() {
                var _this2 = this;

                win.requestAnimationFrame = (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback, element) {
                        win.setTimeout(callback, 1000 / 60);
                    };
                })();

                var loop = function loop() {
                    _this2.update();
                    win.requestAnimationFrame(loop);
                };
                loop();
            }
        }]);

        return Main;
    })();

    var main = new Main();
    main.initialize();
})(jQuery, window, window.document);

