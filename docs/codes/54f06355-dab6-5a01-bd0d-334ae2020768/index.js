// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;

var vertexShader = document.querySelector('#vertexShader').textContent;
var fragmentShader = document.querySelector('#fragmentShader').textContent;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, // fov
1, // aspect
1, // near
40000 // far
);
camera.position.set(400, 0, 1200);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1).normalize();
scene.add(light);

var loader = new THREE.TextureLoader();
loader.load('/jsdoitArchives/assets/img/photo-1474470172489-c75ce5cbf836.jpeg', function (texture) {
    init(texture);
});

function init(texture) {
    var geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height, 20, 32);
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader, fragmentShader: fragmentShader,
        uniforms: {
            texture: {
                type: 't',
                value: texture
            }
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending
    });

    var card = new THREE.Mesh(geometry, material);
    card.position.set(0, 0, -5);
    scene.add(card);

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    requestAnimationFrame(update);
}

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function update(time) {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

