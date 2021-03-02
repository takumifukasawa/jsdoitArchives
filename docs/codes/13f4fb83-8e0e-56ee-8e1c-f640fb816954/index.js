// forked from takumifukasawa's "threejs: 10万個パーティクル" http://jsdo.it/takumifukasawa/gGOi
//---------------------------------------------------
// constants
//---------------------------------------------------

'use strict';

var PARTICLE_NUM = 100000;
var PARTICLE_SIZE = .2;
var RADIUS = 40;

//---------------------------------------------------
// page inits
//---------------------------------------------------

var width = undefined,
    height = undefined;
var bgScene = undefined,
    bgCamera = undefined;
var line = undefined;
var currentTime = 0;
var beforeTime = 0;

var ratio = window.devicePixelRatio || 1;
var wrapper = document.querySelector('.wrapper');

var renderer = new THREE.WebGLRenderer({
    antialias: false
});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
camera.position.z = 40;

var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xff0000, 1);
directionalLight.position.z = 100;
scene.add(directionalLight);

//---------------------------------------------------
// create line
//---------------------------------------------------

function createLine() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0));
    var material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });
    line = new THREE.Line(geometry, material);
    scene.add(line);
    console.log(line);
}

//---------------------------------------------------
// create bg
//---------------------------------------------------

function createBg() {
    bgScene = new THREE.Scene();
    bgCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 0, 10000);
    var planeGeometry = new THREE.PlaneGeometry(width / 2, height / 2, 10, 10);
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacty: .25
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    bgScene.add(plane);
}

//---------------------------------------------------
// page inits
//---------------------------------------------------

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function tick(time) {
    currentTime = time / 1000;
    var delta = currentTime - beforeTime;

    beforeTime = currentTime;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

//---------------------------------------------------
// begin page
//---------------------------------------------------

onWindowResize();
createLine();
createBg();
requestAnimationFrame(tick);

