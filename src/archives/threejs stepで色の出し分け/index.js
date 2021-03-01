// forked from takumifukasawa's "threejs: test shadermaterial" http://jsdo.it/takumifukasawa/0vG9
// forked from takumifukasawa's "threejs: 四角の箱" http://jsdo.it/takumifukasawa/2bn3

'use strict';

var vertexShader = '\nvarying vec2 v_uv;\nvoid main(void) {\n    v_uv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n';

var fragmentShader = '\nvarying vec2 v_uv;\nvoid main(void) {\n    vec2 center = vec2(.5);\n    float color = step(.5, distance(v_uv.xy, center));\n    gl_FragColor = vec4(vec3(color), 1.);\n}  \n';

var width = undefined,
    height = undefined;

var ratio = window.pixelRatio;

var wrapper = document.getElementById('wrapper');

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setClearColor(0x001224);
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
camera.position.copy(new THREE.Vector3(0, 0, 6));
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

