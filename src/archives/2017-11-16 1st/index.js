'use strict';

var width = undefined,
    height = undefined;

var isMouseDown = true;

var wrapper = document.getElementById("wrapper");

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
camera.position.set(0, 0, 20);

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 10);
scene.add(light);

var boxMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshPhongMaterial({
    color: 0xff0000
}));
boxMesh.isMouseDown = false;
boxMesh.position.set(0, 0, 0);

scene.add(boxMesh);

var raycaster = new THREE.Raycaster();
var mousePointer = new THREE.Vector2();

var onMouseMove = function onMouseMove(e) {
    mousePointer.x = e.clientX / width * 2 - 1;
    mousePointer.y = -(e.clientY / height) * 2 + 1;

    mesh.isPressed = true;
    for (var i = 0; i < intersects.length; i++) {
        var _mesh = intersects[i].object;
        _mesh.material.color.set(0x0000ff);
    }
    boxMesh.isMouseDown = false;
};

var onMouseDown = function onMouseDown(e) {
    isMouseDown = true;
};

var onMouseUp = function onMouseUp(e) {
    isMouseDown = false;

    if (boxMesh.isClicked) {
        window.open('http://sample.com', '_blank');
    }

    boxMesh.isPressed = false;

    e.preventDefault();
    e.stopPropagation();
};

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

var tick = function tick(time) {
    raycaster.setFromCamera(mousePointer, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    boxMesh.material.color.set(0xff0000);
    boxMesh.rotation.y = time / 20 % 360 * Math.PI / 180;

    for (var i = 0; i < intersects.length; i++) {
        var _mesh2 = intersects[i].object;
        _mesh2.material.color.set(0x0000ff);
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

onWindowResize();
wrapper.addEventListener('mousemove', onMouseMove);
wrapper.addEventListener('mousedown', onMouseDown);
wrapper.addEventListener('mouseup', onMouseUp);
window.addEventListener('resize', onWindowResize);
window.requestAnimationFrame(tick);

