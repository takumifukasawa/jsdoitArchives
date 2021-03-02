// forked from takumifukasawa's "[2015.10.10] particleにテクスチャを貼ろうとしたが…" http://jsdo.it/takumifukasawa/Y0L5
(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.particlesNum = 3000;
        this.dx = 0.001;
        this.dy = 0.0008;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, win.innerWidth/win.innerHeight, 1, 3000);
        this.camera.position.z = 700;
        
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
        this.scene.add(this.camera);

        //this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setSize(win.innerWidth, win.innerHeight);
             
        this.container.appendChild(this.renderer.domElement);
        
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.container.appendChild(this.stats.domElement);
       
        this.makeMaterial();
        this.makeParticles();
        
        this.run();       
    };
        
    Main.prototype.makeMaterial = function() {         
        var texLoader = new THREE.TextureLoader();
        this.texture = texLoader.load("/common/img/photo-1482351403047-56c184e23fe1.png");
        //this.texture = THREE.ImageUtils.loadTexture("/common/img/photo-1476862921040-227a643bf014.png");

        this.material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 7,
            map: this.texture,
            transparent: true
        });  
    };
    
    Main.prototype.makeParticles = function() {
        var px, py, pz, particle;
        
        this.particles = new THREE.Geometry();
                
        for(var i=0, len=this.particlesNum; i<len; i++) {
            px = Math.random()*1000-500;
            py = Math.random()*1000-500;
            pz = Math.random()*1000-500;
            particle = new THREE.Vector3(px, py, pz);
            particle.velocity = new THREE.Vector3(0, -Math.random(), 0);
            this.particles.vertices.push(particle);
        }
        
        this.pointCloud = new THREE.Points(this.particles, this.material);
        this.pointCloud.sortParticles = true;
        
        this.scene.add(this.pointCloud);
    };
    
    Main.prototype.updateParticles = function() {
        this.pointCloud.rotation.y += this.dy;
        
        for(var i=0, len=this.particlesNum; i<len; i++) {
            var particle = this.particles.vertices[i];
            if(particle.y < -win.innerHeight) {
                particle.y = win.innerHeight;
                particle.velocity.y = -Math.random();
            }
            particle.velocity.y -= Math.random()*this.dy;
            particle.add(particle.velocity);
        }
        
        this.pointCloud.geometry.__dirtyVerticies = true;
    };

    Main.prototype.update = function() {
        this.updateParticles();
        this.camera.lookAt(this.scene.position);
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
        
        
        //this.update();
    };
    
    var main = new Main();
    
})(jQuery, window, window.document);