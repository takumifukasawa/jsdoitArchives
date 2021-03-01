// forked from takumifukasawa's " threejs: glsl grayscale" http://jsdo.it/takumifukasawa/mVKK
// forked from takumifukasawa's "threejs: sprite animation フレーム指定で「6」を表示" http://jsdo.it/takumifukasawa/2R1k
'use strict';

var vertexShader = '\nvarying vec2 v_uv;\n  \nvoid main(void) {\n  v_uv = uv;  \n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n';

var fragmentShader = '\nprecision mediump float;\n\nuniform sampler2D u_texture;\nuniform float u_time;\n  \nvarying vec2 v_uv;\n\nfloat grayscale(vec3 color) {\n    return dot(color.rgb, vec3(0.299, 0.587, 0.114));\n}\n\nvoid main(void) {\n  float duration = 3.;\n  float edge = mod(u_time / 1000. / duration, 1.);\n    \n  vec4 smpColor = texture2D(u_texture, v_uv);\n  float gray = grayscale(smpColor.rgb);\n  float alpha = 1. - smoothstep(0., .05, gray - edge);\n    \n  gl_FragColor = vec4(vec3(smpColor.xyz), alpha);\n}\n';

var width = undefined,
    height = undefined;
var texture = null;
var mesh = null;

var ratio = window.pixelRatio;

var wrapper = document.getElementById('wrapper');

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
camera.position.copy(new THREE.Vector3(0, 0, 4));
camera.lookAt(new THREE.Vector3(0, 0, 0));

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var src = 'http://jsrun.it/assets/2/d/8/n/2d8nW.jpg';

var textureLoader = new THREE.TextureLoader();
textureLoader.load(src, function (tex) {
    texture = tex;
    initMesh();
});

var initMesh = function initMesh() {
    var geometry = new THREE.PlaneGeometry(2, 2);
    var uniforms = {
        u_texture: {
            type: 't',
            value: texture
        },
        u_time: {
            type: 'f',
            value: 0
        }
    };
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide,
        transparent: true
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
};

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

var tick = function tick(time) {
    if (mesh) {
        mesh.material.uniforms.u_time.value = time;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

