// forked from takumifukasawa's "[2015.10.25] three.jsでshaderMaterial" http://jsdo.it/takumifukasawa/oZY4
(function($, win, doc) {
    
    "use strict";
    
    var threeVertexShaderText = document.getElementById('three-vshader').textContent;
    var fragmentShaderText = document.getElementById('fshader').textContent;


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
        this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.005");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        this.geometry = new THREE.PlaneGeometry(win.innerWidth, win.innerHeight);
        this.geometry = new THREE.BoxGeometry(50, 50, 50);
        
        this.uniforms = {
            time: { type: 'f', value: 1.0 },
            resolution: { type: 'v2', value: new THREE.Vector2() }
        };

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms       : this.uniforms,
            vertexShader   : threeVertexShaderText,
            fragmentShader : fragmentShaderText
        });
        
        this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial);

        this.scene.add(this.mesh);
        
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
        this.renderer.setSize(win.innerWidth, win.innerHeight);
    };
    
    Main.prototype.updateMousePos = function(e) {
        this.mouseX = e.clientX - win.innerWidth/2;
        this.mouseY = e.clientY - win.innerHeight/2;
    };
    
    Main.prototype.update = function() {
        this.mesh.rotation.x += 0.02;
        this.mesh.rotation.y += 0.02;
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