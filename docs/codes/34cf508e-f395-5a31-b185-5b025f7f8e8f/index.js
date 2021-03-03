// forked from takumifukasawa's "threejs texture sprite animation" http://jsdo.it/takumifukasawa/QCp3
// forked from takumifukasawa's "threejs alpha map: 負荷テスト" http://jsdo.it/takumifukasawa/a1Jz
// forked from takumifukasawa's "threejs alpha map" http://jsdo.it/takumifukasawa/WAuB

"use strict";

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

// change sprite position
var spriteWidth = 1024;
var spriteHeight = 1024;
var col = 8;
var row = 8;
var imageWidth = spriteWidth / col;
var imageHeight = spriteHeight / row;
var currentIndex = 0;
var maxIndex = col * row - 1;

var texture = undefined;

var changePosition = function changePosition() {
    currentIndex++;
    if (currentIndex > maxIndex) currentIndex = 0;
    var rowIndex = Math.floor(currentIndex / row);
    var colIndex = Math.floor(currentIndex % col);
    if (texture) {
        texture.offset.x = 1 / row * rowIndex;
        texture.offset.y = 1 / col * colIndex;
    }
};

// load alpha map
var alphaMapLoader = new THREE.TextureLoader();
alphaMapLoader.load('common/img/photo-1470338622423-81a89b56393f.png', function (alphaMapTexture) {

    // load texture
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('common/img/photo-1473864942302-4e0b5f8ce743.jpeg', function (sprite) {
        texture = sprite;
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;

        texture.repeat.set(1 / col, 1 / row);

        // plane
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(imageWidth, imageHeight), new THREE.MeshPhongMaterial({
            //alphaMap: alphaMapTexture,
            map: texture,
            side: THREE.DoubleSide
        }));

        //transparent: true
        plane.position.set(0, 0, 0);
        scene.add(plane);
    });
});

// time
var currentTime = 0;
var beforeTime = 0;
var offsetTime = 250;

// updates & render
var update = function update(time) {
    if (time - beforeTime > offsetTime) {
        changePosition();
        beforeTime = time;
    }

    stats.update();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);

