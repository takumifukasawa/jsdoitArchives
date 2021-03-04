// forked from takumifukasawa's "threejs: textureにcanvasを指定してマスク" http://jsdo.it/takumifukasawa/UM6Z
// forked from takumifukasawa's "threejs texture sprite animation : alphaMapと併用" http://jsdo.it/takumifukasawa/El2X
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
var alphaMapTexture = undefined;

var changePosition = function changePosition() {
    currentIndex++;
    if (currentIndex > maxIndex) currentIndex = 0;
    var rowIndex = Math.floor(currentIndex / row);
    var colIndex = Math.floor(currentIndex % col);
    if (texture) {
        alphaMapTexture.offset.x = 0;
        alphaMapTexture.offset.y = 0;

        texture.offset.x = 1 / row * rowIndex;
        texture.offset.y = 1 / col * colIndex;
    }
};

// load texture
var textureLoader = new THREE.TextureLoader();
textureLoader.load('/jsdoitArchives/assets/img/photo-1464054313797-e27fb58e90a9.jpg', function (sprite) {
    texture = sprite;
    texture.needsUpdate = true;
    /*
        texture.minFilter = THREE. LinearFilter;   
        texture.repeat.set(1/row, 1/col);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    */

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 0, 512, 512);

    var canvasTexture = new THREE.Texture(canvas);
    canvasTexture.needsUpdate = true;

    // plane
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(512, 512), new THREE.MeshPhongMaterial({
        map: canvasTexture,
        transparent: true,
        side: THREE.DoubleSide
    }));

    plane.position.set(0, 0, 0);
    scene.add(plane);
});

// time
var currentTime = 0;
var beforeTime = 0;
var offsetTime = 1000 / 4;

// updates & render
var update = function update(time) {
    if (time - beforeTime > offsetTime) {
        //changePosition();
        beforeTime = time;
    }

    stats.update();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);

