// forked from takumifukasawa's "vertexShaderで拡大->回転->移動" http://jsdo.it/takumifukasawa/uzYW
// forked from takumifukasawa's "vertexShaderで拡大縮小（箱）" http://jsdo.it/takumifukasawa/MhvE
// forked from takumifukasawa's "vertexShaderでy軸に回転（箱）" http://jsdo.it/takumifukasawa/CIrj
// forked from takumifukasawa's "vertexShaderで平行移動（箱）" http://jsdo.it/takumifukasawa/k730
// forked from takumifukasawa's "[glsl] vertexShaderでscaleMatrix" http://jsdo.it/takumifukasawa/2FYC
// forked from takumifukasawa's "[glsl] 輪っか" http://jsdo.it/takumifukasawa/0gjD
// forked from takumifukasawa's "[glsl] dissolve shader" http://jsdo.it/takumifukasawa/OfdS
"use strict";

var width = undefined,
    height = undefined,
    currentTime = undefined,
    mesh = undefined;

var wrapper = document.querySelector("#wrapper");
var ratio = window.devicePixelRatio;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(ratio);
wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.Camera();
camera.position.set(0, 0, 1);

var vertexShader = document.querySelector("#v-shader").textContent;
var fragmentShader = document.querySelector("#f-shader").textContent;

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    mesh.material.uniforms.u_resolution.value.x = width * ratio;
    mesh.material.uniforms.u_resolution.value.y = height * ratio;

    renderer.setSize(width, height);
};

var createMesh = function createMesh() {
    var geometry = new THREE.PlaneBufferGeometry(2, 2);
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
    scene.add(mesh);
};

var tick = function tick(time) {
    currentTime = time;

    mesh.material.uniforms.u_time.value = currentTime;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

createMesh();
onWindowResize();
window.addEventListener("resize", onWindowResize);
tick();

