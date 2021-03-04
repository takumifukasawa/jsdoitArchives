(function($, win, doc) {
    
    "use strict";
      

    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(40, win.innerWidth/win.innerHeight, 1, 10000);
        this.camera.position.z = 300;

        this.scene = new THREE.Scene();
        //this.scene.fog = new THREE.FogExp2("0x000000, 0.001");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        
        
        
        this.uniforms = {
            color: {
                type: 'c',
                value: new THREE.Color(0xffffff)
            },
            texture: {
                type: 'c',
                value: THREE.ImageUtils.loadTexture("/jsdoitArchives/assets/img/photo-1469793032099-27d09c984b8b.png")
            }
        };
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: doc.getElementById("vertexshader").textContent,
            fragmentShader: doc.getElementById("fragmentshader").textContent,
    		attributes: {
		    	size: {
				    type: 'f',
    				value: null
	    		},
		    	customColor: { 
				    type: 'c',
	    			value: null
		    	}
	    	},
		    blending: THREE.AdditiveBlending,
		    depthTest: false,
		    transparent: true
        });
               
     
        this.particles = 100000;
        this.radius = 200;
        
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particles*3);
        this.colors = new Float32Array(this.particles*3);
        this.sizes = new Float32Array(this.particles*3);
                  
        this.color = new THREE.Color();
        
        for(var v=0; v<this.particles; v++) {
            this.positions[v+0] = (Math.random()*2-1)*this.radius;
            this.positions[v+1] = (Math.random()*2-1)*this.radius;
            this.positions[v+2] = (Math.random()*2-1)*this.radius;
            
            this.color.setHSL(v/this.particles, 1.0, 0.5);
            this.colors[v+0] = this.color.r;
            this.colors[v+1] = this.color.g;
            this.colors[v+2] = this.color.b;
            
            this.sizes[v] = 20;
        }
        this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));        
        this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 3));
        
        this.particleSystem = new THREE.PointCloud(this.geometry, this.shaderMaterial);
        
        this.scene.add(this.particleSystem);
        
        
        
        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                     
        this.run();
    };
    
    Main.prototype.makeParticle = function() {

    };
    
    
    Main.prototype.updateMousePos = function(e) {
        this.mouseX = e.clientX - win.innerWidth/2;
        this.mouseY = e.clientY - win.innerHeight/2;
    };
    
    Main.prototype.update = function() {
        
        //this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        //this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.1;
        
		var time = Date.now() * 0.005;   
	    this.particleSystem.rotation.z = 0.01 * time;
        var sizes = this.geometry.attributes.size.array;
		for (var i = 0; i < this.particles; i++) {
			this.sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
	    }
        this.geometry.attributes.size.needsUpdate = true;

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