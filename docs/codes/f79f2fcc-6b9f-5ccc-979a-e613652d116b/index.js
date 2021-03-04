// forked from edo_m18's "Three.jsでトゥーンシェーダの実装の実験" http://jsdo.it/edo_m18/gepr
var container,
    camera,
    scene,
    sceneEdge,
    projector,
    renderer,
    mesh,
    meshEdge,
    lightCameraVisibility = false,
    globalLight;

var sceneCube,
    cameraCube,
    textureCube,
    meshCube;

var shadermaterial,
    facematerial;


function initSkybox() {
    sceneCube = new THREE.Scene();
    cameraCube = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000);
    cameraCube.position.y = -50;
    sceneCube.add(cameraCube);

    var urls = [
        '/jsdoitArchives/assets/img/photo-1415904663467-dfdc16cae794.jpeg',
        '/jsdoitArchives/assets/img/photo-1416431168657-a6c4184348ab.jpeg',
        '/jsdoitArchives/assets/img/photo-1416512149338-1723408867e9.jpeg',
        '/jsdoitArchives/assets/img/photo-1416592525293-e65266465eb7.jpg',
        '/jsdoitArchives/assets/img/photo-1416934625760-d56f5e79f6fe.jpeg',
        '/jsdoitArchives/assets/img/photo-1417716226287-2f8cd2e80274.jpeg'
    ];

    textureCube = THREE.ImageUtils.loadTextureCube(urls);

    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = textureCube;

    var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms      : shader.uniforms,
        depthWrite    : false,
        side          : THREE.BackSide
    });

    meshCube = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 1000), material);

    sceneCube.add(meshCube);
}

function createScene(geometry, materials) {

    shadermaterial = new THREE.ShaderMaterial({
        fragmentShader: document.getElementById('fs').innerHTML,
        vertexShader  : document.getElementById('vs').innerHTML,
        attributes: {},
        uniforms: {
            edgeColor: {
                type: 'v4',
                value: new THREE.Vector4(0, 0, 0, 0)
            },
            edge: {
                type: 'i',
                value: true
            },
            lightDirection: {
                type: 'v3',
                value: globalLight.position
            },
             texture: {
                type: 't',
                value: THREE.ImageUtils.loadTexture('/jsdoitArchives/assets/img/photo-1415226161018-3ec581fa733d.png')
            }
        }
    });
    shadermaterial.morphTargets = true;

    if (materials) {
        for (var i = 0, l = materials.length; i < l; i++) {
            materials[i].morphTargets = true;
        }
        facematerial = new THREE.MeshFaceMaterial(materials);
    }

    mesh = new THREE.SkinnedMesh(geometry, shadermaterial);
    mesh.scale.set(100, 100, 100);
    mesh.position.y += 40;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    meshEdge = mesh.clone();

    scene.add(mesh);
    sceneEdge.add(meshEdge);
}

function initGrid() {
    // Grid

    var gmaterial = new THREE.LineBasicMaterial( { color: 0xcccccc } );
    var ggeometry = new THREE.Geometry();
    var floor = -0.04, step = 1, size = 14;

    for ( var i = 0; i <= size / step * 2; i ++ ) {
        ggeometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
        ggeometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );
        ggeometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
        ggeometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );
    }

    var line = new THREE.Line(ggeometry, gmaterial, THREE.LinePieces);
    line.scale.set(100, 100, 100);
    scene.add(line);
}

function initGround() {
    var initColor = new THREE.Color(0x497f13);
    var initTexture = THREE.ImageUtils.generateDataTexture(1, 1, initColor);

    var groundMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x111111, map: initTexture});

    var groundTexture = THREE.ImageUtils.loadTexture('/jsdoitArchives/assets/img/photo-1417870839255-a23faa90c6b0.jpeg', undefined, function () { groundMaterial.map = groundTexture; });
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 6;

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), groundMaterial);
    mesh.position.y = -150;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
}

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 100;
    camera.position.z = 10;
    camera.target = new THREE.Vector3( 0, 150, 0 );

    scene = new THREE.Scene();
    sceneEdge = new THREE.Scene();

    //

    globalLight = new THREE.DirectionalLight( 0xefefff, 2 );
    globalLight.position.set(-1, 1, 1).normalize();
    globalLight.castShadow = true;
    globalLight.shadowMapWidth = 2048;
    globalLight.shadowMapHeight = 2048;

    var d = 1000;
    globalLight.shadowCameraLeft = -d;
    globalLight.shadowCameraRight = d;
    globalLight.shadowCameraTop = d;
    globalLight.shadowCameraBottom = -d;
    globalLight.shadowCameraNear = 1;
    globalLight.shadowCameraFar = 1000;
    globalLight.shadowCameraFov = 40;

    globalLight.shadowCameraVisible = false;

    globalLight.shadowBias = 0.0001;
    globalLight.shadowDarkness = 0.5;

    scene.add(globalLight);

    var light2 = new THREE.DirectionalLight( 0xffefef, 2 );
    light2.position.set( -1, -1, -1 ).normalize();

    scene.add( light2 );

    var loader = new THREE.JSONLoader(true);
    loader.load('/assets/l/2/m/t/l2mtS', createScene);

    //

    initGround();
    initSkybox();

    //

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.sortObjects = false;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.autoClear = false;

    container.appendChild(renderer.domElement);

    //

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {
    requestAnimationFrame( animate );
    render();
}

