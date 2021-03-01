// forked from takumifukasawa's "[glsl] dissolve shader" http://jsdo.it/takumifukasawa/OfdS
"use strict";

var width = undefined,
    height = undefined,
    currentTime = undefined,
    mesh = undefined;

var vertexShader = document.querySelector("#v-shader").textContent;
var fragmentShader = document.querySelector("#f-shader").textContent;

var wrapper = document.querySelector("#wrapper");

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, 1, 1, 40000);
camera.position.set(0, 0, 12);

var directionalLight = new THREE.DirectionalLight(0xffffff, .4);
scene.add(directionalLight);
directionalLight.position.set(0, 2, 4);

var ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var geometry = null;

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

var createMesh = function createMesh() {
    geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader, fragmentShader: fragmentShader,
        transparent: true,
        alphaTest: .5,
        side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
};

var start = new THREE.Vector3(-.5, -1.5, 0);
var end = new THREE.Vector3(.5, 0, 0);
var thick = .3;

var startSphere = new THREE.Mesh(new THREE.SphereGeometry(.1), new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true
}));
scene.add(startSphere);

var endSphere = new THREE.Mesh(new THREE.SphereGeometry(.1), new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true
}));
scene.add(endSphere);

var tick = function tick(time) {
    currentTime = time / 1000;

    start.x = Math.cos(time / 800) * 3;
    end.y = 3 + Math.sin(time / 500);

    var baseRad = Math.atan2(end.y - start.y, end.x - start.x);
    var leftRad = baseRad - 90 * Math.PI / 180;
    var rightRad = baseRad + 90 * Math.PI / 180;

    var leftEdge = new THREE.Vector3(Math.cos(leftRad) * thick, Math.sin(leftRad) * thick, 0);
    var rightEdge = new THREE.Vector3(Math.cos(rightRad) * thick, Math.sin(rightRad) * thick, 0);

    geometry.vertices.forEach(function (vertice, i) {
        var newPosition = new THREE.Vector3();
        switch (i) {
            // right bottom
            case 0:
                newPosition.x = start.x + rightEdge.x;
                newPosition.y = start.y + rightEdge.y;
                newPosition.z = start.z + rightEdge.z;
                break;
            // left bottom
            case 1:
                newPosition.x = start.x + leftEdge.x;
                newPosition.y = start.y + leftEdge.y;
                newPosition.z = start.z + leftEdge.z;
                break;
            // right top
            case 2:
                newPosition.x = end.x + rightEdge.x;
                newPosition.y = end.y + rightEdge.y;
                newPosition.z = end.z + rightEdge.z;
                break;
            // left top
            case 3:
                newPosition.x = end.x + leftEdge.x;
                newPosition.y = end.y + leftEdge.y;
                newPosition.z = end.z + leftEdge.z;
                break;
        }
        vertice.copy(newPosition.clone());
    });

    startSphere.position.copy(start.clone());
    endSphere.position.copy(end.clone());

    //geometry.vertices[1].y = .5 + (Math.sin(time/1000) / 5);
    //geometry.vertices[3].y = -.5 + (Math.sin(time/500) / 5);
    geometry.verticesNeedUpdate = true;
    geometry.dynamic = true;

    var s = .9 + Math.abs(Math.sin(time / 400)) / 10;
    //mesh.scale.set(s, s, s);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

var init = function init() {
    createMesh();
    onWindowResize();
    window.addEventListener("resize", onWindowResize);
    tick();
};

init();

