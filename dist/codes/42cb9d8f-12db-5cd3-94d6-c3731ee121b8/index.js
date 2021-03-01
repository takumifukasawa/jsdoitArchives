// forked from takumifukasawa's "[2015.12.24] テキストの線をブラす" http://jsdo.it/takumifukasawa/wX8o
// forked from takumifukasawa's "[2015.12.23] threejs: shaderにopacityを渡す" http://jsdo.it/takumifukasawa/ATgk
// forked from takumifukasawa's "[2015.12.22] threejs: shaderな文字をランダムに配置 -> 文字サイズを大きくしてみる" http://jsdo.it/takumifukasawa/YmFJ
// forked from takumifukasawa's "[2015.12.19] threejs: shaderな文字をランダムに配置 -> 文字サイズを大きくしてみる" http://jsdo.it/takumifukasawa/0D05
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, win, doc) {

    "use strict";

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
        }

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
                this.run();
            }
        }, {
            key: "makeObjects",
            value: function makeObjects() {

                var text = 'use three.js : shader & texts...';
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
                this.nowTime = +new Date();
                var time = this.beginTime - this.nowTime;

                for (var i = 0, len = this.lineArray.length; i < len; i++) {
                    var uniforms = this.shaderMaterialArray[i].uniforms;
                    uniforms.amplitude.value = Math.sin(0.5 * time);
                    uniforms.color.value.offsetHSL(0.0005 * i / 2, 0, 0);
                    uniforms.opacity.value = Math.sin(0.001 * time + i);

                    var attributes = this.lineArray[i].geometry.attributes;
                    var array = attributes.displacement.array;

                    for (var s = 0, slen = array.length; s < slen; s += 3) {
                        array[s] += 0.3 * (0.5 - Math.random());
                        array[s + 1] += 0.3 * (0.5 - Math.random());
                        array[s + 2] += 0.3 * (0.5 - Math.random());
                    }

                    this.lineArray[i].rotation.y += 0.002 * (i % 3);
                    this.lineArray[i].rotation.z += 0.003 * (i % 3);

                    attributes.displacement.needsUpdate = true;
                }

                this.group.rotation.x += 0.002;
                this.group.rotation.y += 0.001;
                this.group.rotation.z += 0.003;

                this.camera.lookAt(this.scene.position);
                this.renderer.render(this.scene, this.camera);
                this.stats.update();
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

                // 変数はできるだけconst使うと汚染されない
                // アロー関数なので中身のthisはMain
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
// forked from takumifukasawa's "[2015.12.16] threejs: textにshaderをあてる" http://jsdo.it/takumifukasawa/ihYW

