// forked from takumifukasawa's "threejs x shader: RGB shift" http://jsdo.it/takumifukasawa/05f7
// forked from takumifukasawa's "threejs: シェーダーで平面をピクピクさせる" http://jsdo.it/takumifukasawa/eNvo
// forked from takumifukasawa's "threejs: shaderMaterial で texture 貼る" http://jsdo.it/takumifukasawa/61St
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;
var card = undefined,
    geometry = undefined,
    material = null;

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
loader.load('/common/img/photo-1466220666686-90bdba318c9a.jpg', function (texture) {
    init(texture);
});

function init(texture) {
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
                value: 100.0
            },
            texture: {
                type: 't',
                value: texture
            },
            sides: {
                type: 'f',
                value: 6.0
            },
            angle: {
                type: 'f',
                value: 0
            }
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending
    });

    card = new THREE.Mesh(geometry, material);
    card.position.set(0, 0, 0);
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
    //card.rotation.x += 0.005;
    //card.rotation.z += 0.005;

    var currentTime = time / 1000;

    material.uniforms.rotZ.value = currentTime / 2;
    material.uniforms.curlR.value = 400 + 40 * Math.sin(currentTime * 50);
    material.uniforms.angle.value = time / 10 * Math.PI / 180;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

