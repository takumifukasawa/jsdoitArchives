// forked from takumifukasawa's "[2016.1.11] test: planegeometryの裏面にもtexture貼る" http://jsdo.it/takumifukasawa/ypd0
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
            this.images = ["/jsdoitArchives/assets/img/photo-1460499593944-39e14f96a8c6.png", "/jsdoitArchives/assets/img/photo-1460499593944-39e14f96a8c6.png", "/jsdoitArchives/assets/img/photo-1473167146081-90eecb675695.png", "/jsdoitArchives/assets/img/photo-1417716226287-2f8cd2e80274.png", "/jsdoitArchives/assets/img/photo-1451479456262-b94f205059be.png", "/jsdoitArchives/assets/img/photo-1416934625760-d56f5e79f6fe.png", "/jsdoitArchives/assets/img/photo-1471455558438-c1e9d5854d85.png"];
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

                container.appendChild(this.renderer.domElement);

                this.light = new THREE.PointLight(0xff0000, 1);
                this.light.position.set(0, 0, 200);
                this.scene.add(this.light);

                this.group = new THREE.Object3D();
                this.scene.add(this.group);

                this.controls = new THREE.OrbitControls(this.camera);

                this.makeObjects();
                //this.makeObjects();

                this.stats = new Stats();
                this.stats.domElement.style.position = "absolute";
                this.stats.domElement.style.top = "0px";
                container.appendChild(this.stats.domElement);

                win.addEventListener('resize', this.windowResize.bind(this), false);
                doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                this.run();
            }
        }, {
            key: "makeObjects",
            value: function makeObjects() {
                var base = 120;

                // letで定義すればどのfor文でも i が使えるようになる
                for (var i = 0, len = this.images.length; i < len; i++) {
                    var loader = new THREE.TextureLoader();
                    var texture = loader.load(this.images[i]);
                    texture.needsUpdate = true;
                    texture.minFilter = THREE.LinearFilter;
                    var material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide
                    });
                    var geometry = new THREE.PlaneGeometry(150, 100, 150, 100);
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(base * -1 + Math.random() * base * 2, base * -1 + Math.random() * base * 2, base * -1 + Math.random() * base * 2);
                    this.group.add(mesh);
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

                for (var k = 0, len = this.group.children.length; k < len; k++) {
                    var plane = this.group.children[k];
                    plane.geometry.verticesNeedUpdate = true;
                    for (var i = 0; i < x + 1; i++) {
                        for (var j = 0; j < y + 1; j++) {
                            var index = j * (x + 1) + i % (x + 1);
                            var vertex = plane.geometry.vertices[index];
                            var amp = 1;
                            vertex.z = amp * Math.sin(-i / 2 + time / 80);
                        }
                    }
                }

                this.controls.update();

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

