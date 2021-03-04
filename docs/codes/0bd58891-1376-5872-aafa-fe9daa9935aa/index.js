// forked from takumifukasawa's "[2016.1.9] test: 立体に画像貼る" http://jsdo.it/takumifukasawa/qm1T
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
            this.images = ["/jsdoitArchives/assets/img/photo-1464621922360-27f3bf0eca75.png", "/jsdoitArchives/assets/img/wdXqHcTwSTmLuKOGz92L_Landscape.png", "/jsdoitArchives/assets/img/photo-1471110338536-858caa3dbe45.png", "/jsdoitArchives/assets/img/photo-1464822759023-fed622ff2c3b.png", "/jsdoitArchives/assets/img/photo-1453280339213-efb07f95531b.png", "/jsdoitArchives/assets/img/photo-1465415513839-55341da57a98.png", "/jsdoitArchives/assets/img/pelican.png"];
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

                this.makeObjects();

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
                var materials = [];
                for (var i = 0; i < 6; i++) {
                    var loader = new THREE.TextureLoader();
                    var texture = loader.load(this.images[i]);
                    texture.minFilter = THREE.LinearFilter;
                    var _material = new THREE.MeshBasicMaterial({ map: texture });
                    materials.push(_material);
                }
                var geometry = new THREE.CubeGeometry(100, 100, 100);
                var material = new THREE.MeshFaceMaterial(materials);
                var mesh = new THREE.Mesh(geometry, material);
                this.group.add(mesh);
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

                this.group.rotation.x += 0.01;
                this.group.rotation.y += 0.02;

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

