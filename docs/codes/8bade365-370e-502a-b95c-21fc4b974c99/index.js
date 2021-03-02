var width, height, scene, camera, renderer, light;
var axis, plane, cube;


function init() {
    
    // set canvas
    width = window.innerWidth;
    height = window.innerHeight;
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // set renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    /*    
    // use canvas render
    renderer = new THREE.CanvasRenderer( { antialias: true } );
    */
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);
    
    // set scene
    scene = new THREE.Scene();
    
    // set camera
    initCamera();
    
    // set light
    initLight();
    
    // set object
    initObject();
    
    // set rendering
    render();
}

function initCamera() {
    camera = new THREE.PerspectiveCamera( 45, width/height, 1, 10000 );
    camera.position.set(200, 200, 300);
    camera.lookAt( { x:0, y:0, z:0 } );
    scene.add(camera);
}

function initLight() {
    light = new THREE.DirectionalLight(0x0000ff, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}

function initObject() {
    // xyz axis
    axis = new THREE.AxisHelper(500);
    scene.add(axis);
    
    // wire flame
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500, 10, 10),
        new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe: true } )
    );
    plane.position.set(0, 0, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);
    
    // cube
    cube = new THREE.Mesh(
        new THREE.CubeGeometry(50, 50, 50),
        new THREE.MeshLambertMaterial( { color: 0x0000ff } )
    );    
    cube.position.set(0, 0, 0);
    scene.add(cube);
}

function render() {
    renderer.clear();
    renderer.render(scene, camera);
}

window.addEventListener('load', init, false);