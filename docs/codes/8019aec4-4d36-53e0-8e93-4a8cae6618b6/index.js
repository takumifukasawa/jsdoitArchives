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

// plane info
var geometry = undefined;
var material = undefined;

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
    if (material) {

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imageWidth;
        canvas.height = imageHeight;

        var offsetX = -imageWidth * rowIndex;
        var offsetY = -imageHeight * colIndex;

        ctx.drawImage(texture.image, offsetX, offsetY, spriteWidth, spriteHeight);

        var textureCanvas = new THREE.Texture(canvas);
        textureCanvas.needsUpdate = true;

        material.map = textureCanvas;

        /*
        ctx.fillStyle = '#0000ff';
        ctx.beginPath();
        ctx.arc(imageWidth/2, imageHeight/2, imageWidth/2, 0, 2*Math.PI, false);
        ctx.fill();
            ctx.save();    
            ctx.globalCompositeOperation = 'source-in';    
        ctx.restore();
        */
    }
};

// load texture
var textureLoader = new THREE.TextureLoader();
textureLoader.load('common/img/photo-1471455558438-c1e9d5854d85.jpeg', function (sprite) {
    texture = sprite;
    texture.needsUpdate = true;

    var canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    var canvasTexture = new THREE.Texture(canvas);
    canvasTexture.needsUpdate = true;

    geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
    material = new THREE.MeshPhongMaterial({
        map: canvasTexture,
        transparent: true,
        side: THREE.DoubleSide
    });

    // plane
    var plane = new THREE.Mesh(geometry, material);

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
        changePosition();
        beforeTime = time;
    }

    stats.update();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);

