"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, win, doc) {
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

            this.color = { r: 210, g: 100, b: 100 };

            this.start = Date.now();
            this.beginTime = +new Date();
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

                this.run();
            }
        }, {
            key: "basePosition",
            value: function basePosition() {
                this.points = [];
                /*
                // ベジェ曲線を制御するpoint
                for(let i=0; i<3; i++) {
                    let point = {
                        x: Math.random()*window.innerWidth,
                        y: Math.random()*window.innerHeight,
                        z: Math.random()*window.innerWidth
                    };
                    this.points.push(point);
                }
                */

                for (var i = 0; i < 2; i++) {
                    var point = {
                        x: Math.random() * window.innerWidth / 2,
                        y: Math.random() * window.innerHeight / 2,
                        z: Math.random() * window.innerWidth / 2
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
            key: "setBezierPosition",
            value: function setBezierPosition() {
                var t = this.t;
                var tp = 1 - this.t;

                this.x = t * t * this.points.goalX + 2 * t * tp * this.points.controllX + tp * tp * this.points.beginX;
                this.y = t * t * this.points.goalY + 2 * t * tp * this.points.controllY + tp * tp * this.points.beginY;
                this.z = t * t * this.points.goalZ + 2 * t * tp * this.points.controllZ + tp * tp * this.points.beginZ;

                this.t += this.dt;
            }
        }, {
            key: "updateLine",
            value: function updateLine() {
                /*
                this.setBezierPosition();
                
                if(this.t >= 1) {
                    this.t = 0;
                    const newPoint = [
                        Math.random()*window.innerWidth/5,
                        Math.random()*window.innerHeight/5,
                        Math.random()*window.innerWidth/5
                    ];
                    this.points.shift();
                    this.points.push(newPoint);
                }
                
                var bezierPoints = {
                    beginX: (this.points[0].x + this.points[1].x) / 2,
                    beginY: (this.points[0].y + this.points[1].y) / 2,
                    beginZ: (this.points[0].z + this.points[1].z) / 2,
                    goalX: (this.points[1].x + this.points[2].x) / 2,
                    goalY: (this.points[1].y + this.points[2].y) / 2,
                    goalZ: (this.points[1].z + this.points[2].z) / 2,
                    controllX: this.points[1].x,
                    controllY: this.points[1].y,
                    controllZ: this.points[1].z
                };
                */

                var newPosition = [];

                for (var i = 0, len = this.points.length; i < len; i++) {
                    var point = this.points[i];
                    var newX = point.x * Math.sin(this.diffTime / 8 * Math.PI / 180);
                    var newY = point.y * Math.cos(this.diffTime / 10 * Math.PI / 180);
                    var newZ = point.z * Math.cos(this.diffTime / 8 * Math.PI / 180);
                    newPosition.push({
                        x: newX, y: newY, z: newZ
                    });
                }

                if (this.diffTime % 60 === 0) {
                    this.basePosition();
                }

                this.addLine(newPosition[0], newPosition[1]);

                for (var i = this.group.children.length - 1; i >= 0; i--) {
                    var object = this.group.children[i];
                    object.material.opacity -= 0.002;
                    if (object.material.opacity <= 0) this.group.remove(this.group.children[i]);
                }
            }
        }, {
            key: "update",
            value: function update() {
                this.nowTime = +new Date();
                this.diffTime = this.beginTime - this.nowTime;
                this.timer++;

                this.controls.update();

                this.updateLine();

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

