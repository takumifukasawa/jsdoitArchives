// forked from takumifukasawa's "[2015.11.22] test: three.jsのsetDrawCount" http://jsdo.it/takumifukasawa/QjAp
(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.timer = 0;
        this.cameraAngle = {
            x: 0,
            y: 0,
            z: 160
        };
        this.limit = {
            x: 1,
            y: 1,
            z: 1
        };
        this.pointsNum = 16;
        this.linesNum = 1;
        this.lineObjects = 16;
        this.lines = [];
        this.basePoints = [];
        this.lineGroups = [];
        this.beginDrawPos = 0;
        this.drawCount = 0;
        this.clock = 0;
        this.start = Date.now();
        this.cameraBeginPos = {
            z: 320
        };
        this.beginTime = +new Date;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(80, win.innerWidth/win.innerHeight, 1, 10000);
        this.camera.position.z = this.cameraBeginPos.z;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2("rgb(0,0,0), 0.05");
        this.scene.add(this.camera);
        
        this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
        this.renderer.setPixelRatio(win.devicePixelRatio);
        this.renderer.setSize(win.innerWidth, win.innerHeight);
        
        this.container.appendChild(this.renderer.domElement);
        
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(200,500,400);
        this.scene.add(this.light);
        
        this.group = new THREE.Object3D();
        this.scene.add(this.group);
  
        this.makeShader();        
        
        var pos = {};
        var x, y, z = 0;
        var addX, addY, addZ = 0;
        var diff = 60 + Math.random()*40;
        for(var k=0, klen=this.lineObjects; k<klen; k++) {
            this.basePoints[k] = [];
            for(var s=0, slen=this.pointsNum; s<slen; s++) {
                x = 0, y = 0, z = 0;
                pos.x = x;
                pos.y = y;
                pos.z = z;
                this.addVertex2Buffer(this.basePoints[k], s, x, y, z);
            }
        }
            
        for(var j=0, jlen=this.lineObjects; j<jlen; j++) {   
            this.lineGroups[j] = new THREE.Object3D();
            for(var i=0, len=this.linesNum; i<len; i++) {
                var line = this.drawLine(j);
                this.lines.push(line);
                this.lineGroups[j].add(line);
            }
            this.scene.add(this.lineGroups[j]);
        }
        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
        this.run();
    };  
    
    Main.prototype.makeShader = function() {
        this.shaders = [];
        for(var i=0, len=this.lineObjects; i<len; i++) {
            var shaderMaterial = new THREE.ShaderMaterial({
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
                    }
                },
                vertexShader: doc.getElementById('vertexshader').textContent,
                fragmentShader: doc.getElementById('fragmentshader').textContent,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true
            });
        
            shaderMaterial.lineWidth = 1;
            this.shaders.push(shaderMaterial);
        }

    };
    
    Main.prototype.addVertex2Buffer = function(array, index, x, y, z) {
        var i = index*3;
        array[i] = x;
        array[i+1] = y;
        array[i+2] = z;
    };
    
    Main.prototype.drawLine = function(index) {
        var diff = 2 + Math.random()*2;
        var pos = {};
        var x, y, z;
        var line;
        
                              
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(this.pointsNum*3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        var color = 0xff6600 + Math.random()*0x8888;
        var material = new THREE.LineBasicMaterial({ color: color, opacity: 0.3, transparent: true });
        //line = new THREE.Line(geometry, material);
        line = new THREE.Line(geometry, this.shaders[index]);
        
        for(var i=0; i<this.pointsNum; i++) { 
            x = this.basePoints[index][i*3] + Math.random()*diff - diff/2;
            y = this.basePoints[index][i*3+1] + Math.random()*diff - diff/2;
            z = this.basePoints[index][i*3+2] + Math.random()*diff - diff/2;

            this.addVertex2Buffer(line.geometry.attributes.position.array, i, x, y, z);
        }
        return line;
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
        /*
        // for debug
        this.timer++;
        if(this.timer%60 === 0) {
        }
        */
        
        this.nowTime = +new Date;
        var diffTime = (this.nowTime-this.beginTime)/1000;
        var diff = .1;
        var x, y, z;
        var distance = 400;
        
        for(var n=0, nlen=this.shaders.length; n<nlen; n++) {
            this.shaders[n].uniforms.time.value = diffTime*2*n; 
        }

            
        for(var s=0, slen=this.lineObjects; s<slen; s++) {        
            if(s===0) continue;
            for(var i=0, len=this.lines.length; i<len; i++) {
                var position = this.lines[i].geometry.attributes.position;
                
                for(var k=0, klen=position.array.length; k<klen; k++) {
                    var range = diff * k%2;
                    position.array[k*3] = Math.sin(diffTime*range)*distance;
                    position.array[k*3+1] = Math.pow(Math.cos(diffTime*range),4)*distance;
                    position.array[k*3+2] = Math.pow(Math.cos(diffTime*range),2)*distance;
                }
                    
                position.needsUpdate = true;
            }
            var scale = 0.2 + Math.pow(Math.sin(diffTime - 1000*s), 3)*0.1;
            this.lineGroups[s].scale.set(scale, scale, scale);
            
            this.lineGroups[s].rotation.x += 0.012;
            this.lineGroups[s].rotation.y += 0.008;
            this.lineGroups[s].rotation.z += 0.004;
        }
     
        this.drawCount++;
     
        
        //this.camera.position.x += (this.mouseX*1.2 - this.camera.position.x)*0.02;
        //this.camera.position.y += (-this.mouseY*1.2 - this.camera.position.y)*0.02;
        //this.camera.position.z += 0.2;        
 
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