// forked from takumifukasawa's "threejs x shader: blur mesh - 輪郭も" http://jsdo.it/takumifukasawa/8XIV
// forked from takumifukasawa's "threejs x shader: blur mesh" http://jsdo.it/takumifukasawa/clcd
// forked from takumifukasawa's "threejs x shader: kaleidoscope" http://jsdo.it/takumifukasawa/KkpE
// forked from takumifukasawa's "threejs x shader: RGB shift" http://jsdo.it/takumifukasawa/05f7
// forked from takumifukasawa's "threejs: シェーダーで平面をピクピクさせる" http://jsdo.it/takumifukasawa/eNvo
// forked from takumifukasawa's "threejs: shaderMaterial で texture 貼る" http://jsdo.it/takumifukasawa/61St
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;
var card = undefined,
    geometry = undefined,
    material = null;
var blur = 0.;

var vertexShader = document.querySelector('#vertexShader').textContent;
var fragmentShader = document.querySelector('#fragmentShader').textContent;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(ratio);
renderer.setClearColor(0xff0000);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, // fov
1, // aspect
1, // near
40000 // far
);
camera.position.set(400, 0, 1200);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1).normalize();
scene.add(light);

var loader = new THREE.TextureLoader();
loader.load('/jsdoitArchives/assets/img/photo-1448318440207-ef1893eb8ac0.jpeg', function (texture) {
    init(texture);
});

function init(tex) {
    onWindowResize();

    var scale = .8;

    var canvas = document.createElement('canvas');
    canvas.width = tex.image.width;
    canvas.height = tex.image.height;
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.drawImage(tex.image, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(texture.image.width, texture.image.height, 1, 1), new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide
    }));
    scene.add(planeMesh);
    planeMesh.position.set(100, 100, -100);

    geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height, 1, 1);

    material = new THREE.ShaderMaterial({
        uniforms: {
            texture: {
                type: 't',
                value: texture
            },
            blur: {
                type: 'f',
                value: 1.
            },
            resolution: {
                type: 'v2',
                value: new THREE.Vector2(tex.image.width, tex.image.height)
            },
            dir: {
                type: 'v2',
                value: new THREE.Vector2(.5, .5)
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending,
        alphaTest: .5
    });
    card = new THREE.Mesh(geometry, material);
    card.position.set(0, 0, 0);
    scene.add(card);

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    requestAnimationFrame(update);
}

function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function update(time) {
    //card.rotation.x += 0.005;
    //card.rotation.z += 0.005;

    var currentTime = time / 1000;

    material.uniforms.blur.value = blur;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

var blurSlider = document.querySelector('#blur');
blurSlider.addEventListener('input', function (e) {
    var max = e.target.getAttribute('max');
    var val = e.target.value;
    blur = Number(val) / Number(max) / 80;
    //console.log(blur)
});

