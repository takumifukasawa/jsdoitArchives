// forked from takumifukasawa's "threejs texture sprite animation : alphaMapと併用" http://jsdo.it/takumifukasawa/El2X
// forked from takumifukasawa's "threejs texture sprite animation" http://jsdo.it/takumifukasawa/QCp3
// forked from takumifukasawa's "threejs alpha map: 負荷テスト" http://jsdo.it/takumifukasawa/a1Jz
// forked from takumifukasawa's "threejs alpha map" http://jsdo.it/takumifukasawa/WAuB

"use strict";

var vertexShader = "\nvarying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    gl_Position = projectionMatrix * mvPosition;\n}\n";

var fragmentShader = "\nuniform sampler2D sprite;\nuniform sampler2D alphaMap;\nvarying vec2 vUv;\nvoid main() {\n    vec4 textureColor = texture2D(sprite, vUv);\n    gl_FragColor = vec4(textureColor.x, textureColor.y, textureColor.z, 1.0);\n}\n";

var TILE_NUM = 100;

var viewerDOM = document.querySelector('#viewer');

var width = viewerDOM.offsetWidth;
var height = viewerDOM.offsetHeight;

var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
viewerDOM.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xff0000);

viewerDOM.style.width = "";
viewerDOM.style.height = "";
renderer.setSize(width, height);

// scene
var scene = new THREE.Scene();

// camera
var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
camera.aspect = width / height;
camera.updateProjectionMatrix();
camera.position.set(200, 100, 500);
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
    /*
    if(texture) {
        sprite.offset.x = (1 / row) * rowIndex;
        sprite.offset.y = (1 / col) * colIndex;
    }
    */
};

var plane = undefined;
var alphaMapTextureLoader = new THREE.TextureLoader();

alphaMapTextureLoader.load('common/img/photo-1474267119072-677dd7959e96.png', function (texture) {
    var alphaMap = texture;

    // load texture
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('common/img/photo-1474635183442-1d29a9be83d3.jpeg', function (texture) {
        sprite = texture;
        sprite.needsUpdate = true;

        /*
        sprite.minFilter = THREE. LinearFilter;   
        sprite.repeat.set(1/row, 1/col);
        sprite.wrapS = THREE.RepeatWrapping;
        sprite.wrapT = THREE.RepeatWrapping;
        */

        var geometry = new THREE.PlaneGeometry(100, 100, 2, 2);
        console.log(geometry);

        var position = new Float32Array(TILE_NUM * 3);
        for (var i = 0; i < TILE_NUM; i++) {
            position[i * 3 + 0] = 0;
            position[i * 3 + 1] = 0;
            position[i * 3 + 2] = 0;
        }
        //geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));

        var material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                sprite: {
                    type: 't', value: sprite
                },
                alphaMap: {
                    type: 't', value: alphaMap
                },
                repeat: {
                    type: 'v2', value: new THREE.Vector2(1 / 8, 1 / 8)
                }
            },
            shading: THREE.FlatShading,
            blending: THREE.NormalBlending,
            side: THREE.DoubleSide
            //depthTest: true
            //transparent: true
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
        changePosition();
        beforeTime = time;
    }
    if (plane) {
        //plane.geometry.computeBoundingBox();
        //plane.geometry.attributes.position.needsUpdate = true;
    }

    stats.update();
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

requestAnimationFrame(update);

