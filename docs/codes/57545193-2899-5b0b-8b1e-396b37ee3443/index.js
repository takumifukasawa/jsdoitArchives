'use strict';

var vertexShader = '\nvarying vec2 v_uv;\nvarying mat3 v_spriteMat;\n  \nvoid main(void) {\n  mat3 scaleMat = mat3(\n    1.0 / 4.0, 0.0, 0.0,\n    0.0, 1.0 / 4.0, 0.0,\n    0.0, 0.0, 1.0\n  );\n    \n  mat3 translateMat = mat3(\n    1.0, 0.0, 1.0,\n    0.0, 1.0, 2.0,\n    0.0, 0.0, 1.0\n  );    \n    \n  v_spriteMat = translateMat * scaleMat;\n  v_uv = uv;\n  \n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n';

var fragmentShader = '\nuniform sampler2D u_texture;\n  \nvarying vec2 v_uv;\nvarying mat3 v_spriteMat;\n\nvoid main(void) {\n  vec3 uv = vec3(v_uv, 1.0);\n  uv *= v_spriteMat;\n  vec4 smpColor = texture2D(u_texture, uv.xy / uv.z);\n\n  gl_FragColor = smpColor;\n}\n';

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
camera.position.copy(new THREE.Vector3(0, 0, 8));
camera.lookAt(new THREE.Vector3(0, 0, 0));

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var src = "/common/img/photo-1422393462206-207b0fbd8d6b.png";

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
        }
    };
    var material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide
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
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

