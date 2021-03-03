'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.start = +new Date();

        this.initialize();
    }

    _createClass(Main, [{
        key: 'initialize',
        value: function initialize() {
            this.container = document.createElement('div');
            document.body.appendChild(this.container);

            this.camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 10000);
            this.camera.position.z = 1000;

            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2('rgb(0, 0, 0), 0.01');
            this.scene.add(this.camera);

            this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(WIDTH, HEIGHT);

            this.container.appendChild(this.renderer.domElement);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            this.container.appendChild(this.stats.domElement);

            window.addEventListener('resize', this.windowResize.bind(this), false);
            document.addEventListener('mousemove', this.updateMousePos.bind(this), false);

            this.initObjects();
        }
    }, {
        key: 'initObjects',
        value: function initObjects() {
            var _this = this;

            this.light = new THREE.DirectionalLight(0xffffff, 0.5);
            this.light.position.set(-1, 0, 1);
            this.scene.add(this.light);

            var geometry = new THREE.CubeGeometry(200, 200, 200);
            var material = new THREE.MeshLambertMaterial({ color: 0xaa6666, wireframe: false });
            this.cube = new THREE.Mesh(geometry, material);
            this.cube.position.set(0, 0, 0);
            this.scene.add(this.cube);

            this.smokeGroup = new THREE.Object3D();
            this.scene.add(this.smokeGroup);

            var loader = new THREE.TextureLoader();
            loader.load("/jsdoitArchives/assets/img/photo-1437650128481-845e6e35bd75.png", function (texture) {
                //texture.needsUpdate = true;
                texture.minFilter = THREE.LinearFilter;
                var smokeMaterial = new THREE.MeshLambertMaterial({
                    color: 0x00dddd,
                    map: texture,
                    transparent: true
                });
                //const smokeGeometry = new THREE.PlaneGeometry(300, 300);
                var smokeGeometry = new THREE.PlaneGeometry(377, 329);

                for (var i = 0; i < 100; i++) {
                    var mesh = new THREE.Mesh(smokeGeometry, smokeMaterial);
                    mesh.position.set(Math.random() * WIDTH - WIDTH / 2, Math.random() * HEIGHT - HEIGHT / 2, Math.random() * 1000 - 100);
                    mesh.rotation.z = Math.random() * 360;
                    //this.scene.add(mesh);
                    _this.smokeGroup.add(mesh);
                }

                //this.update();
                _this.run();
            });
        }
    }, {
        key: 'windowResize',
        value: function windowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, {
        key: 'updateMousePos',
        value: function updateMousePos(e) {
            this.mouseX = e.clientX - window.innerWidth / 2;
            this.mouseY = e.clientY - window.innerHeight / 2;
        }
    }, {
        key: 'update',
        value: function update() {
            var time = +new Date();
            var delta = time - this.start;

            this.cube.rotation.x += 0.005;
            this.cube.rotation.z += 0.01;

            var group = this.smokeGroup.children;
            for (var i = 0, len = group.length; i < len; i++) {
                group[i].rotation.z = delta / 1000 * 0.2;
            }

            this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        }
    }, {
        key: 'run',
        value: function run() {
            var _this2 = this;

            window.requestAnimationFrame = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            var loop = function loop() {
                _this2.update();
                window.requestAnimationFrame(loop);
            };
            loop();
        }
    }]);

    return Main;
})();

window.onload = function () {
    new Main();
};

