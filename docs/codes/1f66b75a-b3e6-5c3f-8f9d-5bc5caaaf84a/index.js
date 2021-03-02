// forked from takumifukasawa's "[2016.1.18] threejs × audio analyser" http://jsdo.it/takumifukasawa/kUTU
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
                request.responceType = 'arraybuffer';

                request.onreadystatechange = function () {
                    switch (request.readyState) {
                        case 4:
                            if (request.status == 0) {
                                console.log("miss xhr");
                            } else {
                                if (200 <= request.status && request.status < 300 || request.status == 304) {

                                    console.log("リクエスト成功");

                                    var res = request.responce;
                                    console.log(request, request.status, request.responce);
                                    //_self.makeSound(request.responce);
                                }
                            }
                    }
                };
                request.send();

                /*
                request.onload = function() {
                    var res = request.responce;
                    console.log(res, this.status, request.reponce);
                    _self.makeSound(request  .responce);
                };
                request.send();
                */
            }
        }, {
            key: "makeSound",
            value: function makeSound(audioData) {
                var _self = this;

                var soundSource = this.audioContext.createBufferSource();
                this.audioContext.decodeAudioData(audioData, function (soundBuffer) {
                    soundSource.buffer = soundBuffer;
                    // soundSource.connect({ _self.audioContext.destination });
                    //_self.run();
                }, function (error) {
                    console.error("decodeAudioData error", error);
                });
            }
        }, {
            key: "initEvents",
            value: function initEvents() {
                var _this = this;

                document.addEventListener('dragover', function (e) {
                    e.dataTransfer.dropEffect = 'copy';
                    e.stopPropagation();
                    e.preventDefault();
                });
                document.addEventListener('drop', function (e) {
                    if (_this.source) _this.source.stop(0);
                    _this.audioLoad(e.dataTransfer.files[0]);
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

            this.mouseX = 0;
            this.mouseY = 0;
            this.t = 0;
            this.cameraAngle = {
                x: 0,
                y: 0,
                z: 400
            };

            this.dt = 20 / 1000;

            this.basePosition();

            this.color = { r: 255 / 2, g: 255 / 2, b: 255 / 2 };

            this.start = Date.now();
            this.beginTime = +new Date();

            this.analyser = new Analyser({
                run: this.run.bind(this)
            });
        }

        _createClass(Main, [{
            key: "initialize",
            value: function initialize() {
                var container = doc.getElementById("container");

                this.camera = new THREE.PerspectiveCamera(80, win.innerWidth / win.innerHeight, 1, 10000);
                this.camera.position.z = this.cameraAngle.z;

                this.scene = new THREE.Scene();
                this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.01");
                this.scene.add(this.camera);

                this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
                this.renderer.setPixelRatio(win.devicePixelRatio);
                this.renderer.setSize(win.innerWidth, win.innerHeight);
                this.renderer.shadowMap.enabled = true;

                container.appendChild(this.renderer.domElement);

                this.ambientLight = new THREE.AmbientLight(0xffffff);
                this.ambientLight.color.multiplyScalar(0.5);
                this.scene.add(this.ambientLight);

                this.light = new THREE.DirectionalLight(0xff0000, 5);
                this.light.position.set(0, 0, 200);
                this.light.castShadow = true;
                this.scene.add(this.light);

                this.group = new THREE.Object3D();
                this.scene.add(this.group);

                this.controls = new THREE.OrbitControls(this.camera);

                this.stats = new Stats();
                this.stats.domElement.style.position = "absolute";
                this.stats.domElement.style.top = "0px";
                container.appendChild(this.stats.domElement);

                win.addEventListener('resize', this.windowResize.bind(this), false);
                doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
            }
        }, {
            key: "basePosition",
            value: function basePosition() {
                this.points = [];

                for (var i = 0; i < 2; i++) {
                    var point = {
                        x: Math.random() * window.innerWidth / 1.2,
                        y: Math.random() * window.innerHeight / 1.2,
                        z: Math.random() * window.innerWidth / 1.2
                    };
                    this.points.push(point);
                }
            }
        }, {
            key: "getVector3",
            value: function getVector3() {
                return new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
            }
        }, {
            key: "addLine",
            value: function addLine() {
                var material = new THREE.LineBasicMaterial({
                    color: "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ")",
                    transparent: true
                });

                var geometry = new THREE.Geometry();

                for (var _len = arguments.length, positions = Array(_len), _key = 0; _key < _len; _key++) {
                    positions[_key] = arguments[_key];
                }

                for (var i = 0, len = positions.length; i < len; i++) {
                    geometry.vertices.push(this.getVector3(positions[i].x, positions[i].y, positions[i].z));
                }
                var line = new THREE.Line(geometry, material);
                this.group.add(line);
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
            key: "windowResize",
            value: function windowResize() {
                this.camera.aspect = win.innerWidth / win.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(win.innerWidth, win.innerHeight);
            }
        }, {
            key: "updateMousePos",
            value: function updateMousePos(e) {
                this.mouseX = e.clientX - win.innerWidth / 2;
                this.mouseY = e.clientY - win.innerHeight / 2;
            }
        }, {
            key: "updateLine",
            value: function updateLine(data) {
                var newPosition = [];

                for (var i = 0, len = this.points.length; i < len; i++) {
                    var point = this.points[i];
                    var newX = point.x * Math.sin(this.diffTime / 6 * Math.PI / 180);
                    var newY = point.y * Math.cos(this.diffTime / 10 * Math.PI / 180);
                    var newZ = point.z * Math.cos(this.diffTime / 8 * Math.PI / 180);
                    newPosition.push({
                        x: newX, y: newY, z: newZ
                    });
                }

                this.color = {
                    r: Math.floor(150 + 100 * Math.sin(this.diffTime / 10 * 180 / Math.PI)),
                    g: Math.floor(150 + 20 * Math.cos(this.diffTime / 60 * 180 / Math.PI)),
                    b: Math.floor(150 + 20 * Math.sin(this.diffTime / 60 * 180 / Math.PI))
                };

                this.addLine(newPosition[0], newPosition[1]);

                for (var i = this.group.children.length - 1; i >= 0; i--) {
                    var object = this.group.children[i];
                    object.material.opacity -= 0.001 + data / 100;
                    if (object.material.opacity <= 0) this.group.remove(this.group.children[i]);
                }
            }
        }, {
            key: "update",
            value: function update() {
                var timeDomain = this.analyser.update();
                var data = 0.4 + timeDomain / 200;
                //let scale = this.group.scale.x;
                //scale += (data - scale) / 2
                var scale = data;

                this.nowTime = +new Date();
                this.diffTime = this.beginTime - this.nowTime;
                this.timer++;

                this.controls.update();

                this.group.rotation.x += 0.002;
                this.group.rotation.y += 0.004;
                this.group.rotation.z += 0.006;

                this.group.scale.set(scale, scale, scale);

                this.updateLine(data);

                this.camera.lookAt(this.scene.position);
                this.renderer.render(this.scene, this.camera);
                this.stats.update();
            }
        }, {
            key: "run",
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

