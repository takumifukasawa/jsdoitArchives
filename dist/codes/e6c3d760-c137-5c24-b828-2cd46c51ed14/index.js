// forked from takumifukasawa's "[2016.1.12] planegeometryをはためかせる" http://jsdo.it/takumifukasawa/80ya
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
            this.images = ["/common/img/photo-1434139240289-56c519f77cb0.png", "/common/img/photo-1460500063983-994d4c27756c.png", "/common/img/photo-1461295025362-7547f63dbaea.png", "/common/img/photo-1429371527702-1bfdc0eeea7d.png", "/common/img/photo-1469899324414-c72bfb4d4161.png", "/common/img/photo-1414521203994-7efc0bc37d65.png", "/common/img/photo-1482160549825-59d1b23cb208.png"];
            this.imageSrc = "/common/img/photo-1466220666686-90bdba318c9a.png";
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
                this.run();
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
                var base = 100;
                var divide = 100;
                var src = imageSrc;
                var image = new Image();
                image.src = src;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                var len = pixels.length;

                for (var i = 0; i < len / 4; i++) {
                    if (i % divide != 0) continue;
                    var pixel = this.getPixelData(pixels, i);
                    var geometry = new THREE.BoxGeometry(5, 5, 5);
                    var material = new THREE.MeshLambertMaterial({
                        color: this.getRGBA(pixel)
                    });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(base * -1 + Math.random() * base * 2, base * -1 + Math.random() * base * 2, base * -1 + Math.random() * base * 2);
                    mesh.castShadow = true;
                    this.group.add(mesh);
                }
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

                /*
                for(let k=0, len=this.group.children.length; k<len; k++) {
                    let plane = this.group.children[k];
                    plane.geometry.verticesNeedUpdate = true;
                    for(let i=0; i<x+1; i++) {
                        for(let j=0; j<y+1; j++) {
                            const index = j*(x+1)+i%(x+1);
                            let vertex = plane.geometry.vertices[index];
                            let amp = 1;
                            vertex.z = amp*Math.sin(-i/2 + time/80);
                        }
                    }
                }
                */

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
// forked from takumifukasawa's "[2016.1.11] test: planegeometryの裏面にもtexture貼る" http://jsdo.it/takumifukasawa/ypd0

