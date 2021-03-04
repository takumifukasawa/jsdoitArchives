"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, win, doc) {

    //////////////////////////////////////////////
    // main
    //////////////////////////////////////////////

    var TEXT_DATA = "夜の踊り子";

    var Main = (function () {
        function Main() {
            _classCallCheck(this, Main);

            this.timer = 0;
            this.divideNum = 80;
            this.divideAdd = 10;

            this.color = { r: 255 / 2, g: 255 / 2, b: 255 / 2 };
            this.separatePattern = {
                blank: 11, draw: 2
            };
            this.separatePattern.sum = this.separatePattern.blank + this.separatePattern.draw;

            this.start = Date.now();
            this.beginTime = +new Date();
            this.diffTime = 0;
            this.beforeTimeDomain = 0;
            this.beforeUpdateLoop = 0;

            this.imgSrc = "/jsdoitArchives/assets/img/photo-1464013778555-8e723c2f01f8.jpg";
        }

        _createClass(Main, [{
            key: "initialize",
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
            key: "resetCanvas",
            value: function resetCanvas() {
                this.ctx.fillStyle = "rgb(0, 0, 0)";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fill();
            }
        }, {
            key: "drawText",
            value: function drawText(canvas, ctx, char) {
                ctx.save();
                ctx.fillStyle = "rgba(225, 235, 255, 0.6)";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.font = "400px 'Hiragino Mincho Pro','MS Mincho','TakaoMincho'";
                ctx.fillText(char, window.innerWidth / 2, window.innerHeight / 2);
                ctx.restore();
            }
        }, {
            key: "drawSeparateText",
            value: function drawSeparateText(canvas, ctx, pattern) {
                ctx.save();

                this.defImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var imgData = ctx.createImageData(this.defImgData.width, this.defImgData.height);
                //imgData.data.set = this.defImgData.data;

                for (var y = 0, yLen = imgData.height; y < yLen; y++) {
                    for (var x = 0, xLen = imgData.width; x < xLen; x++) {
                        var divide = Math.floor(x / pattern.sum);
                        if (pattern.sum * divide < x && x < pattern.sum * divide + pattern.blank) continue;
                        var i = (x + y * imgData.width) * 4;
                        imgData.data[i] = this.defImgData.data[i];
                        imgData.data[i + 1] = this.defImgData.data[i + 1];
                        imgData.data[i + 2] = this.defImgData.data[i + 2];
                        imgData.data[i + 3] = this.defImgData.data[i + 3];
                    }
                }

                ctx.putImageData(imgData, 0, 0);
                return canvas;
            }
        }, {
            key: "getPixelData",
            value: function getPixelData(data, i) {
                return [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
            }
        }, {
            key: "getRGBA",
            value: function getRGBA(pixels) {
                return "rgba(" + pixels[0] + "," + pixels[1] + "," + pixels[2] + "," + pixels[3] + ")";
            }
        }, {
            key: "update",
            value: function update() {

                //this.resetCanvas();

                var texts = TEXT_DATA.split("");
                var imgDatas = [];

                for (var i = 0, len = texts.length; i < len; i++) {
                    if (!texts[i]) continue;
                    var pattern = {};
                    pattern.blank = Math.floor(6 + Math.random() * 2);
                    pattern.draw = Math.floor(1 + Math.random() * 2);
                    pattern.sum = pattern.blank + pattern.draw;

                    var canvas = document.createElement('canvas');
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    var ctx = canvas.getContext('2d');
                    this.drawText(canvas, ctx, texts[i]);
                    imgDatas.push(this.drawSeparateText(canvas, ctx, pattern));
                }

                for (var i = 0, len = imgDatas.length; i < len; i++) {
                    //this.ctx.putImageData(imgDatas[i], 0, 0);
                    this.ctx.drawImage(imgDatas[i], 0, 0);
                }

                this.nowTime = +new Date();
                this.diffTime = this.beginTime - this.nowTime;
            }
        }, {
            key: "run",
            value: function run() {
                var _this = this;

                win.requestAnimationFrame = (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback, element) {
                        win.setTimeout(callback, 1000 / 60);
                    };
                })();

                var loop = function loop() {
                    _this.update();
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

