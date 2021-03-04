// forked from takumifukasawa's "threejs: シェーダーで影をつける" http://jsdo.it/takumifukasawa/w6qj
// forked from takumifukasawa's "threejs: シェーダーで平面をピクピクさせる" http://jsdo.it/takumifukasawa/eNvo
// forked from takumifukasawa's "threejs: shaderMaterial で texture 貼る" http://jsdo.it/takumifukasawa/61St
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;
var card = undefined,
    geometry = undefined,
    material = null;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
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
light.castShadow = true;
light.position.set(0, 0, 200);
scene.add(light);

var loader = new THREE.TextureLoader();
loader.load('/jsdoitArchives/assets/img/photo-1421749810611-438cc492b581.jpeg', function (texture) {
    init(texture);
});

function init(texture) {
    var vertexShader = document.querySelector('#vertexShader').textContent;
    var fragmentShader = document.querySelector('#fragmentShader').textContent;

    geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height, 20, 32);
    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader, fragmentShader: fragmentShader,
        uniforms: {
            rotZ: {
                type: 'f',
                value: Math.PI / 6
            },
            curlR: {
                type: 'f',
                value: 400.0
            },
            texture: {
                type: 't',
                value: texture
            },
            lightDirection: {
                type: 'v3',
                value: light.position
            }
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending
    });

    card = new THREE.Mesh(geometry, material);
    card.position.set(0, 0, 0);
    card.receiveShadow = true;
    card.castShadow = true;
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

    var currentTime = time / 1000;

    //material.uniforms.rotZ.value = currentTime / 2
    //material.uniforms.curlR.value = 400 + 40 * Math.sin(currentTime * 50);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

