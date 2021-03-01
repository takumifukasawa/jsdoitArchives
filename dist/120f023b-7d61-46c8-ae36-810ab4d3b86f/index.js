// forked from takumifukasawa's "vertexShaderで平行移動（箱）" http://jsdo.it/takumifukasawa/k730
// forked from takumifukasawa's "[glsl] vertexShaderでscaleMatrix" http://jsdo.it/takumifukasawa/2FYC
// forked from takumifukasawa's "[glsl] 輪っか" http://jsdo.it/takumifukasawa/0gjD
// forked from takumifukasawa's "[glsl] dissolve shader" http://jsdo.it/takumifukasawa/OfdS
"use strict";

var width = undefined,
    height = undefined,
    currentTime = undefined,
    mesh = undefined;
currentTime = 0;

var ratio = 1;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setPixelRatio(ratio);
wrapper.appendChild(renderer.domElement);
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, 1, 1, 40000);
camera.position.set(0, 0, 4);

var directionalLight = new THREE.DirectionalLight(0xffffff, .4);
scene.add(directionalLight);
directionalLight.position.set(0, 2, 4);

var ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var vertexShader = document.querySelector("#v-shader").textContent;
var fragmentShader = document.querySelector("#f-shader").textContent;

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    mesh.material.uniforms.u_resolution.value.x = width * ratio;
    mesh.material.uniforms.u_resolution.value.y = height * ratio;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

var createMesh = function createMesh(diffuseMap, heightMap) {
    var geometry = new THREE.SphereBufferGeometry(1, 10, 10);
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            u_time: {
                type: "f",
                value: performance.now()
            },
            u_resolution: {
                type: "v2",
                value: new THREE.Vector2()
            }
        }
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
};

var tick = function tick(time) {
    currentTime = time;

    mesh.material.uniforms.u_time.value = currentTime;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

var init = function init() {
    onWindowResize();
    window.addEventListener("resize", onWindowResize);
    requestAnimationFrame(tick);
};

createMesh();
init();

