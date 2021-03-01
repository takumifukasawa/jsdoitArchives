// forked from takumifukasawa's "[2015.10.8] Three.jsで星" http://jsdo.it/takumifukasawa/qG18
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

        
        this.renderer = new THREE.CanvasRenderer({ alpha: true; });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        /*
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        */ 
        
        this.container.appendChild(this.renderer.domElement);
        
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
        this.cemera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };
    
    Main.prototype.makeParticles = function() {
        var particle, material;
        for(var i=0; i<this.particlesNum; i++) {
            material = new THREE.ParticleCanvasMaterial({
                color:new THREE.Color().setRGB(255, 255, 255),
                program: this.particleRender.bind(this)
            });
            particle = new THREE.Particle(material);
            
            particle.position.x = Math.random()*1000-500;
            particle.position.y = Math.random()*1000-500;
            particle.position.z = 1;
            
            particle.scale.x = particle.scale.y = 1.1;
            
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
    
    Main.prototype.particleRender = function(ctx) {
        gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2,
            0, canvas.width/2,
            canvas.height/2, canvas.width/2
        );
		gradient.addColorStop(0, 'rgba(0,255,255,0.8)');
		gradient.addColorStop(0.2, 'rgba(0,255,255,0.5)');
		gradient.addColorStop(0.4, 'rgba(0,0,64,0.25)');
		gradient.addColorStop(1, 'rgba(0,0,0,0.0)');
        
        ctx.fillStyle = gradient;
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