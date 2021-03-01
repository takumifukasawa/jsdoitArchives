'use strict';

var width = undefined,
    height = undefined;
var t = undefined,
    dt = undefined;
var cube = undefined;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);

var wrapper = document.querySelector('.wrapper');
wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

// fov, aspect, near, far
var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var createCube = function createCube() {
    var geometry = new THREE.CubeGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({
        color: 0xff0000
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

var update = function update() {
    cube.rotation.y += dt;
    controls.update();
};

var render = function render() {
    renderer.render(scene, camera);
};

var tick = function tick(time) {
    if (t == null) {
        t = time / 1000;
    }
    dt = time / 1000 - t;
    t = time / 1000;
    update();
    render();
    requestAnimationFrame(tick);
};

cube = createCube();
scene.add(cube);
cube.position.set(0, 0, 0);

scene.add(directionalLight);
directionalLight.position.set(0, 1, -4);

camera.position.set(0, 0, -4);
camera.lookAt(0, 0, 0);

onWindowResize();
window.addEventListener('resize', onWindowResize);

requestAnimationFrame(tick);

