// forked from takumifukasawa's "threejs: バネ（texture + BufferGeometry）" http://jsdo.it/takumifukasawa/oi0W
// forked from takumifukasawa's "threejs: バネ（BufferGeometry）" http://jsdo.it/takumifukasawa/UmkC
// forked from takumifukasawa's "threejs: 帯（buffergeometry）" http://jsdo.it/takumifukasawa/GzSA
// forked from takumifukasawa's "forked: threejs: 帯（tubegeometry）" http://jsdo.it/takumifukasawa/8cbr
// forked from takumifukasawa's "threejs: 帯（tubegeometry）" http://jsdo.it/takumifukasawa/oIl4
// forked from takumifukasawa's "threejs: 3D空間のベジェ曲線上を動き続ける箱" http://jsdo.it/takumifukasawa/6QA6
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;

var beforeTime = 0;

var blackImageSrc = '/common/img/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.png';
var blueImageSrc = '/common/img/photo-1469594292607-7bd90f8d3ba4.png';

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
camera.position.set(0, 200, 4800);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0, 0, 1).normalize();
scene.add(light);

onWindowResize();
window.addEventListener('resize', onWindowResize);

var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
material.wireframe = true;

var dummyBox = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
//scene.add(dummyBox);

var segments = 5 * 2;
var distance = 100;
var points = [];
var stages = [];

// test lines
var lines = new THREE.Mesh(getMusicScoreGeometry(0, 30, 240, 200, 0, 0, 0), material);
//scene.add(lines);

var spiralMesh = undefined;
var blackTexture = undefined,
    blueTexture = undefined;
var blackTextureLoader = new THREE.TextureLoader();
var blueTextureLoader = new THREE.TextureLoader();

blackTextureLoader.load(blackImageSrc, function (blackImage) {
    blueTextureLoader.load(blueImageSrc, function (blueImage) {
        blackTexture = blackImage;
        blueTexture = blueImage;
        blackTexture.wrapS = THREE.RepeatWrapping;
        blackTexture.wrapT = THREE.RepeatWrapping;
        blackTexture.repeat.set(1, 10);
        var spiralGeometry = getSpiralGeometry(2, 600, 1200, 6, 8, 128);
        var spiralMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader, fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                blackTexture: {
                    type: 't',
                    value: blackTexture
                },
                blueTexture: {
                    type: 't',
                    value: blueTexture
                }
            }
        });
        //spiralMaterial.alphaTest = .5;
        //spiralMaterial.wireframe = true;
        spiralMesh = new THREE.Mesh(spiralGeometry, spiralMaterial);
        scene.add(spiralMesh);

        // begin tick
        requestAnimationFrame(update);
    });
});

//////////////////////////////////////////////////////////
//
// functions
//
//////////////////////////////////////////////////////////

