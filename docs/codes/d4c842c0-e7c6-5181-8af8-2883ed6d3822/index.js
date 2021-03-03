// forked from takumifukasawa's "[2015.7.2] 画像をパーティクル化 part2 : three.js" http://jsdo.it/takumifukasawa/gTdu
(function($, window, document, undefined) {

    "use strict";

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    
    ////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////
    
    var ImageParticle = function() {
        this.img = null;
        
        // base
        this.renderer = null;;
        this.scene = null;;
        this.camera = null;;
        
        this.widthNum = window.innerWidth;
        this.heightNum = window.innerHeight;

        // array
        this.imgArray = [];
        this.randomArray = [];

        // particle
        this.img = new Image();
        this.pGeometry = null;
        this.pMaterial = null;
        this.pointCloud = null;
        this.pTween = [];
        this.pTweenBack = [];

        this.particleFlg = false;

        this.randomFlg = false;
        
        this.initialize();
        
    };
      
    /**
     * initialize
     */

    ImageParticle.prototype.initialize = function() {
              
        var _self = this;
        
        // DOM
        var container = document.getElementById( 'container' );

        // SCENE
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xffffff, 0, 3000 );

        // CAMERA
        this.camera = new THREE.PerspectiveCamera( 60, _self.widthNum / _self.heightNum, 1, 10000 );
        this.camera.position.z = 700;
  
        //RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( _self.widthNum, _self.heightNum );
        this.renderer.setClearColor(0xFFFFFF, 1.0);
        container.appendChild( this.renderer.domElement );

        //ANIMATE
        this.animate();
    
    };
 
    /*
     * animate + render
     */

    ImageParticle.prototype.animate = function() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();

        TWEEN.update();
    }

    ImageParticle.prototype.render = function() {
        var _self = this;
        if(this.particleFlg) this.pGeometry.verticesNeedUpdate = true;
        this.renderer.render( _self.scene, _self.camera );
    };

    ImageParticle.prototype.createParticle = function() {
        this.img.src = "/jsdoitArchives/assets/img/default-thumbnail.png";

        var _self = this;

        this.img.onload = function () {

            // canvas
            var imgCanvas = document.createElement("canvas");
            if(!imgCanvas.getContext) throw new Error("cannot make canvas");
            
            imgCanvas.width = this.width;
            imgCanvas.height = this.height;

            var context = imgCanvas.getContext("2d");
            context.drawImage(this,0,0);

            var imageW = imgCanvas.width;
            var imageH = imgCanvas.height;

            //data
            var pixels = context.getImageData(0, 0, imageW, imageH).data;
            var index = 0;
            var i = 0;
        
            //geometry
            //_self.pGeometry = new THREE.BufferGeometry();
            _self.pGeometry = new THREE.Geometry();
        
            // material
            _self.pMaterial = new THREE.PointCloudMaterial( {
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
                
                    var randomBaseNum = 6000;
                    var randomDiff = 3000;
                    var randomVertex = new THREE.Vector3(Math.random() * randomBaseNum -randomDiff, Math.random() * randomBaseNum - randomDiff, Math.random() * randomBaseNum - randomDiff);
                       
                    _self.imgArray[i] = {
                        vertex: new THREE.Vector3( (x-imageW/2)*1, (y-imageH/2)*-1, 0 )
                    };
                    _self.randomArray[i] = {
                        vertex: randomVertex.clone(),
                    };
                    
                    _self.pGeometry.vertices.push( randomVertex.clone() );
                    _self.pGeometry.colors.push( new THREE.Color("rgb("+r+","+g+","+b+")") );
                    
                    i += 1;

                    index = (x*4)+y*(4*imageW);
                }
            }
        
            // point cloud
            _self.pointCloud = new THREE.PointCloud( _self.pGeometry, _self.pMaterial );
            _self.scene.add(_self.pointCloud);
        
            //animate
            for( var i = 0; i < _self.imgArray.length; i++ ){
                _self.pTween[i] = new TWEEN.Tween( _self.pGeometry.vertices[i] )
                    .to( { x: _self.imgArray[i].vertex.x, y: _self.imgArray[i].vertex.y, z: _self.imgArray[i].vertex.z }, 3000 )
                    .easing( TWEEN.Easing.Quadratic.Out )
                    .start();
                
                /* reanimation.
                _self.pTweenBack[i] = new TWEEN.Tween( pGeometry.vertices[i] )
                    .delay(1000)
                    .to( { x: randomArray[i].vertex.x, y: randomArray[i].vertex.y, z: randomArray[i].vertex.z }, 4000 )
                    .easing( TWEEN.Easing.Quartic.InOut );
            
                _self.pTween[i].chain(_self.pTweenBack[i]);
                _self.pTweenBack[i].chain(_self.pTween[i]);
                */
            }
        
            _self.particleFlg = true;
        };
    };
    
    var imageParticle = new ImageParticle();
    
    $(window).load(function() {
        // OBJECT
        imageParticle.createParticle();
    });
    
})(jQuery, window, window.document, undefined);