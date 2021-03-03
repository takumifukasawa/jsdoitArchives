// forked from takumifukasawa's "shaderとcanvasTextureでマスク + 光沢" http://jsdo.it/takumifukasawa/YHe0
// forked from takumifukasawa's "forked: threejs: シェーダーで影をつける" http://jsdo.it/takumifukasawa/u3Tp
// forked from fayird's "forked: threejs: シェーダーで影をつける" http://jsdo.it/fayird/ClYt
// forked from takumifukasawa's "threejs: シェーダーで影をつける" http://jsdo.it/takumifukasawa/w6qj
// forked from takumifukasawa's "threejs: シェーダーで平面をピクピクさせる" http://jsdo.it/takumifukasawa/eNvo
// forked from takumifukasawa's "threejs: shaderMaterial で texture 貼る" http://jsdo.it/takumifukasawa/61St
// forked from takumifukasawa's "threejsのベース" http://jsdo.it/takumifukasawa/wiWe
'use strict';

var width = 0;
var height = 0;
var card = undefined,
    geometry = undefined,
    material = null;

var wrapper = document.querySelector('#wrapper');

var ratio = window.devicePixelRatio || 1;

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(ratio);
renderer.setClearColor(0x00ff00);

wrapper.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(50, // fov
1, // aspect
1, // near
40000 // far
);
camera.position.set(0, 0, 600);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.set(0, 0, 200);
scene.add(light);

var maskLoader = new THREE.TextureLoader();
var loader = new THREE.TextureLoader();
maskLoader.load('/common/img/JaI1BywIT5Or8Jfmci1E_zakopane.png', function (maskTexture) {
    loader.load('/common/img/photo-1471110338536-858caa3dbe45.jpeg', function (texture) {
        init(texture, maskTexture);
        onWindowResize();
        window.addEventListener('resize', onWindowResize);
        requestAnimationFrame(update);
    });
});

var texture = undefined,
    imageWidth = undefined,
    imageHeight = undefined;

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

function init(tex, maskTexture) {
    var vertexShader = document.querySelector('#vertexShader').textContent;
    var fragmentShader = document.querySelector('#fragmentShader').textContent;

    texture = tex;
    imageWidth = texture.image.width;
    imageHeight = texture.image.height;
    var offset = 114;

    geometry = new THREE.PlaneBufferGeometry(imageWidth, imageHeight, 20, 32);

    canvas.width = texture.image.width;
    canvas.height = texture.image.height;

    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.drawImage(maskTexture.image, 0, 0, maskTexture.image.width, maskTexture.image.height);
    ctx.fill();

    /*
        ctx.fillStyle = '#0000ff';
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.bezierCurveTo(20, 30, 200, 50, 200, 40);
        ctx.moveTo(200, 40);
        ctx.bezierCurveTo(190, 50, 180, 120, 180, 140);
        ctx.moveTo(180, 140);
        ctx.bezierCurveTo(160, 120, 30, 120, 10, 130);
        ctx.moveTo(10, 130);
        ctx.bezierCurveTo(20, 100, 20, 30, 20, 20);
        ctx.closePath();
        ctx.fill();
    */

    ctx.save();
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(texture.image, 0, 0, imageWidth, imageHeight);
    ctx.restore();

    var canvasTexture = new THREE.Texture(canvas);
    canvasTexture.needsUpdate = true;

    material = new THREE.SpriteMaterial({
        color: 0xffffff,
        map: canvasTexture
    });
    card = new THREE.Sprite(material);
    card.position.set(0, 0, 0);
    card.scale.set(imageWidth, -imageHeight, 1);

    /*
    material = new THREE.MeshPhongMaterial({
        map: canvasTexture,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending,
        alphaTest: .5
    });
    */

    /*
    material = new THREE.ShaderMaterial({
        vertexShader, fragmentShader,
        uniforms: {
            rotZ: {
                type: 'f',
                value: Math.PI / 6
            },
            curlR: {
                type: 'f',
                value: 400
            },
            texture: {
                type: 't',
                value: canvasTexture
            },
            lightDirection: {
                type: 'v3',
                value: light.position
            }
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.NormalBlending,
        alphaTest: .5
    });
    */
    /*
    card = new THREE.Mesh(geometry, material);
    card.position.set(0, 0, 0);
    card.receiveShadow = true;
    card.castShadow = true;
    */
    scene.add(card);
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

    //card.rotation.y += 0.02;

    //material.uniforms.rotZ.value = currentTime / 2
    //material.uniforms.curlR.value = 400 + 40 * Math.sin(currentTime);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

