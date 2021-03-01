// forked from takumifukasawa's "threejs: canvas texture 256角 x 10" http://jsdo.it/takumifukasawa/slbk
// forked from takumifukasawa's "threejs: canvas texture 1024 x 1024" http://jsdo.it/takumifukasawa/KaT8
// forked from takumifukasawa's "threejs: test shadermaterial" http://jsdo.it/takumifukasawa/0vG9
// forked from takumifukasawa's "threejs: 四角の箱" http://jsdo.it/takumifukasawa/2bn3

'use strict';

var width = undefined,
    height = undefined;

var ratio = window.pixelRatio;

var wrapper = document.getElementById('wrapper');

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(ratio);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
camera.position.copy(new THREE.Vector3(0, 0, 10));
camera.lookAt(new THREE.Vector3(0, 0, 0));

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var videoSrc = 'http://jsrun.it/assets/m/A/C/7/mAC7m';

var planes = [];

var init = function init() {
    var len = [];
    for (var i = 0; i < 10; i++) {
        len.push(i);
    }

    var video = document.createElement('video');
    var loader = function loader() {
        return new Promise(function (resolve) {
            video.addEventListener('canplay', function () {
                resolve();
            });
            var src = videoSrc + '?t=' + (new Date() + '');
            video.src = src;
            video.load();
        });
    };

    return loader().then(function () {
        //video.play();
        video.loop = true;
        video.mute = true;
        video.playsInline = true;

        len.forEach(function (val, i) {
            var w = 256;
            var h = 256;
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');

            var texture = new THREE.Texture(canvas);

            var geometry = new THREE.PlaneGeometry(2, 2);

            var material = new THREE.MeshBasicMaterial({
                map: texture
            });

            var r = 5;

            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(new THREE.Vector3(Math.random() * r - r / 2, Math.random() * r - r / 2, Math.random() * r - r / 2));

            scene.add(mesh);

            planes.push(mesh);

            mesh.update = function (time) {
                var red = Math.floor((time + i * 100) / 10 % 250);
                ctx.fillStyle = 'rgb(' + red + ', 255, 255)';
                ctx.fillRect(0, 0, w, h);
                var currentTime = (time / 1000 + i * 10) % video.duration;
                video.currentTime = currentTime;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                material.map.needsUpdate = true;
            };
        });
    });
    return Promise.all(promises);
};

var onWindowResize = function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
};

var tick = function tick(time) {
    for (var i = 0; i < planes.length; i++) {
        planes[i].update(time);
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

onWindowResize();
window.addEventListener('resize', onWindowResize);

init().then(function () {
    requestAnimationFrame(tick);
});

