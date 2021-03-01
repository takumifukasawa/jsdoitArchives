// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/OpKp
// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/8zN5
// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/ag8Z
// forked from takumifukasawa's "forked: webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/IiiF
// forked from takumifukasawa's "webgl: threejsでglslを書く雛形" http://jsdo.it/takumifukasawa/eK2g

'use strict';

var scrollPos = 0;

var content = document.querySelector('#content');
window.addEventListener('scroll', function () {
    scrollPos = (content.offsetTop + window.scrollY) / (content.offsetHeight - window.innerHeight);
    //console.log(scrollPos);
});

var container = document.getElementById('wrapper');

var vertexShader = document.getElementById('vertexShader').textContent;
var fragmentShader = document.getElementById('fragmentShader').textContent;

var scene = new THREE.Scene();
var camera = new THREE.Camera();
camera.position.z = 1;

var geometry = new THREE.PlaneBufferGeometry(2, 2);

var uniforms = {
    current_time: {
        type: 'f',
        value: 1.0
    },
    resolution: {
        type: 'v2',
        value: new THREE.Vector2()
    },
    mouse: {
        type: 'v2',
        value: new THREE.Vector2()
    },
    scrollPos: {
        type: 'f',
        value: 0.0
    }
};

var material = new THREE.ShaderMaterial({
    uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader,
    transparent: true,
    alphaTest: .5
});

var mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

var renderer = new THREE.WebGLRenderer({
    alpha: true
});
var ratio = window.devicePixelRatio || 1;
renderer.setPixelRatio(ratio);

container.appendChild(renderer.domElement);

document.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', onWindowResize);

onWindowResize();
requestAnimationFrame(update);

function onWindowResize() {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
}

function onMouseMove(e) {
    uniforms.mouse.value.x = e.pageX / uniforms.resolution.value.x * ratio;
    uniforms.mouse.value.y = e.pageY / uniforms.resolution.value.y * ratio;
}

function update(time) {
    uniforms.current_time.value = time;
    uniforms.scrollPos.value = scrollPos;
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

