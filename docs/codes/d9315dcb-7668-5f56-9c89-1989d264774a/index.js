// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;

var beforeTime = 0;
var currentPointIndex = 0;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(ratio);

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

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1).normalize();
scene.add(light);

var cube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
cube.position.set(0, 0, 0);
world.add(cube);

var curvePath = new THREE.CurvePath();
var points = [];

var linesNum = 8;
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

var lines = makeLineMesh(curvePath, 0x00ff00);
//scene.add(lines);

var currentLine = makeLineMesh(currentCurvePath, 0xff0000);
world.add(currentLine);

onWindowResize();
window.addEventListener('resize', onWindowResize);

requestAnimationFrame(update);

function makeLineMesh(curvePath, color) {
    var geometry = new THREE.Geometry();
    var curvePathGeometry = curvePath.createPointsGeometry(100);
    geometry.vertices = curvePathGeometry.vertices;

    var material = new THREE.LineBasicMaterial({
        color: color
    });

    var line = new THREE.Line(geometry, material);
    return line;
}

function addNewLine() {}

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

    currentPointIndex += delta / 2;
    if (currentPointIndex > 1) {
        currentPointIndex = 0;
        points.shift();
        currentCurvePath = makeCurrentPath();
        var pathGeometry = currentCurvePath.createPointsGeometry(100);
        currentLine.geometry.vertices = pathGeometry.vertices;

        points.push(getPoints());
    }
    currentLine.geometry.verticesNeedUpdate = true;

    var currentPoint = currentCurvePath.getPointAt(currentPointIndex);
    //console.log(currentPoint)

    controls.update();

    cube.position.copy(currentPoint.clone());
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    //world.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(update);

    beforeTime = currentTime;
}

