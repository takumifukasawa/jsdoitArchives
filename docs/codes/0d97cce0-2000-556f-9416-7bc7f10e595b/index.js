// forked from takumifukasawa's "threejs shaderでmask" http://jsdo.it/takumifukasawa/qRdD
// forked from takumifukasawa's "threejs texture shadermaterial" http://jsdo.it/takumifukasawa/ktnj
// forked from takumifukasawa's "threejs texture sprite animation : alphaMapと併用" http://jsdo.it/takumifukasawa/El2X
// forked from takumifukasawa's "threejs texture sprite animation" http://jsdo.it/takumifukasawa/QCp3
// forked from takumifukasawa's "threejs alpha map: 負荷テスト" http://jsdo.it/takumifukasawa/a1Jz
// forked from takumifukasawa's "threejs alpha map" http://jsdo.it/takumifukasawa/WAuB

"use strict";

var vertexShader = "\nattribute vec2 alphaMapUv;\nvarying vec2 vUv;\nvarying vec2 vAlphaMapUv;\nvoid main() {\n    vUv = uv;\n    vAlphaMapUv = alphaMapUv;\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    gl_Position = projectionMatrix * mvPosition;\n}\n";

var fragmentShader = "\nuniform sampler2D sprite;\nuniform sampler2D alphaMap;\nvarying vec2 vUv;\nvarying vec2 vAlphaMapUv;\nvoid main() {\n    vec4 textureColor = texture2D(sprite, vUv);\n    vec4 alphaMapColor = texture2D(alphaMap, vAlphaMapUv);\n    vec4 newColor = vec4(\n        textureColor.x,\n        textureColor.y,\n        textureColor.z,\n        alphaMapColor.x\n    );\n    gl_FragColor = newColor;\n}\n";

var viewerDOM = document.querySelector('#viewer');

var width = viewerDOM.offsetWidth;
var height = viewerDOM.offsetHeight;

var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
viewerDOM.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x0000ff);

viewerDOM.style.width = "";
viewerDOM.style.height = "";
renderer.setSize(width, height);

// scene
var scene = new THREE.Scene();

// camera
var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
camera.aspect = width / height;
camera.updateProjectionMatrix();
camera.position.set(0, 0, 5);
scene.add(camera);

// control
var controls = new THREE.OrbitControls(camera);

// stats
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
stats.domElement.style.left = '0px';
viewerDOM.appendChild(stats.domElement);

// light
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 10);
scene.add(light);

// plane info
var geometry = undefined;
var material = undefined;
var plane = undefined;

// change sprite position
var spriteWidth = 1024;
var spriteHeight = 1024;
var col = 8;
var row = 8;
var imageWidth = spriteWidth / col;
var imageHeight = spriteHeight / row;
var currentIndex = 0;
var maxIndex = col * row - 1;

var sprite = undefined;

var changePosition = function changePosition() {
    currentIndex++;
    if (currentIndex > maxIndex) currentIndex = 0;
    var rowIndex = Math.floor(currentIndex / row);
    var colIndex = Math.floor(currentIndex % col);

    if (plane) {
        var uv = plane.geometry.attributes.uv.array;
        uv = new Float32Array([rowIndex / row, colIndex / col, (rowIndex + 1) / row, colIndex / col, (rowIndex + 1) / row, (colIndex + 1) / col, rowIndex / 1, (colIndex + 1) / col]);
        console.log(plane.geometry.attributes.uv.array);
        plane.geometry.attributes.uv.needsUpdate = true;
    }
};

var alphaMapTextureLoader = new THREE.TextureLoader();

alphaMapTextureLoader.load('/jsdoitArchives/assets/img/photo-1417716226287-2f8cd2e80274.png', function (texture) {
    var alphaMap = texture;

    // load texture
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('/jsdoitArchives/assets/img/photo-1431492299426-2ea1ce429cc0.jpeg', function (texture) {
        sprite = texture;
        sprite.needsUpdate = true;

        // d - c
        //  |    |
        // a - b
        var vertexPositions = [[-1.0, -1.0, 0], [1.0, -1.0, 0], [1.0, 1.0, 0], [-1.0, 1.0, 0]];

        // なんかUVを逆にしないとダメ問題
        // 0 - U
        //  |
        // V
        var texcoord = new Float32Array([1 / row, 1 / col, 2 / row, 1 / col, 2 / row, 2 / col, 1 / row, 2 / col]);
        var alphaMapTexcoord = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        geometry = new THREE.BufferGeometry();

        var position = new Float32Array(vertexPositions.length * 3);
        for (var i = 0, len = vertexPositions.length; i < len; i++) {
            position[i * 3 + 0] = vertexPositions[i][0];
            position[i * 3 + 1] = vertexPositions[i][1];
            position[i * 3 + 2] = vertexPositions[i][2];
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(texcoord, 2));
        geometry.addAttribute('alphaMapUv', new THREE.BufferAttribute(alphaMapTexcoord, 2));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                sprite: {
                    type: 't', value: sprite
                },
                alphaMap: {
                    type: 't', value: alphaMap
                }
            },
            shading: THREE.FlatShading,
            blending: THREE.NormalBlending,
            side: THREE.DoubleSide,
            transparent: true
        });

        // plane
        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0, 0);
        scene.add(plane);
    });
});

// time
var currentTime = 0;
var beforeTime = 0;
var offsetTime = 1000 / 4;

// updates & render
var update = function update(time) {
    if (time - beforeTime > offsetTime) {
        //changePosition();
        beforeTime = time;
    }

    stats.update();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);

