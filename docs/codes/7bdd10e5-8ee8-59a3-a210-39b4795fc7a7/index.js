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

// updates & render
var update = function update() {
    stats.update();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

// load alpha map
var alphaMapLoader = new THREE.TextureLoader();
alphaMapLoader.load('/jsdoitArchives/assets/img/photo-1414502622871-b90b0bec7b1f.png', function (alphaMapTexture) {

    // load texture
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('/jsdoitArchives/assets/img/photo-1464822759023-fed622ff2c3b.jpg', function (texture) {
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;

        // plane
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(256, 256), new THREE.MeshPhongMaterial({
            alphaMap: alphaMapTexture,
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        }));
        plane.position.set(0, 0, 0);
        scene.add(plane);
    });
});

update();

