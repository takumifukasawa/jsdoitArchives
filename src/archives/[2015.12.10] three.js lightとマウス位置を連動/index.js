// forked from takumifukasawa's "[2015.12.7] three.js: lightを回転" http://jsdo.it/takumifukasawa/q3KM
// forked from takumifukasawa's "[2015.12.5] three.js: spotLight" http://jsdo.it/takumifukasawa/qZWZ
// forked from takumifukasawa's "[2015.12.3] three.js: LambertMaterial" http://jsdo.it/takumifukasawa/AJqs
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
            z: 500
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
        
        this.controls = new THREE.OrbitControls(this.camera);
        
        /*
        this.axis = new THREE.AxisHelper(1000);
        this.scene.add(this.axis);
        */
        
        this.pointLight = new THREE.SpotLight(0xffffff, 1.0);
        //this.pointLight.castShadow = true;
        this.pointLight.position.set(0,0,100);
        this.pointLight.target.position.z = -500;
        this.scene.add(this.pointLight);
        
        /*
        this.lightHelper = new THREE.PointLightHelper(this.pointLight, 1);
        this.scene.add(this.lightHelper);
        */
        
        this.group = new THREE.Object3D();
 
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
        this.material = new THREE.MeshLambertMaterial({ color: 0xfff000 }); // Lambert反射表現
        this.textMesh = new THREE.Mesh(textGeometry, this.material);
        textGeometry.computeBoundingBox();
        this.textMesh.position.set(-200, 0, 0);        
        this.group.add(this.textMesh);
        this.scene.add(this.group);

        var textGeometry2 = new THREE.TextGeometry('jsdo.it', textOpts);
        textGeometry2.center();
        this.material2 = new THREE.MeshPhongMaterial({ color: 0xfff000 }); // 鏡面反射表現
        this.textMesh2 = new THREE.Mesh(textGeometry2, this.material2);
        textGeometry.computeBoundingBox();
        this.textMesh2.position.set(200, 0, 0);        
        this.group.add(this.textMesh2);
        this.scene.add(this.group);
                
        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.container.appendChild(this.stats.domElement);
        
        win.addEventListener('resize', this.windowResize.bind(this), false);
        doc.addEventListener('mousemove', this.updateMousePos.bind(this), false);
        this.run();
    };  
    
    Main.prototype.makeObjects = function() {
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
        
        this.controls.update();
        
        /*
        this.pointLight.position.x = Math.sin(diffTime/1000)*300;
        this.pointLight.position.z = Math.cos(diffTime/1000)*300;
        */
        this.pointLight.position.x = this.mouseX*1.2;
        this.pointLight.position.y = this.mouseY*-1;
        
        this.pointLight.target.x = this.mouseX*-1.2;
        this.pointLight.target.y = this.mouseY;
        
        this.pointLight.target.updateMatrixWorld();
        
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