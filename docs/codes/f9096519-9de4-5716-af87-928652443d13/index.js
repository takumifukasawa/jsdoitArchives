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
            this.srcUrl = "/common/audio/jingle9.mp3";
            this.analyser = this.audioContext.createAnalyser();
            this.timeDomain = new Uint8Array(1024);

            this.run = opts.run || function () {};

            //this.initEvents();
            this.initialize();
        }

        //////////////////////////////////////////////
        // circle
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

    var Circle = (function () {
        function Circle(opts) {
            _classCallCheck(this, Circle);

            opts = opts || {};

            this.x = opts.x || 0;
            this.y = opts.y || 0;
            this.r = opts.r || 10;
            this.baseRadius = opts.baseRadius || 20;
            this.dx = opts.dx || 0;
            this.dy = opts.dy || 0;
            this.red = opts.red || 0;
            this.green = opts.green || 0;
            this.blue = opts.blue || 0;
            this.alpha = opts.alpha || 0.1;
        }

        //////////////////////////////////////////////
        // main
        //////////////////////////////////////////////

        _createClass(Circle, [{
            key: "update",
            value: function update(num) {
                this.goalRadius = num * 3;
                this.goalAlpha = num / 20;

                this.r += (this.goalRadius - this.r) / 10;
                this.alpha += (this.goalAlpha - this.alpha) / 10;

                if (this.r <= this.baseRadius) this.r = this.baseRadius;
                if (this.alpha <= 0) this.alpha = 0.2;
                if (this.alpha >= 1) this.alpha = 1;

                this.color = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
            }
        }, {
            key: "draw",
            value: function draw(ctx) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }]);

        return Circle;
    })();

    var Main = (function () {
        function Main() {
            _classCallCheck(this, Main);

            this.timer = 0;

            this.circles = [];
            this.circlesNum = 7;

            this.start = Date.now();
            this.beginTime = +new Date();
            this.diffTime = 0;
            this.beforeTimeDomain = 0;
            this.beforeUpdateLoop = 0;
        }

        _createClass(Main, [{
            key: "initialize",
            value: function initialize() {
                this.canvas = document.getElementById('canvas');
                if (!this.canvas.getContext) throw new Error('cannot make canvas');

                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;

                for (var i = 0; i < this.circlesNum; i++) {
                    var r = 50 + Math.floor(Math.random() * 100);
                    var g = 50 + Math.floor(Math.random() * 100);
                    var b = 50 + Math.floor(Math.random() * 100);
                    var a = 0.2;
                    var base = this.canvas.width / (this.circlesNum + 1);
                    var opts = {
                        x: base * (i + 1),
                        y: this.canvas.height / 2,
                        r: 20 + Math.random() * 10,
                        red: r,
                        green: g,
                        blue: b
                    };
                    this.circles.push(new Circle(opts));
                }

                this.loadAnalyser();
            }
        }, {
            key: "loadAnalyser",
            value: function loadAnalyser() {
                this.analyser = new Analyser({
                    run: this.run.bind(this)
                });
            }
        }, {
            key: "resetCanvas",
            value: function resetCanvas(ctx) {
                ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.fill();
            }
        }, {
            key: "draw",
            value: function draw() {
                var timeDomain = this.analyser.update();
                this.timer++;

                this.resetCanvas(this.ctx);

                for (var i = 0, len = this.circles.length; i < len; i++) {
                    if (this.timer % 5 === 0) this.circles[i].update(timeDomain + 10 * Math.sin(i * 20 * 180 / Math.PI));
                    this.circles[i].draw(this.ctx);
                }

                this.beforeTimeDomain = timeDomain;
                this.nowTime = +new Date();
                this.diffTime = this.beginTime - this.nowTime;
            }
        }, {
            key: "run",
            value: function run() {
                var _this3 = this;

                win.requestAnimationFrame = (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback, element) {
                        win.setTimeout(callback, 1000 / 60);
                    };
                })();

                var loop = function loop() {
                    _this3.draw();
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

