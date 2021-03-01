// forked from takumifukasawa's "[2015.8.29] 3Dのキューブを拡大アニメーション" http://jsdo.it/takumifukasawa/6ppy
var WIN = window.innerWidth;
var HEI = window.innerHeight;


///////////////////////////////////////////
// utility
///////////////////////////////////////////

var dtr = function(d) { return d*Math.PI/180; };

var randomPos = function() { return Math.sin(Math.floor(Math.random()*360)*Math.PI/180); };

var distance = function(p1, p2, p3) { return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2)+Math.pow(p2.z-p1.z,2)); };

///////////////////////////////////////////
// vertex3d use affine
///////////////////////////////////////////

var camera = {
    self: {
        x: 0,
        y: 0,
        z: WIN*2
    },
    target: {
        x: 0,
        y: 0,
        z: 0
    },
    distance: {
        x: 0,
        y: 0,
        z: 0
    },
    angle: {
        cosPhi     : 0,
        sinPhi     : 0,
        cosTheta   : 0,
        sinTheta   : 0
    },
    zoom: 1,
    display: {
        x: WIN/2,
        y: HEI/2,
        z: 0
    },
    update: function() {
        camera.distance.x = camera.target.x - camera.self.x;
        camera.distance.y = camera.target.y - camera.self.y;
        camera.distance.z = camera.target.z - camera.self.z;
		camera.angle.cosPhi = -camera.distance.z / Math.sqrt(camera.distance.x*camera.distance.x + camera.distance.z*camera.distance.z);
		camera.angle.sinPhi = camera.distance.x / Math.sqrt(camera.distance.x*camera.distance.x + camera.distance.z*camera.distance.z);
		camera.angle.cosTheta = Math.sqrt(camera.distance.x*camera.distance.x + camera.distance.z*camera.distance.z) / Math.sqrt(camera.distance.x*camera.distance.x + camera.distance.y*camera.distance.y + camera.distance.z*camera.distance.z);
		camera.angle.sinTheta = -camera.distance.y / Math.sqrt(camera.distance.x*camera.distance.x + camera.distance.y*camera.distance.y + camera.distance.z*camera.distance.z);
    }
};

///////////////////////////////////////////
// affine transform
///////////////////////////////////////////

var affine = {
    world: {
        size: function(p, size) {
            return {
                x: p.x*size.x,
                y: p.y*size.y,
                z: p.z*size.z
            };
        },
        rotate: {
            x: function(p, rotate) {
                return {
                    x: p.x,
                    y: p.y*Math.cos(dtr(rotate.x)) - p.z*Math.sin(dtr(rotate.x)),
                    z: p.y*Math.sin(dtr(rotate.x)) + p.z*Math.cos(dtr(rotate.x))
                };
            },
            y: function(p, rotate) {
                return {
                    x: p.x*Math.cos(dtr(rotate.y)) + p.z*Math.sin(dtr(rotate.y)),
                    y: p.y,
                    z: -p.x*Math.sin(dtr(rotate.y)) + p.z*Math.cos(dtr(rotate.y))
                };
            },
            z: function(p, rotate) {
                return {
                    x: p.x*Math.cos(dtr(rotate.z)) - p.y*Math.sin(dtr(rotate.z)),
                    y: p.x*Math.sin(dtr(rotate.z)) + p.y*Math.cos(dtr(rotate.z)),
                    z: p.z
                };
            }
        },
        position: function(p, position) {
            return {
                x: p.x + position.x,
                y: p.y + position.y,
                z: p.z + position.z
            };
        }
    },
    view: {
        phi: function(p) {
            return {
                x: p.x*camera.angle.cosPhi + p.z*camera.angle.sinPhi,
                y: p.y,
                z: p.x*-camera.angle.sinPhi + p.z*camera.angle.cosPhi
            };
        },
        theta: function(p) {
            return {
                x: p.x,
                y: p.y*camera.angle.cosTheta - p.z*camera.angle.sinTheta,
                z: p.y*camera.angle.sinTheta + p.z*camera.angle.cosTheta
            };
        },
        viewReset: function(p) {
            return {
                x: p.x - camera.self.x,
                y: p.y - camera.self.y,
                z: p.z - camera.self.z
            };
        }
    },
    perspective: function(p) {
        return {
            x: p.x * camera.distance.z/p.z * camera.zoom,
            y: p.y * camera.distance.z/p.z * camera.zoom,
            z: p.z * camera.zoom,
            p: camera.distance.z/p.z
        };
    },
    display: function(p, display) {
        return {
            x: p.x + display.x,
            y: -p.y + display.y,
            z: p.z + display.z,
            p: p.p
        };
    },
    process: function(model, size, rotate, position, display) {
        var ret = affine.world.size(model, size);
        ret = affine.world.rotate.x(ret, rotate);
        ret = affine.world.rotate.y(ret, rotate);
        ret = affine.world.rotate.z(ret, rotate);
        ret = affine.world.position(ret, position);
        ret = affine.view.phi(ret);
        ret = affine.view.theta(ret);
        ret = affine.view.viewReset(ret);
        ret = affine.perspective(ret);
        ret = affine.display(ret, display);
        return ret;
    }
};




