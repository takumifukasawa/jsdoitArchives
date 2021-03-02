// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/W1lG
// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/ag8Z
// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/IiiF
// forked from takumifukasawa's "webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/eK2g

'use strict';

var mesh = undefined;

var content = document.querySelector('#content');
var container = document.getElementById('wrapper');

var vertexShader = document.getElementById('vertexShader').textContent;
var fragmentShader = document.getElementById('fragmentShader').textContent;

var scene = new THREE.Scene();
var camera = new THREE.Camera();
camera.position.z = 1;

var renderer = new THREE.WebGLRenderer({
    alpha: true
});
var ratio = window.devicePixelRatio || 1;
renderer.setPixelRatio(ratio);

container.appendChild(renderer.domElement);

var textureLoader = new THREE.TextureLoader();
textureLoader.load("/common/img/photo-1471070235261-d721818d0312.png", function (tex) {
    console.log(tex);
    init(tex);
});

onWindowResize();

function init(tex) {
    var geometry = new THREE.PlaneBufferGeometry(2, 2);
    var uniforms = {
        current_time: {
            type: 'f',
            value: 1.0
        },
        alpha_map: {
            type: 't',
            value: tex
        }
    };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader,
        transparent: true,
        alphaTest: .5
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    requestAnimationFrame(update);
}

function onWindowResize() {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function update(time) {
    mesh.material.uniforms.current_time.value = time;
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

