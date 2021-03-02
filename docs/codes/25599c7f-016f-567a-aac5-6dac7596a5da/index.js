(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.linesNum = 100000;
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
        this.scene.add(this.group);
        
        /*
        var distance = 500;
        var zig = 10;
        var diff = 20;
        for(var i=0; i<this.linesNum; i++) {
            var geometry = new THREE.Geometry();
            var goal = {
                x: Math.random()*distance-distance/2,
                y: Math.random()*distance-distance/2,
                z: Math.random()*distance-distance/2
            };
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            for(var s=0; s<zig; s++) {
                geometry.vertices.push(new THREE.Vector3(
                    goal.x*s/zig + Math.random()*diff,
                    goal.y*s/zig + Math.random()*diff,
                    goal.z*s/zig + Math.random()*diff
                ));
            }

            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: 0x009955,
                opacity: 0.4,
                transparent: true
            }));
            this.group.add(line);
        }
        */
        this.drawLine();
        
        
        
        
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
                     
        this.run();
    };  
    
    Main.prototype.addVertex2Buffer = function(geometry, index, x, y, z) {
        var i = index*3;
        var array = geometry.attributes.position.array;
        array[i] = x;
        array[i+1] = y;
        array[i+2] = z;
    };
    
    Main.prototype.drawLine = function() {
        var diff = 10;
        var pos = {};
        var x, y, z;
        
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(this.linesNum*3);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addGroup(0, 2);
        var material = new THREE.LineBasicMaterial({ color: 0x009955, opacity: 0.6, transparent: true });
        this.line = new THREE.Line(geometry, material);
        
        for(var i=0; i<this.linesNum; i++) {
            if(i === 0) {
                x = 0, y = 0, z = 0;
            } else {    
                x = pos.x + Math.random()*diff - diff/2;
                y = pos.y + Math.random()*diff - diff/2;
                z = pos.z + Math.random()*diff - diff/2;
            }
            pos.x = x;
            pos.y = y;
            pos.z = z;
            this.addVertex2Buffer(this.line.geometry, i, x, y, z);
        }
        this.scene.add(this.line);
        this.line.geometry.setDrawRange(0, 0);
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
        this.line.geometry.setDrawRange(0, this.drawCount);
        if(this.drawCount > this.linesNum) {
            this.drawCount = 0;
            this.camera.position.z = this.cameraBeginPos.z;
        }
        this.line.geometry.attributes.position.needsUpdate = true;
        
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.1;
        
        this.line.rotation.x += 0.003;
        this.line.rotation.y += 0.002;
        this.line.rotation.z += 0.001;
        this.camera.position.z += 0.2;
        this.drawCount++;

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