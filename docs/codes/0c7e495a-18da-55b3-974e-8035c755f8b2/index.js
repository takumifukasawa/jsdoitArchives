// forked from takumifukasawa's "[2015.10.28] Geometryでシェーダー（うまくいかなかった）" http://jsdo.it/takumifukasawa/kmOp
// forked from takumifukasawa's "[2015.10.25] three.jsでshaderMaterial" http://jsdo.it/takumifukasawa/oZY4
(function($, win, doc) {
    
    "use strict";
      

    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.dy = 0.01;
        this.zoomMinZ = 3000;
        this.zoomMaxZ = 100;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(50, win.innerWidth/win.innerHeight, 1, 3000);
        this.camera.position.z = 600;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.001");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        var texLoader = new THREE.TextureLoader();
        var tex = texLoader.load("/jsdoitArchives/assets/img/photo-1464468164664-850fcaf6be4a.png");

        
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
     
        this.particleNum = 3000;
        this.radius = 600;

        var px, py, pz, particle, color;
        this.particles = new THREE.Geometry();
        this.colors = [];
        for(var i=0, len=this.particleNum; i<len; i++) {
            px = Math.random()*1000-500;
            py = Math.random()*1000-500;
            pz = Math.random()*1000-500;
            particle = new THREE.Vector3(px, py, pz);
            particle.velocity = new THREE.Vector3(0, 0, 0);
            this.colors[i] = new THREE.Color(0xffffff);
            this.colors[i].setHSL(1, Math.random(), Math.random()*2);

            this.particles.vertices.push(particle);
        }
            
        this.particles.colors = this.colors;
        
        this.pointCloud = new THREE.Points(this.particles, this.shaderMaterial);
        this.pointCloud.sortParticles = true;
        
        this.scene.add(this.pointCloud);

        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
        doc.body.addEventListener('mousewheel', this.mousewheel.bind(this), false );
        doc.body.addEventListener('DOMMouseScroll', this.mousewheel.bind(this), false ); // firefox
         
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
    
    Main.prototype.mousewheel = function(e) {
        var d = ((typeof e.wheelDelta != "undefined")?(-e.wheelDelta):e.detail);
        d = 100 * ((d>0)?1:-1);    
        var cPos = this.camera.position;

        if(isNaN(cPos.z) || isNaN(cPos.z) || isNaN(cPos.z)) return;
       
        if (cPos.z >= this.zoomMinZ || cPos.z <= this.zoomMaxZ){
           return;
        }

        var mb = d>0 ? 1.004 : 0.996;
        //cPos.x = cPos.x * mb;
        //cPos.y = cPos.y * mb;
        cPos.z = cPos.z * mb;
    }
    
    Main.prototype.update = function() { 
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.1;
        
        this.pointCloud.rotation.y += this.dy;
        this.pointCloud.rotation.z += this.dy/3;
        
        for(var i=0, len=this.particleNum; i<len; i++) {
            var particle = this.particles.vertices[i];
            if(particle.y < -win.innerHeight) {
                particle.y = win.innerHeight;
                particle.velocity.y = -Math.random();
            }
            particle.velocity.y -= Math.random()*this.dy;
            particle.add(particle.velocity);
        }
        
        this.pointCloud.geometry.__dirtyVerticies = true;
        this.pointCloud.geometry.colorNeedUpdates = true;
        

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
    
    new Main();
    
})(jQuery, window, window.document);