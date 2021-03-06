// forked from cx20's "[WebGL] three.js で glTF 2.0形式のデータを表示してみるテスト（その３）（調整中）" http://jsdo.it/cx20/q0cx
// forked from cx20's "[WebGL] three.js で glTF 2.0形式のデータを表示してみるテスト（その２）" http://jsdo.it/cx20/K0k6
// forked from cx20's "[WebGL] three.js で glTF 2.0形式のデータを表示してみるテスト" http://jsdo.it/cx20/gMdU
// forked from cx20's "three.js で glTF 形式のデータを表示してみるテスト（その１）" http://jsdo.it/cx20/2qm8N
// forked from cx20's "three.js で OBJ 形式のデータを表示してみるテスト（その１）" http://jsdo.it/cx20/wGMY
// forked from cx20's "three.js で Blender のデータを表示してみるテスト" http://jsdo.it/cx20/2CXI
// forked from 【WebGL特集】第4回：Blenderでモデル出力 http://mox-motion.com/blog/webgl04-2/

var gltf = null;
var mixer = null;
var clock = new THREE.Clock();

init();
animate();
  
function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    scene = new THREE.Scene();
    
    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    var directionalLight2 = new THREE.DirectionalLight( 0xffeedd );
    directionalLight2.position.set( 0, 5, -5 );
    scene.add( directionalLight2 );
    
    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 2000 );
    camera.position.set(2, 2, 3);

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var loader = new THREE.GLTF2Loader();
    loader.setCrossOrigin( 'anonymous' ); // r84 以降は明示的に setCrossOrigin() を指定する必要がある

    var scale = 1.0;
    var url = "https://cdn.rawgit.com/cx20/jsdo-static-contents/5635d7da/models/gltf/2.0/EmaSimpleSkin/glTF/EmaSimpleSkin.gltf";
    
    loader.load(url, function (data) {
        gltf = data;
        var object = gltf.scene;
        console.log(object);
        object.scale.set(scale, scale, scale);
        //object.position.y -= 10;
        
        var helper = new THREE.SkeletonHelper(object);
        scene.add(helper);

        var animations = gltf.animations;
        if ( animations && animations.length ) {
            mixer = new THREE.AnimationMixer( object );
            for ( var i = 0; i < animations.length; i ++ ) {
                var animation = animations[ i ];
                //console.log(animation);
                mixer.clipAction( animation ).play();
            }
        }
        scene.add(object);
    });

    var axis = new THREE.AxisHelper(1000);   
    scene.add(axis);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xaaaaaa );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    //controls.autoRotate = true;
    controls.autoRotateSpeed = -10.0;

    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}