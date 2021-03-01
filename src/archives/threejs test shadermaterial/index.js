// forked from takumifukasawa's "threejs: 四角の箱" http://jsdo.it/takumifukasawa/2bn3

'use strict';

var vertexShader = '\nvoid main(void) {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n';

var fragmentShader = '\nvoid main(void) {\n    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}  \n';

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

var geometry = new THREE.PlaneGeometry(2, 2);

var uniforms = {};
var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
    side: THREE.DoubleSide
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

var tick = function tick() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

