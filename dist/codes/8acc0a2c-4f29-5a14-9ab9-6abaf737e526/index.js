(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.start = Date.now();
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.container = doc.getElementById("container");
        
        this.camera = new THREE.PerspectiveCamera(40, win.innerWidth/win.innerHeight, 1, 10000);
        this.camera.position.z = 600;

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
        
        this.linesNum = 300;
        var distance = 400;
        var zig = 300;
        var diff = 10;
        var goal = {}, newGoal = {};
        for(var i=0; i<this.linesNum; i++) {
            var geometry = new THREE.Geometry();
            
            
            
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            newGoal = {
                x: Math.random()*distance-distance/2,
                y: Math.random()*distance-distance/2,
                z: Math.random()*distance-distance/2
            };
            
            for(var s=0; s<zig; s++) {
                geometry.vertices.push(new THREE.Vector3(
                    newGoal.x*s/zig + Math.random()*diff-diff/2,
                    newGoal.y*s/zig + Math.random()*diff-diff/2,
                    newGoal.z*s/zig + Math.random()*diff-diff/2
                ));
            }
            
            

            /*
            if(i === 0) {
                geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            } else {
                geometry.vertices.push(new THREE.Vector3(goal.x, goal.y, goal.z));
            }
            newGoal = {
                x: Math.random()*distance-distance/2,
                y: Math.random()*distance-distance/2,
                z: Math.random()*distance-distance/2
            };
            
            for(var s=0; s<zig; s++) {
                geometry.vertices.push(new THREE.Vector3(
                    newGoal.x*s/zig + Math.random()*diff-diff/2,
                    newGoal.y*s/zig + Math.random()*diff-diff/2,
                    newGoal.z*s/zig + Math.random()*diff-diff/2
                ));
            }
            
            for(var key in newGoal) {
                if(newGoal.hasOwnProperty(key)) goal[key] = newGoal[key];
            }
            */
            
            
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: 0x009955,
                opacity: 0.4,
                transparent: true
            }));
            this.group.add(line);
        }
        
        
        
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
        this.group.rotation.x += 0.005;
        this.group.rotation.y += 0.0025;
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.1;
        this.camera.position.y += (this.mouseY - this.camera.position.y)*0.1;
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