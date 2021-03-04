// forked from takumifukasawa's "[2015.10.25] three.jsでshaderMaterial" http://jsdo.it/takumifukasawa/oZY4
(function($, win, doc) {
    
    "use strict";
      

    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(50, win.innerWidth/win.innerHeight, 1, 3000);
        this.camera.position.z = 700;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.001");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        var texLoader = new THREE.TextureLoader();
        var tex = texLoader.load("/jsdoitArchives/assets/img/9s1lvXLlSbCX5l3ZaYWP_hdr-1.png");

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    type: 'c',
                    value: new THREE.Color('rgb(255, 255, 255)')
                },
                texture: {
                    type: 't',
                    value: tex
                }
            },
            vertexShader: doc.getElementById("vertexshader").textContent,
            fragmentShader: doc.getElementById("fragmentshader").textContent,

		    blending: THREE.AdditiveBlending,
		    depthTest: false,
		    transparent: true
        });
               
     
        this.particles = 10000;
        this.radius = 200;
        
        /*
        this.geometry = new THREE.BufferGeometry();
        
        this.positions = new Float32Array(this.particles*3);
        this.colors = new Float32Array(this.particles*3);
        this.sizes = new Float32Array(this.particles);
                  
        var color = new THREE.Color();
        
        for(var i=0, i3=0; i<this.particles; i++, i3+=3) {
            this.positions[i3+0] = (Math.random()*2-1)*this.radius;
            this.positions[i3+1] = (Math.random()*2-1)*this.radius;
            this.positions[i3+2] = (Math.random()*2-1)*this.radius;
            
            color.setHSL(i/this.particles*0.2, 1.0, 0.5);
            
            this.colors[i3+0] = color.r;
            this.colors[i3+1] = color.g;
            this.colors[i3+2] = color.b;
            
            this.sizes[i] = 20;
        }
        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));        
        this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
         */
        
        var px, py, pz, particle, color;
        this.geometry = new THREE.Geometry();
        this.colors = [];
        for(var i=0, len=this.particles; i<len; i++) {
            px = Math.random()*1000-500;
            py = Math.random()*1000-500;
            pz = Math.random()*1000-500;
            particle = new THREE.Vector3(px, py, pz);
            particle.velocity = new THREE.Vector3(0, -Math.random(), 0);
            this.colors[i] = new THREE.Color(0xffffff);
            this.colors[i].setHSL(100, 1, 0.5);
            
            this.geometry.vertices.push(particle);
        }
        
        console.log(this.colors);
        this.geometry.colors = this.colors;
        
        this.pointCloud = new THREE.Points(this.geometry, this.shaderMaterial);
        this.pointCloud.sortParticles = true;
        
        this.scene.add(this.pointCloud);


        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                     
        this.run();
    };
    

    Main.prototype.windowResize = function() {
        this.camera.aspect = win.innerWidth / win.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(win.innerWidth/win.innerHeight);
    };
    
    Main.prototype.updateMousePos = function(e) {
        this.mouseX = e.clientX - win.innerWidth/2;
        this.mouseY = e.clientY - win.innerHeight/2;
    };
    
    Main.prototype.update = function() { 
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.1;
        
        /*
        var time = Date.now() * 0.003;   
	    this.particleSystem.rotation.z = 0.01 * time;
        var sizes = this.geometry.attributes.size.array;
		for (var i=0; i<this.particles; i++) {
			this.sizes[i] = 5 * (1 + Math.sin(0.1 * i + time));
	    }
        this.geometry.attributes.size.needsUpdate = true;
        */

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
        
    };
    
    new Main();
    
})(jQuery, window, window.document);