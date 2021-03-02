if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// base
var renderer, scene, camera, stats;

// array
var imgArray = [];
var randomArray = [];

// particle
var pGeometry, pMaterial, pointCloud;
var pTween = [];
var pTweenBack = [];

var particleFlg = false;

var randomFlg = false;


   
////////////////////////////////////////////////////////////
// initialize
////////////////////////////////////////////////////////////

init();

function init() {
    
    // DOM
    container = document.getElementById( 'container' );

    // SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 3000 );

    // CAMERA
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 700;

    // OBJECT
    createParticle();
    
    //RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xFFFFFF, 1.0);
    container.appendChild( renderer.domElement );

    //STATS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    //ANIMATE
    animate();
}




   
////////////////////////////////////////////////////////////
// animate + render
////////////////////////////////////////////////////////////

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();
    TWEEN.update();
}

function render() {
    
    if(particleFlg) pGeometry.verticesNeedUpdate = true;
    //scene.rotation.y += 0.002;
    
    renderer.render( scene, camera );
}



function createParticle() {
    
    var img = new Image();
    img.onload = function () {

        // canvas
        var imgCanvas = document.createElement("canvas");
        imgCanvas.width = this.width;
        imgCanvas.height = this.height;

        var context = imgCanvas.getContext("2d");
        context.drawImage(this,0,0);

        imageW = imgCanvas.width;
        imageH = imgCanvas.height;

        //data
        var pixels = context.getImageData(0, 0, imageW, imageH).data;
        var index = 0;
        var i = 0;
        
        //geometry
        pGeometry = new THREE.Geometry();
        
        // material
        pMaterial = new THREE.PointCloudMaterial( {
            size: 2,
            sizeAttenuation: false,
            transparent: false,
            opacity: 1.0,
            vertexColors: THREE.VertexColors
        } );
        for (var x=0; x<imageW; x++ ) {
            for (var y=0; y<imageH; y++ ) {
                var r = pixels[index];
                var g = pixels[index+1];
                var b = pixels[index+2];
                var a = pixels[index+3];

                var sum = r+g+b;
                
                //if (sum > 1) {
                    var randomVertex = new THREE.Vector3(Math.random() * 6000 - 3000, Math.random() * 6000 - 3000, Math.random() * 6000 - 3000);
                    
                    imgArray[i] = {
                        vertex: new THREE.Vector3( (x-imageW/2)*1, (y-imageH/2)*-1, 0 )
                    };
                    randomArray[i] = {
                        vertex: randomVertex.clone(),
                    };
                    
                    pGeometry.vertices.push( randomVertex.clone() );
                    pGeometry.colors.push( new THREE.Color("rgb("+r+","+g+","+b+")") );
                    
                    i += 1;
                //};
                index = (x*4)+y*(4*imageW);
            }
        }
        
        // point cloud
        pointCloud = new THREE.PointCloud( pGeometry, pMaterial );
        scene.add(pointCloud);
        
        //animate
        for( var i = 0; i < imgArray.length; i++ ){
            pTween[i] = new TWEEN.Tween( pGeometry.vertices[i] )
                .to( { x: imgArray[i].vertex.x, y: imgArray[i].vertex.y, z: imgArray[i].vertex.z }, 4000 )
                .easing( TWEEN.Easing.Quartic.InOut )
                .start();
            /*
            pTweenBack[i] = new TWEEN.Tween( pGeometry.vertices[i] )
                .delay(1000)
                .to( { x: randomArray[i].vertex.x, y: randomArray[i].vertex.y, z: randomArray[i].vertex.z }, 4000 )
                .easing( TWEEN.Easing.Quartic.InOut );
            
            pTween[i].chain(pTweenBack[i]);
            pTweenBack[i].chain(pTween[i]);
            */
        }
        
        particleFlg = true;
    };

    img.src = "/common/img/photo-1476862921040-227a643bf014.png";
    
}