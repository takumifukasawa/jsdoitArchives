"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, win, doc) {
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
            this.images = ["/jsdoitArchives/assets/img/photo-1417716226287-2f8cd2e80274.png", "/jsdoitArchives/assets/img/photo-1417870839255-a23faa90c6b0.png", "/jsdoitArchives/assets/img/photo-1418985991508-e47386d96a71.png", "/jsdoitArchives/assets/img/photo-1419064642531-e575728395f2.png", "/jsdoitArchives/assets/img/photo-1421749810611-438cc492b581.png", "/jsdoitArchives/assets/img/photo-1421986527537-888d998adb74.png", "/jsdoitArchives/assets/img/photo-1422393462206-207b0fbd8d6b.png"];
            this.imageSrc = "/jsdoitArchives/assets/img/photo-1422651355218-53453822ebb8.png";
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

                /*
                this.light = new THREE.DirectionalLight(0xff0000, 5);
                this.light.position.set(0,0,200);
                this.light.castShadow = true;
                this.scene.add(this.light);
                */

                this.group = new THREE.Object3D();
                this.scene.add(this.group);

                this.controls = new THREE.OrbitControls(this.camera);

                //this.makeObjects();

                this.getImagePixels(this.imageSrc);

                this.stats = new Stats();
                this.stats.domElement.style.position = "absolute";
                this.stats.domElement.style.top = "0px";
                container.appendChild(this.stats.domElement);

                win.addEventListener('resize', this.windowResize.bind(this), false);
                doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                //this.run();     
            }
        }, {
            key: "getPixelData",
            value: function getPixelData(data, i) {
                return [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
            }
        }, {
            key: "convert16",
            value: function convert16(value) {
                return parseInt(value).toString(16);
            }
        }, {
            key: "convert16fromPixelData",
            value: function convert16fromPixelData(pixel) {
                var r = this.convert16(pixel[0]);
                var g = this.convert16(pixel[1]);
                var b = this.convert16(pixel[2]);
                return parseInt("0x" + r + g + b, 16);
            }
        }, {
            key: "getRGBA",
            value: function getRGBA(pixels) {
                return "rgba(" + pixels[0] + "," + pixels[1] + "," + pixels[2] + "," + pixels[3] + ")";
            }
        }, {
            key: "getImagePixels",
            value: function getImagePixels(imageSrc) {
                var _this = this;

                var baseDistance = 120;
                var divide = 100;
                var baseSize = 20;
                var minSize = 2;

                var pixels = undefined;
                var src = imageSrc;
                var image = new Image();
                image.src = src;

                var makeObject = function makeObject() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0);
                    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    var len = pixels.length;
                    for (var i = 0; i < len / 4; i++) {
                        if (i % divide != 0) continue;
                        var pixel = _this.getPixelData(pixels, i);
                        var blue = pixel[2];
                        var size = baseSize;
                        if (pixel[0] > 80 || pixel[1] > 80 || pixel[3] < 200) size = minSize;
                        var geometry = new THREE.BoxGeometry(size, size, size);
                        var material = new THREE.MeshLambertMaterial({
                            color: _this.getRGBA(pixel),
                            opacity: 0.1
                        });
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.position.set(baseDistance * -1 + Math.random() * baseDistance * 2, baseDistance * -1 + Math.random() * baseDistance * 2, baseDistance * -1 + Math.random() * baseDistance * 2);
                        mesh.castShadow = true;
                        _this.group.add(mesh);
                    }

                    _this.run();
                };

                if (image.complete) {
                    makeObject();
                } else {
                    image.onload = function () {
                        makeObject();
                    };
                }
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
                var x = 150,
                    y = 100;

                /*
                this.group.rotation.x += 0.002;
                this.group.rotation.y += 0.004;
                */

                for (var i = 0, len = this.group.children.length; i < len; i++) {
                    var object = this.group.children[i];
                    object.geometry.needsUpdate = true;
                    var size = 2 * Math.sin((time + i * 100) / 20 * Math.PI / 180);
                    object.scale.set(size, size, size);
                }

                this.controls.update();

                this.camera.lookAt(this.scene.position);
                this.renderer.render(this.scene, this.camera);
                //this.stats.update();     
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

                // アロー関数なので中身のthisはMain
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

