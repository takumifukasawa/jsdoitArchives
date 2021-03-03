(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(80, win.innerWidth/win.innerHeight, 1, 4000);
        this.camera.position.z = 600;
        
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        
		this.renderer = new THREE.CanvasRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        /*
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        */       
        this.container.appendChild(this.renderer.domElement);
        
        this.texture = THREE.ImageUtils.loadTexture("assets/img/photo-1428452932365-4e7e1c4b0987.png");
        
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.container.appendChild(this.stats.domElement);
        
        this.particles = [];
        this.particlesNum = 200;
        
        this.makeParticles();
        
        this.run();       
    };
    
    Main.prototype.update = function() {
        this.updateParticles();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };
    
    Main.prototype.makeParticles = function() {
        var particle, material;
        for(var i=0; i<this.particlesNum; i++) {
            material = new THREE.ParticleCanvasMaterial({
                //color:new THREE.Color().setRGB(255, 255, 255),
                program: this.particleRender.bind(this),
                map: this.texture
            });
            particle = new THREE.Particle(material);
            
            particle.position.x = Math.random()*1000-500;
            particle.position.y = Math.random()*1000-500;
            particle.position.z = 1;
            
            particle.scale.x = particle.scale.y = 1;
            
            this.scene.add(particle);
            this.particles.push({
                p: particle,
                t: Math.random()*360,
                dt: Math.random()*2/3
            });
        }
    };
    
    Main.prototype.updateParticles = function() {
        var particle, alpha;
        for(var i=0, len=this.particles.length; i<len; i++) {
            particle = this.particles[i].p;
            this.particles[i].t += this.particles[i].dt;
            if(this.particles[i].t > 360) this.particles[i].t = 0;
            alpha = Math.abs(Math.sin(this.particles[i].t*Math.PI/180));
            particle.material.opacity = alpha;
        }
    };
    
    Main.prototype.particleRender = function(context) {
        context.beginPath();
        context.arc(0, 0, 1, 0, Math.PI*2, true);
        context.fill();
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
            requestAnimationFrame(loop);  
        }.bind(this);
        loop();
        //requestAnimationFrame(loop);  
    };
    
    var main = new Main();
    
})(jQuery, window, window.document);