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

// updates & render
var update = function update() {
    stats.update();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

// load alpha map
var alphaMapLoader = new THREE.TextureLoader();
alphaMapLoader.load('assets/img/PlEgx5PSoiiJOmnE2izQ_NYC-skyline-empire-1.png', function (alphaMapTexture) {

    // load texture
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/img/photo-1457369804613-52c61a468e7d.jpg', function (texture) {
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;

        // plane
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(texture.image.width, texture.image.height), new THREE.MeshPhongMaterial({
            alphaMap: alphaMapTexture,
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        }));

        for (var i = 0; i < 100; i++) {
            var p = plane.clone();
            p.position.set(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
            scene.add(p);
        }
    });
});

update();

