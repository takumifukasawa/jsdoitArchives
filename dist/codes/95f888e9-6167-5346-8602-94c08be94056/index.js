// forked from takumifukasawa's "threejs: 枝垂れ（残像）" http://jsdo.it/takumifukasawa/qcsk
// forked from takumifukasawa's "threejs: 枝垂れ（前の描画の状態を残す）" http://jsdo.it/takumifukasawa/aSSs
// forked from takumifukasawa's "threejs: 紙吹雪っぽいパーティクル" http://jsdo.it/takumifukasawa/MI1s
// forked from takumifukasawa's "禍々しい線" http://jsdo.it/takumifukasawa/AK8X
// forked from takumifukasawa's "threejs: ワイヤーフレーム状態でのパーティクル" http://jsdo.it/takumifukasawa/s2iD
// forked from takumifukasawa's "threejs: 10万個パーティクル" http://jsdo.it/takumifukasawa/gGOi
//---------------------------------------------------
// constants
//---------------------------------------------------

'use strict';

var PARTICLE_NUM = 1000;
var PARTICLE_SIZE = .8;
var RADIUS = 50;

//---------------------------------------------------
// page inits
//---------------------------------------------------

var width = undefined,
    height = undefined;
var tex = null;
var particleMesh = null;
var currentTime = 0;
var beforeTime = 0;

var ratio = window.devicePixelRatio || 1;
var wrapper = document.querySelector('.wrapper');

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
});
renderer.autoClearColor = false;
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
camera.position.z = 40;

var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xff0000, 1);
directionalLight.position.z = 100;
scene.add(directionalLight);

//---------------------------------------------------
// create particles
//---------------------------------------------------

function createParticles() {
    var geometry = new THREE.BufferGeometry();

    var indices = new Uint16Array(PARTICLE_NUM * 3 * 2);

    var positions = new Float32Array(PARTICLE_NUM * 3 * 4);
    var rotations = new Float32Array(PARTICLE_NUM * 4);
    var times = new Float32Array(PARTICLE_NUM * 4);
    var uvs = new Float32Array(PARTICLE_NUM * 2 * 4);

    for (var i = 0; i < PARTICLE_NUM; i++) {
        var io = i * 3 * 2;
        var ro = i * 4;
        var to = i * 4;
        var po = i * 3 * 4;
        var uo = i * 2 * 4;

        var pos = new THREE.Vector3(Math.random() * RADIUS - RADIUS / 2, Math.random() * RADIUS - RADIUS / 2, Math.random() * RADIUS - RADIUS / 2);

        // index
        indices[io] = i * 4;
        indices[io + 1] = i * 4 + 2;
        indices[io + 2] = i * 4 + 1;
        indices[io + 3] = i * 4 + 2;
        indices[io + 4] = i * 4 + 3;
        indices[io + 5] = i * 4 + 1;

        // rotations
        rotations[ro] = 2;
        rotations[ro + 1] = 2;
        rotations[ro + 2] = 2;
        rotations[ro + 3] = 2;

        // time
        var time = performance.now() * Math.random();
        times[to] = time;
        times[to + 1] = time;
        times[to + 2] = time;
        times[to + 3] = time;

        // positions

        // left top   
        var ax = pos.x - PARTICLE_SIZE / 2;
        var ay = pos.y + PARTICLE_SIZE / 2;
        var az = pos.z;
        positions[po] = ax;
        positions[po + 1] = ay;
        positions[po + 2] = az;

        uvs[uo] = 0;
        uvs[uo + 1] = 0;

        // right top
        var bx = pos.x + PARTICLE_SIZE / 2;
        var by = pos.y + PARTICLE_SIZE / 2;
        var bz = pos.z;
        positions[po + 3] = bx;
        positions[po + 4] = by;
        positions[po + 5] = bz;

        uvs[uo + 2] = 1;
        uvs[uo + 3] = 0;

        // left bottom
        var cx = pos.x - PARTICLE_SIZE / 2;
        var cy = pos.y - PARTICLE_SIZE / 2;
        var cz = pos.z;
        positions[po + 6] = cx;
        positions[po + 7] = cy;
        positions[po + 8] = cz;

        uvs[uo + 4] = 0;
        uvs[uo + 5] = 1;

        // right bottom
        var dx = pos.x + PARTICLE_SIZE / 2;
        var dy = pos.y - PARTICLE_SIZE / 2;
        var dz = pos.z;
        positions[po + 9] = dx;
        positions[po + 10] = dy;
        positions[po + 11] = dz;

        uvs[uo + 6] = 1;
        uvs[uo + 7] = 1;
    }

    // add attributes
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
    geometry.addAttribute('times', new THREE.BufferAttribute(times, 1));
    geometry.addAttribute('uvs', new THREE.BufferAttribute(uvs, 2));

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    console.log(geometry);

    var vertexShader = document.querySelector('#vertex-shader').textContent;
    var fragmentShader = document.querySelector('#fragment-shader').textContent;

    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: .01,
        //depthWrite: false,
        uniforms: {
            u_time: {
                type: 'f',
                value: 0
            },
            u_texture: {
                type: 't',
                value: tex
            }
        }
    });

    //wireframe: true
    particleMesh = new THREE.Mesh(geometry, material);
    scene.add(particleMesh);
}

//---------------------------------------------------
// bg inits
//---------------------------------------------------

onWindowResize();

var bgScene = new THREE.Scene();
var bgCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 10000);
var bgGeometry = new THREE.PlaneGeometry(width, height, 10, 10);
var bgMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: .5
});
var bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgScene.add(bgMesh);

//---------------------------------------------------
// page inits
//---------------------------------------------------

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    renderer.setSize(width, height);

    /*
    bgCamera.left = -width/2;
    bgCamera.top = height/2;
    bgCamera.right = width/2;
    bgCamera.bottom = -height/2;
    bgCameraBg.updateProjectionMatrix();
    */

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function tick(time) {
    currentTime = time / 1000;
    var delta = currentTime - beforeTime;

    particleMesh.material.uniforms.u_time.needsUpdate = true;
    particleMesh.material.uniforms.u_time.value = currentTime;

    //mesh.rotation.x += delta / 5;
    //mesh.rotation.y += delta / 50;

    beforeTime = currentTime;

    renderer.render(bgScene, bgCamera);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

//---------------------------------------------------
// begin page
//---------------------------------------------------

var textureLoader = new THREE.TextureLoader();
textureLoader.load('/common/img/photo-1463780324318-d1a8ddc05a11.png', function (texture) {
    tex = texture;
    createParticles();
    requestAnimationFrame(tick);
});

