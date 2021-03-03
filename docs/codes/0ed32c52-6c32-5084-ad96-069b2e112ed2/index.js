// forked from cx20's "[WebGL] three.js を試してみるテスト（BufferGeometry編）（その４）" http://jsdo.it/cx20/2XDY
// forked from cx20's "[WebGL] three.js を試してみるテスト（BufferGeometry編）（その３）" http://jsdo.it/cx20/yv6Z
// forked from cx20's "[WebGL] three.js を試してみるテスト（BufferGeometry編）（その２）" http://jsdo.it/cx20/vryW
// forked from cx20's "[WebGL] three.js を試してみるテスト（BufferGeometry編）" http://jsdo.it/cx20/yCyD
// forked from cx20's "[簡易版] 30行で WebGL を試してみるテスト" http://jsdo.it/cx20/oaQC

var container;
var camera, scene, renderer;
var mesh;

init();
animate();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;
    scene = new THREE.Scene();

    // 立方体の座標データを用意
    //             1.0 y 
    //              ^  -1.0 
    //              | / z
    //              |/       x
    // -1.0 -----------------> +1.0
    //            / |
    //      +1.0 /  |
    //           -1.0
    // 
    //         [7]------[6]
    //        / |      / |
    //      [3]------[2] |
    //       |  |     |  |
    //       | [4]----|-[5]
    //       |/       |/
    //      [0]------[1]
    //
    var vertexPositions = [
            // Front face
            [-0.5, -0.5,  0.0], // v0
            [ 0.5, -0.5,  0.0], // v1
            [ 0.5,  0.5,  0.0], // v2
            [-0.5,  0.5,  0.0], // v3
    ];
    var vertices = new Float32Array(vertexPositions.length * 3);
    for (var i = 0; i < vertexPositions.length; i++) {
        vertices[i * 3 + 0] = vertexPositions[i][0];
        vertices[i * 3 + 1] = vertexPositions[i][1];
        vertices[i * 3 + 2] = vertexPositions[i][2];
    }
    var texcoord = new Float32Array([
        // Front face
        1, 0,
        0, 0,
        0, 1,
        1, 1
    ]);
    
    var indices = new Uint16Array([
         0,  1,  2,    0,  2 , 3  // Front face
    ]);
    
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(texcoord, 2));
    geometry.addAttribute('index', new THREE.BufferAttribute(indices, 1));
    var uniforms = {
        texture : { type: "t", value: THREE.ImageUtils.loadTexture( '/jsdoitArchives/assets/img/photo-1482351403047-56c184e23fe1.jpeg' ) }  // frog.jpg
    };

    var material = new THREE.RawShaderMaterial({
        vertexShader: document.getElementById('vs').textContent,
        fragmentShader: document.getElementById('fs').textContent,
        side: THREE.DoubleSide,
        uniforms: uniforms
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

var rad = 0.0;
function render() {
    rad += Math.PI * 1.0 / 180.0
    mesh.rotation.x = rad;
    mesh.rotation.y = rad;
    mesh.rotation.z = rad;
    renderer.render(scene, camera);
}