function getSpiralGeometry(pointsNum, linesNum, radius, deltaAngle, deltaHeight, thickness) {
    var red = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
    var green = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];
    var blue = arguments.length <= 8 || arguments[8] === undefined ? 0 : arguments[8];

    var path = new THREE.CurvePath();
    for (var i = 0; i < linesNum; i++) {
        var beginPoints = undefined,
            centerPoints = undefined,
            endPoints = undefined;
        if (points.length === 0) {
            beginPoints = getSpiralBezierPoints(i, radius, deltaAngle, deltaHeight);
            centerPoints = getSpiralBezierPoints(i + 1, radius, deltaAngle, deltaHeight);
            endPoints = getSpiralBezierPoints(i + 2, radius, deltaAngle, deltaHeight);
            points.push(beginPoints, centerPoints, endPoints);
        } else {
            beginPoints = points[points.length - 2];
            centerPoints = points[points.length - 1];
            endPoints = getSpiralBezierPoints(i + 2, radius, deltaAngle, deltaHeight);
            points.push(endPoints);
        }

        var curve = getSmoothBezier(beginPoints, centerPoints, endPoints);
        path.add(curve);
    }

    var curvePathGeometry = path.createPointsGeometry(pointsNum);
    var vertices = curvePathGeometry.vertices;

    var segments = vertices.length - 1;

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array(segments * 4 * 3);
    var colors = new Float32Array(segments * 2 * 3);
    var normals = new Float32Array(segments * 2 * 3);
    var indices = new Uint32Array(segments * 3);
    var uvs = new Float32Array(segments * 3);
    var textureIndex = new Float32Array(segments * 2);

    for (var i = 0; i < segments * 2; i++) {
        indices[i * 6] = i * 2;
        indices[i * 6 + 1] = i * 2 + 1;
        indices[i * 6 + 2] = i * 2 + 2;
        indices[i * 6 + 3] = i * 2 + 1;
        indices[i * 6 + 4] = i * 2 + 2;
        indices[i * 6 + 5] = i * 2 + 3;
    }

    for (var i = 0; i < segments; i++) {
        var index = i / 2;
        index = index % 2 | 0;
        index = 0;
        //console.log(index);
        textureIndex[i] = index;
        textureIndex[i + 1] = index;
    }

    for (var i = 0; i < segments; i++) {
        uvs[i * 8] = 0;
        uvs[i * 8 + 1] = 0;
        uvs[i * 8 + 2] = 1;
        uvs[i * 8 + 3] = 0;
        uvs[i * 8 + 4] = 1;
        uvs[i * 8 + 5] = 1;
        uvs[i * 8 + 6] = 0;
        uvs[i * 8 + 7] = 1;
    }

    for (var i = 0; i < segments; i++) {
        var currentX = vertices[i].x;
        var currentY = vertices[i].y;
        var currentZ = vertices[i].z;

        var nextX = vertices[i + 1].x;
        var nextY = vertices[i + 1].y;
        var nextZ = vertices[i + 1].z;

        var currentAngle = deltaAngle * i / 2;
        var nextAngle = deltaAngle * (i + 1) / 2;

        var addCurrentX = thickness * Math.cos(currentAngle * Math.PI / 180);
        var addCurrentZ = thickness * Math.sin(currentAngle * Math.PI / 180);

        var addNextX = thickness * Math.cos(nextAngle * Math.PI / 180);
        var addNextZ = thickness * Math.sin(nextAngle * Math.PI / 180);

        positions[i * 12] = currentX;
        positions[i * 12 + 1] = currentY;
        positions[i * 12 + 2] = currentZ;

        positions[i * 12 + 3] = currentX + addCurrentX;
        positions[i * 12 + 4] = currentY;
        positions[i * 12 + 5] = currentZ + addCurrentZ;

        positions[i * 12 + 6] = nextX + addNextX;
        positions[i * 12 + 7] = nextY;
        positions[i * 12 + 8] = nextZ + addNextZ;

        positions[i * 12 + 9] = nextX;
        positions[i * 12 + 10] = nextY;
        positions[i * 12 + 11] = nextZ;
    }

    for (var i = 0; i < segments; i++) {
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
    geometry.addAttribute('uvs', new THREE.BufferAttribute(uvs, 2));
    geometry.addAttribute('textureIndex', new THREE.BufferAttribute(textureIndex, 1));

    geometry.computeBoundingSphere();

    return geometry;
}

function getSpiralBezierPoints(index, radius, deltaAngle, deltaHeight) {
    var angle = deltaAngle * index;
    return new THREE.Vector3(radius * Math.cos(angle * Math.PI / 180), index * deltaHeight, radius * Math.sin(angle * Math.PI / 180));
}

function getSmoothBezier(beginPoint, centerPoint, endPoint) {
    var begin = new THREE.Vector3().lerpVectors(beginPoint, centerPoint, 0.5);

    var end = new THREE.Vector3().lerpVectors(centerPoint, endPoint, 0.5);

    var curve = new THREE.QuadraticBezierCurve3(begin, centerPoint, end);

    return curve;
}

function getMusicScoreGeometry(offset, thickness, span, radius, red, green, blue) {
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
        var x = -thickness / 2 + offset;
        var y = Math.sin(i * .5) * radius;
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

    geometry.setIndex(new THREE.BufferAttribute(indices, 1).setDynamic(true));
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3).setDynamic(true));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

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

    //spiralMesh.rotation.x += delta;

    renderer.render(scene, camera);
    requestAnimationFrame(update);

    beforeTime = currentTime;
}

