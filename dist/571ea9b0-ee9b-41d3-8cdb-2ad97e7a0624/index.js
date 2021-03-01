// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var width = 0;
var height = 0;

var vertexShader = document.querySelector('#vertex-shader').textContent;
var fragmentShader = document.querySelector('#fragment-shader').textContent;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, // fov
1, // aspect
1, // near
40000 // far
);
scene.add(camera);

camera.position.set(0, 0, 400);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1).normalize();
scene.add(light);

var numSides = 8;
var subdivisions = 50;

var geometry = createLineGeometry(numSides, subdivisions);
var material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    extensions: {
        deriviatives: true
    },
    defines: {
        lengthSegments: subdivisions.toFixed(1),
        FLAT_SHADED: false
    },
    uniforms: {
        thickness: {
            type: 'f',
            value: 1
        },
        time: {
            type: 'f',
            value: 0
        },
        radialSegments: {
            type: 'f',
            value: numSides
        }
    }
});

var mesh = new THREE.Mesh(geometry, material);
mesh.frustumCulled = false;
scene.add(mesh);

onWindowResize();
window.addEventListener('resize', onWindowResize);

requestAnimationFrame(update);

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function update(time) {
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

function createLineGeometry() {
    var numSides = arguments.length <= 0 || arguments[0] === undefined ? 8 : arguments[0];
    var subdivisions = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];
    var openEnded = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var radius = 1;
    var length = 1;
    var baseGeometry = new THREE.CylinderGeometry(radius, radius, length, numSides, subdivisions, openEnded);

    baseGeometry.rotateZ(Math.PI / 2);

    var tmpVec = new THREE.Vector2();
    var xPositions = [];
    var angles = [];
    var uvs = [];

    var vertices = baseGeometry.vertices;
    var faceVertexUvs = baseGeometry.faceVertexUvs[0];

    baseGeometry.faces.forEach(function (face, i) {
        var a = face.a;
        var b = face.b;
        var c = face.c;

        var v0 = vertices[a];
        var v1 = vertices[b];
        var v2 = vertices[c];
        var verts = [v0, v1, v2];
        var faceUvs = faceVertexUvs[i];

        verts.forEach(function (v, j) {
            tmpVec.set(v.y, v.z).normalize();
            var angle = Math.atan2(tmpVec.y, tmpVec.x);
            angles.push(angle);
            xPositions.push(v.x);
            uvs.push(faceUvs[j].toArray());
        });
    });

    var posArray = new Float32Array(xPositions);
    var angleArray = new Float32Array(angles);
    var uvArray = new Float32Array(uvs.length * 2);

    for (var i = 0; i < posArray.length; i++) {
        var _uvs$i = _slicedToArray(uvs[i], 2);

        var u = _uvs$i[0];
        var v = _uvs$i[1];

        uvArray[i * 2 + 0] = u;
        uvArray[i * 2 + 1] = v;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(posArray, 1));
    geometry.addAttribute('angle', new THREE.BufferAttribute(angleArray, 1));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvArray, 2));

    baseGeometry.dispose();
    return geometry;
}

