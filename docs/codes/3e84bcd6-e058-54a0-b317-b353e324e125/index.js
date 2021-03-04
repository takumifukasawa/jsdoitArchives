'use strict';

var vertexShader = '\nuniform float u_time;\nuniform float u_startTime;\n\nvarying vec2 v_uv;\nvarying mat3 v_spriteMat;\n  \nvoid main(void) {\n  float elapsedTime = u_time - u_startTime;\n        \n  float colNum = 4.0;\n  float rowNum = 4.0;\n  float fps = 4.0;\n  float frameNum = 16.0;  \n    \n  float frameIndex = floor(mod(elapsedTime * fps, frameNum));    \n    \n  mat3 scaleMat = mat3(\n    1.0 / colNum, 0.0, 0.0,\n    0.0, 1.0 / rowNum, 0.0,\n    0.0, 0.0, 1.0\n  );\n\n  mat3 translateMat = mat3(\n    1.0, 0.0, mod(frameIndex, colNum),\n    0.0, 1.0, rowNum - (floor(frameIndex / colNum) + 1.0),\n    0.0, 0.0, 1.0\n  );    \n    \n  v_spriteMat = translateMat * scaleMat;\n  v_uv = uv;\n  \n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n';

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

var src = "/jsdoitArchives/assets/img/photo-1482160549825-59d1b23cb208.png";

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
        },
        u_startTime: {
            type: 'f',
            value: 0
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
    if (mesh) {
        mesh.material.uniforms.u_time.value = time / 1000;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);
requestAnimationFrame(tick);

