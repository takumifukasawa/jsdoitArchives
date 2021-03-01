var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 10 );

var renderer;
if(window.WebGLRenderingContext) {
    renderer = new THREE.WebGLRenderer();
} else {
    renderer = new THREE.CanvasRenderer();
}

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*
var directionalLight = new THREE.DirectionalLight('#ffffff');
directionalLight.position.set(0, 7, 10);
scene.add(directionalLight);
*/

var geometry = new THREE.CubeGeometry( 3, 3, 3 );
var material = new THREE.MeshBasicMaterial( { color: '#dd3b6f' } );
var cube = new THREE.Mesh( geometry, material );
cube.position.set( 0, 0, 0 );
scene.add(cube);

//camera.position.z = 5;

var render = function() {
    requestAnimationFrame(render);
    
    cube.rotation.x += 0.03;
    cube.rotation.y += 0.03;
    cube.rotation.z += 0.03;
    
    renderer.render(scene, camera);
};

render();