var radius = 800;
var theta = 0;

var duration = 1000;
var keyframes = 30, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;
var y = 0;

function render() {

    camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
    camera.lookAt(camera.target);

    if (mesh) {
        y += 0.3;
        mesh.position.y = 100 * Math.sin(THREE.Math.degToRad(y));
        meshEdge.position.y = 100 * Math.sin(THREE.Math.degToRad(y));
        // Alternate morph targets
        var time = Date.now() % duration;
        var keyframe = Math.floor( time / interpolation );

        if ( keyframe != currentKeyframe ) {
            mesh.morphTargetInfluences[ lastKeyframe ] = 0;
            mesh.morphTargetInfluences[ currentKeyframe ] = 1;
            mesh.morphTargetInfluences[ keyframe ] = 0;

            lastKeyframe = currentKeyframe;
            currentKeyframe = keyframe;
        }

        mesh.morphTargetInfluences[keyframe] = ( time % interpolation ) / interpolation;
        mesh.morphTargetInfluences[lastKeyframe] = 1 - mesh.morphTargetInfluences[ keyframe ];

        cameraCube.rotation.copy(camera.rotation);

        renderer.clear();
        renderer.render(sceneCube, cameraCube);

        //render front face.
        if (meshFlg) {
            meshEdge.material.side = THREE.FrontSide;
            mesh.material.uniforms.edgeColor.value = new THREE.Vector4(0, 0, 0, 0);
            mesh.material.uniforms.edge.value = false;
        }
        renderer.render(scene, camera);

        //render back face as edge.
        if (meshFlg) {
            meshEdge.material.side = THREE.BackSide;
            meshEdge.material.uniforms.edgeColor.value = new THREE.Vector4(0, 0, 0, 1);
            meshEdge.material.uniforms.edge.value = true;
            renderer.render(sceneEdge, camera);
        }
    }
}

//

init();
animate();


//Event handlers.
var meshFlg = true;
(function (win, doc) {

    doc.addEventListener('mousewheel', function (e) {
        e.preventDefault();
        theta -= e.wheelDelta / 100;
    }, false);

    doc.addEventListener('DOMMouseScroll', function (e) {
        theta -= e.detail / 10;
    }, false);

    doc.getElementById('lightCameraVisibility').addEventListener('click', function () {
        globalLight.shadowCameraVisible = (lightCameraVisibility = !lightCameraVisibility);
    }, false);

    doc.getElementById('switchMaterial').addEventListener('click', function () {
        if ((meshFlg = !meshFlg)) {
            mesh.material = shadermaterial;
        }
        else {
            mesh.material = facematerial;
        }
    }, false);

    function leap(a, b, x) {
        x = 1 - x;
        var f = 1 - x * x * x * x;
        return a * (1 - f) + b * f;
    }

    var moving = false;
    function move(degrees) {
        if (moving) {
            return;
        }

        degrees = +degrees;

        if ({}.toString.call(degrees) === '[object Number]') {
            moving = true;

            var t = 0;
            var d = (1000 / 16) | 0;
            var s = theta;
            var e = theta + degrees;

            (function loop() {
                t++;
                theta = leap(s, e, t / d);

                if (t === d) {
                    moving = false;
                    return;
                }

                setTimeout(loop, 16);
            }());
        }
    }

    win.move = move;
    
    Object.defineProperty(win, 'help', {
        get: function () {
            console.log([
                '---- HELP ----',
                'move(degrees)を呼ぶことで、視点を回転させることができます。'
            ].join('\n'));
        }
    });

}(window, document));