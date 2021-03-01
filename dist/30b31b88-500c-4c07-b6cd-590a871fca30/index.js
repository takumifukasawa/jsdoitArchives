// forked from takumifukasawa's "threejs: test shadermaterial" http://jsdo.it/takumifukasawa/0vG9
// forked from takumifukasawa's "threejs: 四角の箱" http://jsdo.it/takumifukasawa/2bn3

'use strict';

var vertexShader = '\nvarying vec2 vUv;\nvoid main(void) {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n';

var fragmentShader = '\nvarying vec2 vUv;\nvoid main(void) {\n    gl_FragColor = vec4(vUv, 0.0, 1.0);\n}  \n';

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

var geometry = new THREE.PlaneGeometry(2, 8, 1, 32);

var vNum = geometry.vertices.length;

for (var i = 0; i < vNum; i++) {
    var v = geometry.vertices[i];
    v.z += Math.sin(360 / vNum * ((i + 1) / 2) * Math.PI / 180) * 4;
}

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

var tick = function tick(time) {
    controls.update();
    renderer.render(scene, camera);

    for (var i = 0; i < vNum; i++) {
        var v = geometry.vertices[i];
        v.z += Math.sin(360 / vNum * ((i + 1) / 2) * Math.PI / 180 + time / 1000) * 4;
    }
    geometry.verticesNeedsUpdate = true;

    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

