// forked from takumifukasawa's "threejsでモデルを読み込んでワイヤー表示" http://jsdo.it/takumifukasawa/wBW6
// forked from takumifukasawa's "threejsでモデルを読み込む" http://jsdo.it/takumifukasawa/WKx3
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/gSaO

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MATERIALS = {
    wire: new THREE.MeshPhongMaterial({
        color: 0xffaa66,
        wireframe: true
    })
};

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.container = document.getElementById('container');

        this.getContainerSize();

        this.beginTime = +Date.now();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xccccff);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.shadowMapEnabled = true;

        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 5000);
        this.camera.position.set(0, 0, 500);
        this.scene.add(this.camera);

        this.orbitControls = new THREE.OrbitControls(this.camera);

        this.axis = new THREE.AxisHelper(2000);
        this.axis.position.set(0, 0, 0);
        this.scene.add(this.axis);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = '0px';
        this.container.appendChild(this.stats.domElement);

        this.directionalLight = new THREE.DirectionalLight(0xffffbb, 1);
        this.directionalLight.position.set(0, 10, 10);
        this.scene.add(this.directionalLight);

        this.loadObj();

        window.addEventListener('resize', this.handleWindowResize.bind(this));

        this.tick();
    }

    _createClass(Main, [{
        key: 'loadObj',
        value: function loadObj() {
            var _this = this;

            var mtlLoader = new THREE.MTLLoader();

            loadMaterial().then(loadObject).then(function (mesh) {
                mesh.position.set(0, 0, 0);
                mesh.scale.set(20, 20, 20);
                /* wire 
                for(let i=0, len=mesh.children.length; i<len; i++) {
                    mesh.children[i].material = MATERIALS.wire;
                }
                */
                _this.scene.add(mesh);
            });

            function loadMaterial() {
                return new Promise(function (resolve, reject) {
                    mtlLoader.load('http://jsrun.it/assets/k/a/T/H/kaTHL', function (materials) {
                        materials.preload();
                        resolve(materials);
                    });
                });
            }

            function loadObject(materials) {
                return new Promise(function (resolve, reject) {
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load('http://jsrun.it/assets/o/o/L/z/ooLzb', function (object) {
                        var mesh = object;
                        resolve(mesh);
                    });
                });
            }
        }
    }, {
        key: 'getContainerSize',
        value: function getContainerSize() {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
        }
    }, {
        key: 'handleWindowResize',
        value: function handleWindowResize() {
            this.getContainerSize();
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        }
    }, {
        key: 'update',
        value: function update(time) {
            var diff = time - this.beginTime;
        }
    }, {
        key: 'render',
        value: function render() {
            this.orbitControls.update();
            this.stats.update();
            this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
        }
    }, {
        key: 'tick',
        value: function tick() {
            var loop = null;

            loop = function () {
                this.update();
                this.render();
                requestAnimationFrame(loop.bind(this), +Date.now());
            };

            requestAnimationFrame(loop.bind(this), +Date.now());
        }
    }]);

    return Main;
})();

new Main();

