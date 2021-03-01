(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.timer = 0;
        this.cameraAngle = {
            x: 0,
            y: 0,
            z: 300
        };
        this.start = Date.now();
        this.beginTime = +new Date;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(80, win.innerWidth/win.innerHeight, 1, 10000);
        this.camera.position.z = this.cameraAngle.z;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.01");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(200,500,400);
        this.scene.add(this.light);
        
        this.group = new THREE.Object3D();
  
        this.makeObjects();        
        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
        this.run();
    };  
    
    Main.prototype.makeObjects = function() {
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    type: 'f',
                    value: 0.0
                },
                index: {
                    type: 'f',
                    value: 0.0
                },
                resolution: {
                    type: 'v2',
                    value: new THREE.Vector2()
                },
                amplitude: {
                    type: 'f',
                    value: 5.0
                },
                opacity: {
                    type: 'f',
                    value: 0.3
                },
                color: {
                    type: 'c',
                    value: new THREE.Color(0xff0000)
                }
            },
            vertexShader: doc.getElementById('vertexshader').textContent,
            fragmentShader: doc.getElementById('fragmentshader').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
                
        
        var textOpts = {
            size: 80,
            height: 15,
            curveSegments: 10,
            font: 'helvetiker',
            bevelThickness: 5,
            bevelSize: 1.5,
            bevelEnabled: true,
            bevelSegments: 10,
            steps: 40
        };
      
        var textGeometry = new THREE.TextGeometry('jsdo.it', textOpts);
        textGeometry.center();

        var vertices = textGeometry.vertices;
        var bufferGeometry = new THREE.BufferGeometry();
        
        var position = new THREE.Float32Attribute(vertices.length*3, 3).copyVector3sArray(vertices);
        bufferGeometry.addAttribute('position', position);
        
        var displacement = new THREE.Float32Attribute(vertices.length*3, 3);
        bufferGeometry.addAttribute('displacement', displacement);
        
        var customColor = new THREE.Float32Attribute(vertices.length*3, 3);
        bufferGeometry.addAttribute('customColor', customColor);

        var color = new THREE.Color(0xffffff);
        
        for(var i=0, len=customColor.count; i<len; i++) {
            color.setHSL(i/len, 0.5, 0.5);
            color.toArray(customColor.array, i*customColor.itemSize);
        }
        
        this.line = new THREE.Line(bufferGeometry, this.shaderMaterial);
        this.group.add(this.line);
        
        this.scene.add(this.group);
    };
    
    /*
    Main.prototype.addVertex2Buffer = function(array, index, x, y, z) {
        var i = index*3;
        array[i] = x;
        array[i+1] = y;
        array[i+2] = z;
    };
    */
    
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
        this.nowTime = +new Date;
            var time = this.beginTime - this.nowTime;
        
        var uniforms = this.shaderMaterial.uniforms;
        uniforms.amplitude.value = Math.sin(0.5*time);
        uniforms.color.value.offsetHSL(0.0005, 0, 0);
        
        var attributes = this.line.geometry.attributes;
        var array = attributes.displacement.array;
        
        this.group.rotation.y += 0.005;
        this.group.rotation.z += 0.002;
        //this.camera.position.x += (this.mouseX - this.camera.position.x)*0.02;
        //this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.02;      
 
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