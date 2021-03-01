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
// create particles
//---------------------------------------------------

var geometry = new THREE.BufferGeometry();

var indices = new Uint32Array(PARTICLE_NUM * 3);

for (var i = 0; i < PARTICLE_NUM; i++) {
    indices[i] = i;
}

var positions = new Float32Array(PARTICLE_NUM * 3 * 3);
var rotations = new Float32Array(PARTICLE_NUM * 3);
var times = new Float32Array(PARTICLE_NUM * 3);

for (var i = 0; i < positions.length; i += 3 * 3) {
    var pos = new THREE.Vector3(Math.random() * RADIUS - RADIUS / 2, Math.random() * RADIUS - RADIUS / 2, Math.random() * RADIUS - RADIUS / 2);

    var ax = pos.x + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;
    var ay = pos.y + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;
    var az = pos.z + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;

    var bx = pos.x + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;
    var by = pos.y + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;
    var bz = pos.z + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;

    var cx = pos.x + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;
    var cy = pos.y + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;
    var cz = pos.z + Math.random() * PARTICLE_SIZE - PARTICLE_SIZE / 2;

    positions[i] = ax;
    positions[i + 1] = ay;
    positions[i + 2] = az;

    positions[i + 3] = bx;
    positions[i + 4] = by;
    positions[i + 5] = bz;

    positions[i + 6] = cx;
    positions[i + 7] = cy;
    positions[i + 8] = cz;
}

for (var i = 0; i < rotations.length; i += 3) {
    rotations[i] = 2;
    rotations[i + 1] = 2;
    rotations[i + 2] = 2;

    var time = performance.now() * Math.random();

    times[i] = time;
    times[i + 1] = time;
    times[i + 2] = time;
}

geometry.setIndex(new THREE.BufferAttribute(indices, 1));
geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.addAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
geometry.addAttribute('times', new THREE.BufferAttribute(times, 1));

geometry.computeBoundingBox();
geometry.computeBoundingSphere();

var vertexShader = document.querySelector('#vertex-shader').textContent;
var fragmentShader = document.querySelector('#fragment-shader').textContent;

var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        u_time: {
            type: 'f',
            value: 0
        }
    }
});

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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

    material.uniforms.u_time.needsUpdate = true;
    material.uniforms.u_time.value = currentTime;

    //mesh.rotation.x += delta / 5;
    //mesh.rotation.y += delta / 50;

    beforeTime = currentTime;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

//---------------------------------------------------
// begin page
//---------------------------------------------------

onWindowResize();
requestAnimationFrame(tick);

