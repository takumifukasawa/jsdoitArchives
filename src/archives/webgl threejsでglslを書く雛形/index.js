'use strict';

var container = document.getElementById('wrapper');

var vertexShader = document.getElementById('vertexShader').textContent;
var fragmentShader = document.getElementById('fragmentShader').textContent;

var scene = new THREE.Scene();
var camera = new THREE.Camera();
camera.position.z = 1;

var geometry = new THREE.PlaneBufferGeometry(2, 2);

var uniforms = {
    time: {
        type: 'f',
        value: 1.0
    },
    resolution: {
        type: 'v2',
        value: new THREE.Vector2()
    },
    mouse: {
        type: 'v2',
        value: new THREE.Vector2()
    }
};

var material = new THREE.ShaderMaterial({
    uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader
});

var mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

var renderer = new THREE.WebGLRenderer();
var ratio = window.devicePixelRatio || 1;
renderer.setPixelRatio(ratio);

container.appendChild(renderer.domElement);

document.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', onWindowResize);

onWindowResize();
requestAnimationFrame(update);

function onWindowResize() {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
}

function onMouseMove(e) {
    uniforms.mouse.value.x = e.pageX / uniforms.resolution.value.x * ratio;
    uniforms.mouse.value.y = e.pageY / uniforms.resolution.value.y * ratio;
}

function update(time) {
    uniforms.time.value = time / 1000;
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

