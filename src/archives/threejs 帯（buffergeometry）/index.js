// forked from takumifukasawa's "forked: threejs: 帯（tubegeometry）" http://jsdo.it/takumifukasawa/8cbr
// forked from takumifukasawa's "threejs: 帯（tubegeometry）" http://jsdo.it/takumifukasawa/oIl4
// forked from takumifukasawa's "threejs: 3D空間のベジェ曲線上を動き続ける箱" http://jsdo.it/takumifukasawa/6QA6
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;

var beforeTime = 0;

var segments = 100;
var distance = 1000;

var vertexShader = document.querySelector('#vertexShader').textContent;
var fragmentShader = document.querySelector('#fragmentShader').textContent;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(ratio);
renderer.setClearColor(0xffffff);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var world = new THREE.Object3D();
scene.add(world);

var camera = new THREE.PerspectiveCamera(50, // fov
1, // aspect
1, // near
10000 // far
);
camera.position.set(0, 200, 2400);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0, 0, 1).normalize();
scene.add(light);

onWindowResize();
window.addEventListener('resize', onWindowResize);

var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader, fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    //blending: THREE.AdditiveBlending,
    uniforms: {
        resolution: {
            type: 'v2',
            value: new THREE.Vector2()
        }
    }
});
//material.wireframe = true;

var dummyBox = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(dummyBox);

var lines = new THREE.Mesh(getRibbonGeometry(-Math.PI * 2, 0, 0, 0, 300, 200 + 100 * Math.random()), material);
scene.add(lines);

requestAnimationFrame(update);

function getRibbonGeometry(offset, red, green, blue, thickness, r) {
    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array(segments * 2 * 3);
    var colors = new Float32Array(segments * 2 * 3);
    var normals = new Float32Array(segments * 2 * 3);
    var indices = new Uint32Array(segments * 3);

    for (var i = 0; i < segments * 3; i++) {
        indices[i * 6] = i * 2;
        indices[i * 6 + 1] = i * 2 + 1;
        indices[i * 6 + 2] = i * 2 + 2;
        indices[i * 6 + 3] = i * 2 + 1;
        indices[i * 6 + 4] = i * 2 + 2;
        indices[i * 6 + 5] = i * 2 + 3;
    }

    for (var i = 0; i < segments; i++) {
        /*
        const x = Math.cos(i*.5 + offset) * r;
        const y = Math.sin(i*.5 + offset) * r;
        const z = -i * d;
        */
        var x = -thickness / 2;
        var y = 0;
        var z = -i * distance;

        positions[i * 6] = x;
        positions[i * 6 + 1] = y;
        positions[i * 6 + 2] = z;
        positions[i * 6 + 3] = x + thickness;
        positions[i * 6 + 4] = y;
        positions[i * 6 + 5] = z;

        colors[i * 6] = red;
        colors[i * 6 + 1] = green;
        colors[i * 6 + 2] = blue;
        colors[i * 6 + 3] = red;
        colors[i * 6 + 4] = green;
        colors[i * 6 + 5] = blue;

        normals[i * 6] = 1;
        normals[i * 6 + 1] = 0;
        normals[i * 6 + 2] = 0;
        normals[i * 6 + 3] = 1;
        normals[i * 6 + 4] = 0;
        normals[i * 6 + 5] = 0;
    }

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    return geometry;
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
    var delta = currentTime - beforeTime;

    dummyBox.rotation.x += delta;
    dummyBox.rotation.y += delta;

    renderer.render(scene, camera);
    requestAnimationFrame(update);

    beforeTime = currentTime;
}

