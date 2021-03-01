(function($, win, doc) {
    
    "use strict";
      

    var Main = function() {
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(50, win.innerWidth/win.innerHeight, 1, 3000);
        this.camera.position.z = 700;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("0x000000, 0.001");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        //this.makeMaterial();
        this.makeParticle();
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        this.axis = new THREE.AxisHelper(1000);
        this.axis.position.set(0, 0, 0);
        this.scene.add(this.axis);
             
        this.run();
    };
    
    Main.prototype.makeMaterial = function() {
        this.material = new THREE.PointCloudMaterial({
            color: 0xFFFFFF,
            size: 7,
            transparent: true
        });
    };
    
    Main.prototype.makeParticle = function() {
        var px, py, pz, particle, material;
       
        
        this.particlesNum = 2000;
        
        /*
        this.particles = new THREE.Geometry();
        
        for(var i=0; i<this.particlesNum; i++) {
            px = Math.random()*1000-500;
            py = Math.random()*1000-500;
            pz = Math.random()*1000-500;
            particle = new THREE.Vector3(px, py, pz);
            particle.velocity = new THREE.Vector3(0, -Math.random(), 0);
            this.particles.vertices.push(particle);
        }
        
        this.pointCloud = new THREE.PointCloud(this.particles, this.material);
        this.pointCloud.sortPaticles = true;
        this.scene.add(this.pointCloud);
        */
        
        this.group = new THREE.Group();
        this.scene.add(this.group);
        
        var program = function(context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, Math.PI*2, false);
            context.fill();
        };
        
        for(var i=0; i<this.particlesNum; i++) {
            material = new THREE.SpriteCanvasMaterial({
                color: 0xFFFFFF,
                program: program
            });
            
            particle = new THREE.Sprite(material);
            particle.position.x = Math.random()*1000-500;
            particle.position.y = Math.random()*1000-500;
            particle.position.z = Math.random()*1000-500;
            particle.scale.x = particle.scale.y = 10;
            this.group.add(particle);
        }
            
    };
    
    Main.prototype.updateParticle = function() {
        //this.pointCloud.geometry.__dirtyVerticies = true;
    };
    
    Main.prototype.update = function() {
        //this.updateParticle();
        this.camera.lookAt(this.scene.position);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };
    
    Main.prototype.run = function() {
        win.requestAnimationFrame = (function(){
            return win.requestAnimationFrame     ||
                win.webkitRequestAnimationFrame  ||
                win.mozRequestAnimationFrame     ||
                win.oRequestAnimationFrame       ||
                win.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    win.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        
        var loop = function() {                                                                                                                                                                              
            this.update(); 
            win.requestAnimationFrame(loop);  
        }.bind(this);
        loop();
        
    };
    
    new Main();
    
})(jQuery, window, window.document);