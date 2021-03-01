var renderer, scene, camera, stats;
var particles, geometry, material;

init();

function init() {
    // dom
    container = document.getElementById('container');
    
    //scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0015 );
    
    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
    camera.position.z = 500;
    
    // object
    // 半径200pxを縦横100分割
    geometry = new THREE.SphereGeometry(200, 100, 100);
    material = new THREE.PointCloudMaterial({size: 3, color:0x448866})
	particles = new THREE.PointCloud(geometry,material);
	scene.add(particles);
    
    // renderer
    renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
    
    // stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
    
    // animate
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;
    particles.rotation.z += 0.001;
    
    renderer.render(scene, camera);
}