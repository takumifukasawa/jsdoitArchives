
//////////////////////////////////////
// 頂点シェーダー
//////////////////////////////////////

"use strict";

var vertexShader = "\nvoid main(void) {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

//////////////////////////////////////
// フラグメントシェーダー
//////////////////////////////////////

var red_time = "200.0";

var fragmentShader = "\n\nprecision mediump float;\n\nuniform float u_time;\n\nvoid main(void) {\n    float red = abs(cos(u_time / " + red_time + "));\n    float blue = abs(sin(u_time / 1000.));\n    gl_FragColor = vec4(red, 0.0, blue, 1.0);\n}\n";

//////////////////////////////////////
// main
//////////////////////////////////////

var width = undefined,
    height = undefined;

var wrapper = document.querySelector("#wrapper");

// renderer
var ratio = window.devicePixelRatio;
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(ratio);
renderer.setClearColor(0x000000);

// canvas追加
wrapper.appendChild(renderer.domElement);

// scene
var scene = new THREE.Scene();

// camera作る
var camera = new THREE.PerspectiveCamera(45, // 画角
1, // aspect
1, // near
10000 // far
);
scene.add(camera);
camera.position.set(0, 0, 5);

// 箱作る
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader, fragmentShader: fragmentShader,
    uniforms: {
        u_time: {
            type: "f",
            value: performance.now()
        }
    }
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);

// tick
var tick = function tick(time) {
    mesh.rotation.y = time / 1000.;

    mesh.material.uniforms.u_time.value = time;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

var onWindowResize = function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    // update camera info
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update renderer size
    renderer.setSize(width, height);
};

onWindowResize();
window.addEventListener("resize", onWindowResize);
requestAnimationFrame(tick);

