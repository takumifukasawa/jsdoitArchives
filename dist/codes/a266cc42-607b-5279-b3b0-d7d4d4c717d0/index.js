// forked from takumifukasawa's "[2016.1.20] mp3をxhrで取得 -> audio analyser" http://jsdo.it/takumifukasawa/Y13e
// forked from takumifukasawa's "[2016.1.19] xhrのresponceがundefined??" http://jsdo.it/takumifukasawa/0Ysu
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, win, doc) {

    //////////////////////////////////////////////
    // analyser
    //////////////////////////////////////////////

    var Analyser = (function () {
        function Analyser(opts) {
            _classCallCheck(this, Analyser);

            opts = opts || {};
            // audio init
            this.audioContext = new window.AudioContext();
            this.soundSource = this.audioContext.createBufferSource();
            this.source = null;
            this.audio = new Audio();
            this.srcUrl = "/common/audio/next_time.mp3";
            this.analyser = this.audioContext.createAnalyser();
            this.timeDomain = new Uint8Array(1024);

            this.run = opts.run || function () {};

            //this.initEvents();
            this.initialize();
        }

        //////////////////////////////////////////////
        // main
        //////////////////////////////////////////////

        _createClass(Analyser, [{
            key: "initialize",
            value: function initialize() {
                var _self = this;

                var request = new XMLHttpRequest();
                request.open("GET", this.srcUrl, true);
                request.responseType = 'arraybuffer';

                request.onreadystatechange = function () {
                    switch (request.readyState) {
                        case 4:
                            if (request.status == 0) {
                                console.log("miss xhr");
                            } else {
                                if (200 <= request.status && request.status < 300 || request.status == 304) {
                                    var res = request.response;
                                    _self.makeSound(request.response);
                                }
                            }
                    }
                };
                request.send();
            }
        }, {
            key: "playSound",
            value: function playSound() {
                this.soundSource.start(this.audioContext.currentTime);
            }
        }, {
            key: "stopSound",
            value: function stopSound() {
                this.soundSource.stop(this.audioContext.currentTime);
            }
        }, {
            key: "makeSound",
            value: function makeSound(audioData) {
                var _this = this;

                var _self = this;

                this.soundSource = this.audioContext.createBufferSource();
                this.audioContext.decodeAudioData(audioData, function (soundBuffer) {
                    _this.soundSource.buffer = soundBuffer;
                    _this.soundSource.connect(_this.analyser);
                    _this.analyser.connect(_this.audioContext.destination);
                    _this.playSound();
                    _this.run();
                }, function (error) {
                    console.error("decodeAudioData error", error);
                });
            }
        }, {
            key: "initEvents",
            value: function initEvents() {
                var _this2 = this;

                document.addEventListener('dragover', function (e) {
                    e.dataTransfer.dropEffect = 'copy';
                    e.stopPropagation();
                    e.preventDefault();
                });
                document.addEventListener('drop', function (e) {
                    if (_this2.source) _this2.source.stop(0);
                    _this2.audioLoad(e.dataTransfer.files[0]);
                    e.stopPropagation();
                    e.preventDefault();
                });
            }
        }, {
            key: "play",
            value: function play() {
                var source = this.audioContext.createMediaElementSource(this.audio);
                var filter = this.audioContext.createBiquadFilter();
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                //this.canvas.style.display = "block";
                this.audio.play();
                return source;
            }
        }, {
            key: "audioLoad",
            value: function audioLoad(file) {
                var fileReader = new FileReader();
                fileReader.onload = (function (e) {
                    //this.canvas.display = 'block';
                    var blob = new Blob([e.target.result], { "type": file.type });
                    this.audio.src = window.URL.createObjectURL(blob);
                    this.play();
                    this.audio.play();
                    this.run();
                }).bind(this);
                fileReader.readAsArrayBuffer(file);
            }
        }, {
            key: "update",
            value: function update() {
                this.analyser.getByteTimeDomainData(this.timeDomain);
                return this.timeDomain[0] - 128;
            }
        }]);

        return Analyser;
    })();

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

            this.imgSrc = "/common/img/photo-1433208406127-d9e1a0a1f1aa.jpeg";
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
                this.loadImage();
            }
        }, {
            key: "loadAnalyser",
            value: function loadAnalyser() {
                this.analyser = new Analyser({
                    run: this.run.bind(this)
                });
            }
        }, {
            key: "loadImage",
            value: function loadImage() {
                var _this3 = this;

                this.img = new Image();
                this.img.src = this.imgSrc;

                var drawImage = function drawImage() {
                    _this3.ctx.drawImage(_this3.img, 0, 0, _this3.canvas.width, _this3.canvas.height);
                    _this3.defImgData = _this3.ctx.getImageData(0, 0, _this3.canvas.width, _this3.canvas.height);
                    _this3.resetCanvas();
                    _this3.loadAnalyser();
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
            key: "resetCanvas",
            value: function resetCanvas() {
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fill();
            }
        }, {
            key: "drawMosaicImage",
            value: function drawMosaicImage() {
                this.ctx.save();

                this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

                var imgData = this.ctx.createImageData(this.defImgData.width, this.defImgData.height);
                imgData.data.set = this.defImgData.data;

                var dot = Math.floor(465 / this.divideNum);
                for (var y = dot, yLen = imgData.height; y < yLen; y += dot) {
                    for (var x = dot, xLen = imgData.width; x < xLen; x += dot) {
                        var i = y * 4 * imgData.width + x * 4;
                        for (var m_y = y - dot; m_y < y; m_y++) {
                            for (var m_x = x - dot; m_x < x; m_x++) {
                                var m_i = m_y * 4 * imgData.width + m_x * 4;
                                imgData.data[m_i] = this.defImgData.data[i];
                                imgData.data[m_i + 1] = this.defImgData.data[i + 1];
                                imgData.data[m_i + 2] = this.defImgData.data[i + 2];
                                imgData.data[m_i + 3] = this.defImgData.data[i + 3];
                            }
                        }
                    }
                }
                this.ctx.putImageData(imgData, 0, 0);

                this.ctx.restore();
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
                var timeDomain = this.analyser.update();
                this.timer++;

                timeDomain > this.beforeTimeDomain ? this.divideNum += this.divideAdd : this.divideNum -= this.divideAdd;
                if (this.divideNum <= 0) this.divideNum = 2;

                if (this.timer % 40 === 0) {
                    this.resetCanvas();
                    this.drawMosaicImage();
                }

                this.beforeTimeDomain = timeDomain;
                this.nowTime = +new Date();
                this.diffTime = this.beginTime - this.nowTime;
            }
        }, {
            key: "run",
            value: function run() {
                var _this4 = this;

                win.requestAnimationFrame = (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback, element) {
                        win.setTimeout(callback, 1000 / 60);
                    };
                })();

                var loop = function loop() {
                    _this4.update();
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
// forked from takumifukasawa's "[2016.1.18] threejs × audio analyser" http://jsdo.it/takumifukasawa/kUTU