(function($, win, doc) {

    "use strict";

    
    ///////////////////////////////////////////
    // vertex3d use affine transform
    ///////////////////////////////////////////

    var Vertex3d = function(param) {
        this.affineIn = {};
        this.affineOut = {};
        this.affineIn.vertex = (param.vertex);
        this.affineIn.size = (param.size);
        this.affineIn.rotate = (param.rotate);
        this.affineIn.position = (param.position);
    };
    
    Vertex3d.prototype.vertexUpdate = function() {
        this.affineOut = affine.process(
            this.affineIn.vertex,
            this.affineIn.size,
            this.affineIn.rotate,
            this.affineIn.position,
            camera.display
        ); 
    };
 
    
    ///////////////////////////////////////////
    // main
    ///////////////////////////////////////////
        
    var Main = function() {

        this.initialize();
    };

    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        
        this.canvas.addEventListener('mousemove', this.mousemove.bind(this), false);
        
        this.canvas.width = win.innerWidth;
        this.canvas.height = win.innerHeight;
        
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = 0.5;

        this.v = [];
        this.dist = [];

        this.v[0] = new Vertex3d({
            vertex: { x: -1, y: 1, z: 1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[1] = new Vertex3d({
            vertex: { x: 1, y: 1, z: 1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[2] = new Vertex3d({
            vertex: { x: 1, y: -1, z: 1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[3] = new Vertex3d({
            vertex: { x: -1, y: -1, z: 1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[4] = new Vertex3d({
            vertex: { x: -1, y: 1, z: -1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[5] = new Vertex3d({
            vertex: { x: 1, y: 1, z: -1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[6] = new Vertex3d({
            vertex: { x: 1, y: -1, z: -1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.v[7] = new Vertex3d({
            vertex: { x: -1, y: -1, z: -1 },
            size: { x: 100, y: 100, z: 100 },
            rotate : { x: 20, y: -20, z: 0 },
            position: { x: 0, y: 0, z: 0 }
        });
        
        this.f = [];
        
        this.f[0] = {
            color: "hsla(0, 100%, 70%, 1)",
            verticies: [ 0, 1, 2, 3 ]
        };

        this.f[1] = {
            color: "hsla(10, 100%, 70%, 1)",
            verticies: [ 1, 5, 6, 2 ]
        };
        
        this.f[2] = {
            color: "hsla(20, 100%, 70%, 1)",
            verticies: [ 5, 4, 7, 6 ]
        };
        
        this.f[3] = {
            color: "hsla(30, 100%, 70%, 1)",
            verticies: [ 4, 0, 3, 7 ]
        };
        
        this.f[4] = {
            color: "hsla(40, 100%, 70%, 1)",
            verticies: [ 4, 5, 1, 0 ]
        };
        
        this.f[5] = {
            color: "hsla(50, 100%, 70%, 1)",
            verticies: [ 3, 2, 6, 7 ]
        };
        

        
        this.cubeRotate = {
            x: 0,
            y: 0,
            z: 0
        };

        this.cubeSize = {
            x: WIN/5,
            y: HEI/5,
            z: WIN/5
        };
        
        this.cameraZoomDiff = 0.01;
        this.beginTime = +new Date();
        
        this.nowPoints = { x: 0, y: 0 };
        this.rotateDirection = 2;
    };
    
    Main.prototype.updatePosition = function(e) {
        this.nowPoints.y = e.clientX;
        this.nowPoints.x = e.clientY;
    };
    
    
    Main.prototype.mousemove = function(e) {
        
        if(e.clientY > this.nowPoints.x) {
            this.cubeRotate.x += this.rotateDirection;
        } else {
            this.cubeRotate.x -= this.rotateDirection;
        }
        
        if(e.clientX > this.nowPoints.y) {
            this.cubeRotate.y += this.rotateDirection;
        } else {
            this.cubeRotate.y -= this.rotateDirection;
        }

        this.updatePosition(e);
        this.draw();
        
    };
    

    
    Main.prototype.draw = function() {
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	
        var nowTime = +new Date();
        var diffTime = nowTime - this.beginTime;
        
        camera.update();
		
        
    	//this.cubeRotate.x += 0.4;
	    //this.cubeRotate.y += 0.5;
	    //this.cubeRotate.z += 0.4;		
        
        
    	for(var i=0; i<this.v.length; i++) {        
	    	this.v[i].affineIn.rotate = this.cubeRotate;
        	this.v[i].vertexUpdate();
        }  
        
        var _self = this;
        
               
        this.f.sort(
            function(a, b) {
                var pA = 0;
                for(var i=0; i<a.verticies.length; i++) {
                    pA += _self.v[a.verticies[i]].affineOut.p;
                    if(i === a.verticies.length-1) {
                        pA /= 4;
                    }
                }
                var pB = 0;
                for(i=0; i<b.verticies.length; i++) {
                    pB += _self.v[b.verticies[i]].affineOut.p;
                    if(i === b.verticies.length-1) {
                        pB /= 4;
                    }
                }
                if(pA < pB) {
                    return -1;
                }
                if(pA > pB) {
                    return 1;
                }
                return 0;
            }
        );
        for(i=0; i<this.f.length; i++) {
            this.ctx.beginPath();
            for(var j=0; j<this.f[i].verticies.length; j++) {
                if(j===0) {
                    this.ctx.moveTo(this.v[this.f[i].verticies[j]].affineOut.x, this.v[this.f[i].verticies[j]].affineOut.y);                    this.ctx.moveTo(this.v[this.f[i].verticies[j]].affineOut.x, this.v[this.f[i].verticies[j]].affineOut.y);
                } else {
                    this.ctx.lineTo(this.v[this.f[i].verticies[j]].affineOut.x, this.v[this.f[i].verticies[j]].affineOut.y);
                }
            }
            this.ctx.closePath();
            this.ctx.fillStyle = this.f[i].color;
            this.ctx.fill();
        }
    };

    
    Main.prototype.loop = function() {      
        /*
        window.requestAnimationFrame = (function(){
            return window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    window.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        var loop = function() {                                                                                                                                                                              
            this.draw(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        requestAnimationFrame(loop);  
        */
        this.draw();
    };
    
    Main.prototype.run = function() {
        this.loop();
    };
    
    var main = new Main();
    main.run();

    
})(jQuery, window, window.document);

                    
