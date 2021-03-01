// forked from takumifukasawa's "[2015.12.1] test: threejsでtextを表示してみようとしたが…" http://jsdo.it/takumifukasawa/mR7F
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
        
        //this.material = new THREE.MeshPhongMaterial({ color: 0x00FF7F }); // 鏡面反射表現
        this.material = new THREE.MeshLambertMaterial({ color: 0x00FF7F }); // Lambert反射表現

        this.textMesh = new THREE.Mesh(textGeometry, this.material);
        
        textGeometry.computeBoundingBox();
        this.textMesh.position.set(0, 0, 0);
        
        this.group.add(this.textMesh);
        this.scene.add(this.group);

    };
    
    Main.prototype.addVertex2Buffer = function(array, index, x, y, z) {
        var i = index*3;
        array[i] = x;
        array[i+1] = y;
        array[i+2] = z;
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
        this.nowTime = +new Date;
        var diffTime = this.beginTime - this.nowTime;
        
        this.camera.position.x += (this.mouseX - this.camera.position.x)*0.02;
        this.camera.position.y += (-this.mouseY - this.camera.position.y)*0.02;      
 
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