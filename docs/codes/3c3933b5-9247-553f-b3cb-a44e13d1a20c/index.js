// forked from cx20's "[WebGL] three.js + WebGLRenderTarget を試してみるテスト" http://jsdo.it/cx20/EYsX
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）（その３）" http://jsdo.it/cx20/kwGs
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）（その２）" http://jsdo.it/cx20/d11S
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）" http://jsdo.it/cx20/vvCa
// forked from cx20's "[WebGL] three.js を試してみるテスト（BufferGeometry編）" http://jsdo.it/cx20/yCyD
// forked from cx20's "[簡易版] 30行で WebGL を試してみるテスト" http://jsdo.it/cx20/oaQC

var container;
var renderer;
var camera, scene;
var subCamera, subScene;
var renderTarget;

init();
animate();

function init() {
    container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderTarget = new THREE.WebGLRenderTarget(256, 256, {
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
    });

    // 通常の描画処理（renderTarget への描画用）
    subScene = new THREE.Scene();
    subCamera = new THREE.PerspectiveCamera(60, renderTarget.width / renderTarget.height, 0.1, 1000);
    subCamera.position.z = 20;

    var texture = THREE.ImageUtils.loadTexture('/jsdoitArchives/assets/img/photo-1460499593944-39e14f96a8c6.jpg');
    var subGeometry = new THREE.BoxGeometry(10, 10, 10);
    var subMaterial = new THREE.MeshBasicMaterial({map: texture, wireframe: false});    
    var subMesh = new THREE.Mesh(subGeometry, subMaterial);
    subScene.add(subMesh);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    var light1 = new THREE.DirectionalLight( new THREE.Color(0xffffff), 2);
    var light2 = new THREE.DirectionalLight( new THREE.Color(0xffffff), 2);
    light1.position.set(100, 100, 100);
    light2.position.set(-100, -100, -100);

    scene.add(light1);
    scene.add(light2);
    
    var axis = new THREE.AxisHelper(100);
    scene.add(axis);

    // レンダリング結果（renderTarget）をテクスチャに使用
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshPhongMaterial({map: renderTarget, wireframe: false});    
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    container.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

var theta = 0;
function render() {
    camera.lookAt( scene.position );
    camera.position.x = 20 * Math.sin( theta * Math.PI / 180 ) * -1; // 逆回転
    camera.position.z = 20 * Math.cos( theta * Math.PI / 180 );

    subCamera.lookAt( subScene.position );
    subCamera.position.x = 20 * Math.sin( theta * Math.PI / 180 ) * -1; // 逆回転
    subCamera.position.z = 20 * Math.cos( theta * Math.PI / 180 );
    
    theta++;

    renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.render(subScene, subCamera, renderTarget); // レンダリング結果を renderTarget にセット
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    renderer.render(scene, camera);    
}
