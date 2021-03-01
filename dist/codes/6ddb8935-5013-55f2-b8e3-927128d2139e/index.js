// forked from takumifukasawa's "threejs: 3D空間のベジェ曲線上を動き続ける箱" http://jsdo.it/takumifukasawa/6QA6
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;

var beforeTime = 0;
var currentPointIndex = 0;

var linesNum = 48;

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
camera.position.set(0, 0, 600);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0, 0, 1).normalize();
scene.add(light);

var curvePath = new THREE.CurvePath();
var points = [];

for (var i = 0; i < linesNum; i++) {
    var beginPoints = undefined,
        centerPoints = undefined,
        endPoints = undefined;
    if (i === 0) {
        beginPoints = getPoints();
        centerPoints = getPoints();
        endPoints = getPoints();
        points.push(beginPoints, centerPoints, endPoints);
    } else {
        beginPoints = points[points.length - 2];
        centerPoints = points[points.length - 1];
        endPoints = getPoints();
        points.push(endPoints);
    }

    beginPoints = new THREE.Vector3().lerpVectors(beginPoints, centerPoints, 0.5);

    endPoints = new THREE.Vector3().lerpVectors(centerPoints, endPoints, 0.5);

    var curve = new THREE.QuadraticBezierCurve3(beginPoints, centerPoints, endPoints);
    curvePath.add(curve);
}

var currentCurvePath = makeCurrentPath();

var lines = makeLineMesh(curvePath);
scene.add(lines);

onWindowResize();
window.addEventListener('resize', onWindowResize);

requestAnimationFrame(update);

function makeLineMesh(curvePath) {
    var curvePathGeometry = curvePath.createPointsGeometry(100);

    //    const geometry = new THREE.Geometry();
    //    geometry.vertices = curvePathGeometry.vertices;

    var pathVertices = curvePathGeometry.vertices;

    /*    
    const vertices = new Float32Array(pathVertices.length * 3);
    let i = 0;
    pathVertices.forEach(vector => {
        Object.keys(vector).forEach(key => {
            vertices[i] = vector[key];
            i++;
        });
    });  
    
    const geometry = new THREE.BufferGeometry();    
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('lineNormal', new THREE.BufferAttribute(undefined, 2));    
      const material = new THREE.ShaderMaterial({
        vertexShader, fragmentShader
    });
      const line = new THREE.Line(geometry, material);
    return line;
    */

    var geometry = new THREE.TubeGeometry(curvePath, 800, 5, 2, false);
    var material = new THREE.MeshLambertMaterial({ color: 0x000000 });
    return new THREE.Mesh(geometry, material);
}

function makeCurrentPath() {
    var path = new THREE.CurvePath();
    var begin = new THREE.Vector3().lerpVectors(points[0].clone(), points[1].clone(), 0.5);
    var center = points[1];
    var end = new THREE.Vector3().lerpVectors(points[1].clone(), points[2].clone(), 0.5);
    var curve = new THREE.QuadraticBezierCurve3(begin, center, end);
    path.add(curve);

    return path;
}

function getPoints() {
    return new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
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

    lines.rotation.x += 0.01;
    lines.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(update);

    beforeTime = currentTime;
}

