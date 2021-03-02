// forked from takumifukasawa's "threejs: test shadermaterial" http://jsdo.it/takumifukasawa/0vG9
// forked from takumifukasawa's "threejs: 四角の箱" http://jsdo.it/takumifukasawa/2bn3

'use strict';

var width = undefined,
    height = undefined;

var ratio = window.pixelRatio;

var wrapper = document.getElementById('wrapper');

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
camera.position.copy(new THREE.Vector3(0, 0, 10));
camera.lookAt(new THREE.Vector3(0, 0, 0));

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var w = 1024;
var h = 1024;
var canvas = document.createElement('canvas');
canvas.width = w;
canvas.height = h;
var ctx = canvas.getContext('2d');

var texture = new THREE.Texture(canvas);

var geometry = new THREE.PlaneGeometry(2, 2);

var material = new THREE.MeshBasicMaterial({
    map: texture
});

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

var tick = function tick(time) {
    var red = Math.floor(time / 10 % 250);
    ctx.fillStyle = 'rgb(' + red + ', 255, 255)';
    ctx.fillRect(0, 0, w, h);
    material.map.needsUpdate = true;
    //texture.needsUpdate = true;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

