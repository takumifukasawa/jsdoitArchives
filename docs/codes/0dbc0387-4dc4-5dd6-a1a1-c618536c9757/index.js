// forked from takumifukasawa's "forked: [2016.1.24] ポップなサウンドビジュアライゼーション" http://jsdo.it/takumifukasawa/uMjv
// forked from takumifukasawa's "[2016.1.24] ポップなサウンドビジュアライゼーション" http://jsdo.it/takumifukasawa/S1bD
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
            this.srcUrl = "/jsdoitArchives/assets/audio/next_time.mp3";
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

            this.mouseX = 0;
            this.mouseY = 0;
            this.timer = 0;
            this.cameraAngle = {
                x: 0,
                y: 0,
                z: 300
            };
            this.start = Date.now();
            this.beginTime = +new Date();

            this.initialize();
        }

        // end main class

        _createClass(Main, [{
            key: "initialize",
            value: function initialize() {
                this.container = doc.getElementById("container");

                this.camera = new THREE.PerspectiveCamera(80, win.innerWidth / win.innerHeight, 1, 10000);
                this.camera.position.z = this.cameraAngle.z;

                this.scene = new THREE.Scene();
                this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.01");
                this.scene.add(this.camera);

                this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
                this.renderer.setPixelRatio(win.devicePixelRatio);
                this.renderer.setSize(win.innerWidth, win.innerHeight);

                this.container.appendChild(this.renderer.domElement);

                this.light = new THREE.DirectionalLight(0xffffff);
                this.light.position.set(200, 500, 400);
                this.scene.add(this.light);

                this.group = new THREE.Object3D();

                this.makeObjects();

                this.stats = new Stats();
                this.stats.domElement.style.position = "absolute";
                this.stats.domElement.style.top = "0px";
                this.container.appendChild(this.stats.domElement);

                win.addEventListener('resize', this.windowResize.bind(this), false);
                doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);

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
            key: "makeObjects",
            value: function makeObjects() {

                var text = 'use three.js : shader & texts... and more';
                this.textArray = text.split('');

                this.textGeometryArray = [];
                this.verticesArray = [];
                this.colorArray = [];
                this.bufferGeometryArray = [];
                this.shaderMaterialArray = [];
                this.textOptsArray = [];
                this.lineArray = [];

                for (var t = 0, tlen = this.textArray.length; t < tlen; t++) {
                    if (this.textArray[t] === " ") continue;
                    var shaderMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            time: {
                                type: 'f',
                                value: 0.0
                            },
                            index: {
                                type: 'f',
                                value: 0.0
                            },
                            resolution: {
                                type: 'v2',
                                value: new THREE.Vector2()
                            },
                            amplitude: {
                                type: 'f',
                                value: 5.0
                            },
                            opacity: {
                                type: 'f',
                                value: 0.3
                            },
                            color: {
                                type: 'c',
                                value: new THREE.Color(0xff0000)
                            }
                        },
                        vertexShader: doc.getElementById('vertexshader').textContent,
                        fragmentShader: doc.getElementById('fragmentshader').textContent,
                        blending: THREE.AdditiveBlending,
                        depthTest: false,
                        transparent: true
                    });
                    this.shaderMaterialArray.push(shaderMaterial);

                    var textOpts = {
                        size: 100,
                        height: 15,
                        curveSegments: 10,
                        font: 'helvetiker',
                        bevelThickness: 1,
                        bevelSize: 1,
                        bevelEnabled: true,
                        bevelSegments: 1,
                        steps: 4
                    };
                    this.textOptsArray.push(textOpts);

                    var textGeometry = new THREE.TextGeometry(this.textArray[t], textOpts);
                    this.textGeometryArray.push(textGeometry);

                    var vertices = textGeometry.vertices;
                    this.verticesArray.push(vertices);

                    var bufferGeometry = new THREE.BufferGeometry();

                    var position = new THREE.Float32Attribute(vertices.length * 3, 3).copyVector3sArray(vertices);
                    bufferGeometry.addAttribute('position', position);

                    var displacement = new THREE.Float32Attribute(vertices.length * 3, 3);
                    bufferGeometry.addAttribute('displacement', displacement);

                    var customColor = new THREE.Float32Attribute(vertices.length * 3, 3);
                    bufferGeometry.addAttribute('customColor', customColor);

                    this.bufferGeometryArray.push(bufferGeometry);

                    var color = new THREE.Color(0xffffff);

                    for (var i = 0, len = customColor.count; i < len; i++) {
                        color.setHSL(i / len, 0.5, 0.5);
                        color.toArray(customColor.array, i * customColor.itemSize);
                    }
                    this.colorArray.push(color);

                    var line = new THREE.Line(bufferGeometry, shaderMaterial);
                    line.position.set(-100 + Math.random() * 200, -100 + Math.random() * 200, -100 + Math.random() * 200);
                    line.rotation.set(Math.random(), Math.random(), Math.random());
                    this.lineArray.push(line);
                    this.group.add(line);
                }
                this.scene.add(this.group);
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
            key: "update",
            value: function update() {
                var timeDomain = this.analyser.update();

                this.nowTime = +new Date();
                var time = this.beginTime - this.nowTime;

                for (var i = 0, len = this.lineArray.length; i < len; i++) {
                    var uniforms = this.shaderMaterialArray[i].uniforms;
                    uniforms.amplitude.value = timeDomain / 20;
                    uniforms.color.value.offsetHSL(0.0005 * i / 2, 0, 0);
                    uniforms.opacity.value = Math.sin(0.001 * time + i);

                    var attributes = this.lineArray[i].geometry.attributes;
                    var array = attributes.displacement.array;

                    for (var s = 0, slen = array.length; s < slen; s += 3) {
                        array[s] += 0.3 * (0.5 - Math.random());
                        array[s + 1] += 0.3 * (0.5 - Math.random());
                        array[s + 2] += 0.3 * (0.5 - Math.random());
                    }

                    this.lineArray[i].rotation.y += 0.006 * (i % 3);
                    this.lineArray[i].rotation.z += 0.003 * (i % 3);

                    var scale = 1 + 2 * Math.sin(timeDomain / 400);
                    this.lineArray[i].scale.set(scale, scale, scale);

                    attributes.displacement.needsUpdate = true;
                }

                this.group.rotation.x += 0.003;
                this.group.rotation.y += 0.002;
                this.group.rotation.z += 0.001;

                //this.camera.position.x += (this.mouseX - this.camera.position.x)*0.02;
                //this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.02;     

                this.camera.lookAt(this.scene.position);
                this.renderer.render(this.scene, this.camera);
                this.stats.update();
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
                    _this3.update();
                    win.requestAnimationFrame(loop);
                };
                loop();
            }
        }]);

        return Main;
    })();

    var main = new Main();
})(jQuery, window, window.document);
// forked from takumifukasawa's "[2016.1.18] threejs × audio analyser" http://jsdo.it/takumifukasawa/kUTU

