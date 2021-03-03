// forked from fayird's "2016-12-20 1st" http://jsdo.it/fayird/4dDz
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);
view.appendChild(renderer.domElement);
renderer.domElement.style.display = "block";

var textureLoader = new THREE.TextureLoader();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 4);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var planeGeometry = new THREE.PlaneGeometry(1, 1);
var planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide
});

function updateVertices() {
    planeGeometry.vertices.forEach(function (v) {
        var offset = new THREE.Vector2((Math.random() - .5) * .1, (Math.random() - .5) * .1);
        v.x += offset.x;
        v.y += offset.y;
        v.offset = offset;
    });

    _.zip(planeGeometry.faces, planeGeometry.faceVertexUvs[0]).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var _ref2$0 = _ref2[0];
        var a = _ref2$0.a;
        var b = _ref2$0.b;
        var c = _ref2$0.c;
        var faceUvs = _ref2[1];

        _.zip([a, b, c], faceUvs).forEach(function (_ref3) {
            var _ref32 = _slicedToArray(_ref3, 2);

            var i = _ref32[0];
            var uv = _ref32[1];

            var v = planeGeometry.vertices[i];
            uv.add(v.offset);
        });
    });
    planeGeometry.verticesNeedUpdate = true;
    planeGeometry.uvsNeedUpdate = true;
}

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
textureLoader.load("/jsdoitArchives/assets/img/photo-1473865327424-e85f6d40d354.jpeg", function (texture) {
    planeMaterial.map = texture;
    planeMaterial.needsUpdate = true;
});
scene.add(plane);
/*                                                                          
for(let i=0; i<50; i++) {
const p = plane.clone();
    p.position.set(Math.random()*4-2,Math.random()*4-2,Math.random()*4-2);
    scene.add(p);
}                                                                          
*/

requestAnimationFrame(tick);
function tick(t) {
    updateVertices();
    plane.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

