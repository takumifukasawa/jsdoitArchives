// forked from takumifukasawa's "threejs: textureにcanvasを指定してsprite animation" http://jsdo.it/takumifukasawa/2Lpe
// forked from takumifukasawa's "threejs: textureにcanvasを指定してマスク" http://jsdo.it/takumifukasawa/UM6Z
// forked from takumifukasawa's "threejs texture sprite animation : alphaMapと併用" http://jsdo.it/takumifukasawa/El2X
// forked from takumifukasawa's "threejs texture sprite animation" http://jsdo.it/takumifukasawa/QCp3
// forked from takumifukasawa's "threejs alpha map: 負荷テスト" http://jsdo.it/takumifukasawa/a1Jz
// forked from takumifukasawa's "threejs alpha map" http://jsdo.it/takumifukasawa/WAuB

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FPS = 30;

var Sprite = (function () {
    function Sprite(texture) {
        _classCallCheck(this, Sprite);

        this.texture = texture;

        // change sprite position
        this.spriteWidth = 1024;
        this.spriteHeight = 1024;
        this.col = 8;
        this.row = 8;
        this.imageWidth = this.spriteWidth / this.col;
        this.imageHeight = this.spriteHeight / this.row;
        this.currentIndex = Math.floor(Math.random(this.col * this.row));
        this.maxIndex = this.col * this.row - 1;

        // plane info
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.imageWidth;
        this.canvas.height = this.imageHeight;

        this.canvasTexture = new THREE.Texture(this.canvas);
        this.canvasTexture.needsUpdate = true;

        // make plane
        this.geometry = new THREE.PlaneGeometry(this.imageWidth, this.imageHeight);
        this.material = new THREE.MeshPhongMaterial({
            map: this.canvasTexture,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    _createClass(Sprite, [{
        key: 'update',
        value: function update(time, delta) {
            this.currentIndex++;
            if (this.currentIndex > this.maxIndex) this.currentIndex = 0;
            this.rowIndex = Math.floor(this.currentIndex / this.row);
            this.colIndex = Math.floor(this.currentIndex % this.col);

            if (this.mesh) {
                var offsetX = -this.imageWidth * this.rowIndex;
                var offsetY = -this.imageHeight * this.colIndex;

                this.ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);

                this.ctx.fillStyle = '#0000ff';
                this.ctx.beginPath();
                this.ctx.arc(this.imageWidth / 2, this.imageHeight / 2, this.imageWidth / 2, 0, 2 * Math.PI, false);

                this.ctx.fill();

                this.ctx.save();
                this.ctx.globalCompositeOperation = 'source-in';
                this.ctx.drawImage(this.texture.image, offsetX, offsetY, this.spriteWidth, this.spriteHeight);
                this.ctx.restore();

                this.canvasTexture.needsUpdate = true;
            }
        }
    }]);

    return Sprite;
})();

;

/////////////////////////////////////////////////
//
// main
//
/////////////////////////////////////////////////

var spriteMeshes = [];

var viewerDOM = document.querySelector('#viewer');

var width = viewerDOM.offsetWidth;
var height = viewerDOM.offsetHeight;

var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
viewerDOM.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xff0000);

viewerDOM.style.width = "";
viewerDOM.style.height = "";
renderer.setSize(width, height);

// scene
var scene = new THREE.Scene();

// camera
var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
camera.aspect = width / height;
camera.updateProjectionMatrix();
camera.position.set(200, 100, 500);
scene.add(camera);

// control
var controls = new THREE.OrbitControls(camera);

// stats
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
stats.domElement.style.left = '0px';
viewerDOM.appendChild(stats.domElement);

// light
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 10);
scene.add(light);

// load texture
for (var i = 0; i < 10; i++) {
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('/jsdoitArchives/assets/img/photo-1431032843361-ec2cd229c751.jpeg?+Date.now()', function (texture) {

        texture.needsUpdate = true;

        var plane = new Sprite(texture);
        plane.mesh.position.set(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * 600 - 300);
        scene.add(plane.mesh);
        spriteMeshes.push(plane);
    });
}

// time
var currentTime = 0;
var beforeTime = 0;
var offsetTime = 1000 / FPS;

// updates & render
var update = function update(time) {
    if (time - beforeTime > offsetTime) {
        for (var i = 0, len = spriteMeshes.length; i < len; i++) {
            var sprite = spriteMeshes[i];
            sprite.update();
        }
        beforeTime = time;
    }

    stats.update();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);

