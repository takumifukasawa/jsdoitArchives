// forked from takumifukasawa's "[glsl] 輪っか" http://jsdo.it/takumifukasawa/0gjD
// forked from takumifukasawa's "[glsl] dissolve shader" http://jsdo.it/takumifukasawa/OfdS
"use strict";

var width = undefined,
    height = undefined,
    currentTime = undefined,
    mesh = undefined;

var wrapper = document.querySelector("#wrapper");

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
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

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

var createMesh = function createMesh(diffuseMap, heightMap) {
    var geometry = new THREE.BufferGeometry();
    var vertexPositions = [[-1.0, -1.0, 0.0], [1.0, -1.0, 0.0], [1.0, 1.0, 0.0], [-1.0, 1.0, 0.0]];
    var vertices = new Float32Array(vertexPositions.length * 3);
    var uvs = new Float32Array(8);

    for (var i = 0; i < vertexPositions.length; i++) {
        var vo = i * 3;

        vertices[vo] = vertexPositions[i][0];
        vertices[vo + 1] = vertexPositions[i][1];
        vertices[vo + 2] = vertexPositions[i][2];
    }

    uvs[0] = 0;
    uvs[1] = 0;

    uvs[2] = 1;
    uvs[3] = 0;

    uvs[4] = 1;
    uvs[5] = 1;

    uvs[6] = 0;
    uvs[7] = 1;

    var indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('uvs', new THREE.BufferAttribute(uvs, 2));

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    var material = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        alphaTest: .01,
        uniforms: {
            u_time: {
                type: "f",
                value: 0.
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
    tick();
};

createMesh();
init();

