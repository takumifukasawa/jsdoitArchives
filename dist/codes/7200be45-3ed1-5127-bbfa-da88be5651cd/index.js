(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.timer = 0;
        this.cameraAngle = {
            x: 0,
            y: 0,
            z: 100
        };
        this.pointsNum = 10000;
        this.linesNum = 20;
        this.lines = [];
        this.basePoints = [];
        this.beginDrawPos = 0;
        this.drawCount = 0;
        this.clock = 0;
        this.start = Date.now();
        this.cameraBeginPos = {
            z: 100
        };
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(40, win.innerWidth/win.innerHeight, 1, 10000);
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
        
        var pos = {};
        var x, y, z = 0;
        var diff = 10 + Math.random()*8;
        for(var s=0, slen=this.pointsNum; s<slen; s++) {
            if(s === 0) {
                x = 0, y = 0, z = 0;
            } else {    
                x = pos.x + Math.random()*diff - diff/2;
                y = pos.y + Math.random()*diff - diff/2;
                z = pos.z + Math.random()*diff - diff/2;
            }
            pos.x = x;
            pos.y = y;
            pos.z = z;
            this.addVertex2Buffer(this.basePoints, s, x, y, z);
        }

        for(var i=0, len=this.linesNum; i<len; i++) {
            this.drawLine();
        }  
        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
        this.run();
    };  
    
    Main.prototype.addVertex2Buffer = function(array, index, x, y, z) {
        var i = index*3;
        array[i] = x;
        array[i+1] = y;
        array[i+2] = z;
    };
    
    Main.prototype.drawLine = function() {
        var diff = 2 + Math.random()*6;
        var pos = {};
        var x, y, z;
        var line;
        
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(this.pointsNum*3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addGroup(0, 2);
        var color = 0xff6600 + Math.random()*0x8888;
        var material = new THREE.LineBasicMaterial({ color: color, opacity: 0.3, transparent: true });
        line = new THREE.Line(geometry, material);
        
        for(var i=0; i<this.pointsNum; i++) { 
            x = this.basePoints[i*3] + Math.random()*diff - diff/2;
            y = this.basePoints[i*3+1] + Math.random()*diff - diff/2;
            z = this.basePoints[i*3+2] + Math.random()*diff - diff/2;

            this.addVertex2Buffer(line.geometry.attributes.position.array, i, x, y, z);
        }
        this.lines.push(line);
        this.scene.add(line);
        line.geometry.setDrawRange(0, 0);
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
        for(var i=0, len=this.lines.length; i<len; i++) {
            this.lines[i].geometry.setDrawRange(this.beginDrawPos, this.drawCount);
            if(this.drawCount > this.pointsNum) {
                this.beginDrawPos = 0;
                this.drawCount = 0;
                this.camera.position.z = this.cameraBeginPos.z;
            }
            this.lines[i].geometry.attributes.position.needsUpdate = true;
        
            //this.lines[i].rotation.x += 0.003;
            //this.lines[i].rotation.y += 0.002;
            //this.lines[i].rotation.z += 0.001;
        }

        if(this.drawCount%30 === 0) {
            this.cameraAngle = {
                x: this.basePoints[this.drawCount*3] - win.innerWidth/2,
                y: this.basePoints[this.drawCount*3+1] - win.innerHeight/2,
                z: this.basePoints[this.drawCount*3+2] + 100
            };
            if(this.cameraAngle.z < this.cameraBeginPos.z) {
                //this.cameraAngle.z = this.cameraBeginPos.z;
            }
        }

        if(this.drawCount > 10) this.beginDrawPos++;
        this.drawCount++;



        this.camera.position.x += (-this.cameraAngle.x - this.camera.position.x)*0.02;
        this.camera.position.y += (-this.cameraAngle.y - this.camera.position.y)*0.02;
        this.camera.position.z += (this.cameraAngle.z - this.camera.position.z)*0.02;

        
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