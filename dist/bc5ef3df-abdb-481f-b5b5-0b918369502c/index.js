var NUM = 200;
var WIN = window.innerWidth;
var HEI = window.innerHeight;
var LIMIT = 65;


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
        this.r = 20 + Math.floor(120*Math.random());
        this.b = 20 + Math.floor(100*Math.random());
        this.g = 20 + Math.floor(80*Math.random());
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
        
        this.velo = 0.08;
        this.limitT = 360;
        this.diff = 70;
        this.firstPos = 100;

        this.initialize();
    };

    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        
        this.canvas.width = win.innerWidth;
        this.canvas.height = win.innerHeight;
        
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = 0.5;

        this.v = [];
        this.dist = [];
        this.times = [];

        for(var i=0, len=NUM; i<len; i++) {   
           this.v[i] = new Vertex3d({
               vertex     : { x: randomPos(), y: randomPos(), z: randomPos() },
               size       : { x: 0, y: 0, z: 0 },
               rotate     : { x: 20, y: -20, z: 0 },
               position   : { x: this.diff*Math.sin(360*Math.random()*Math.PI/180),
                              y: this.diff*Math.sin(360*Math.random()*Math.PI/180),
                              z: this.diff*Math.sin(360*Math.random()*Math.PI/180) }
            });
            this.times[i] = { x: 360*Math.random(),
                              y: 360*Math.random(),
                              z: 360*Math.random() };    
        }
        
        
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
    };


    Main.prototype.draw = function() {
	    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	camera.update();
		
    	this.cubeRotate.x += 0.3;
	    this.cubeRotate.y += 0.5;
	    this.cubeRotate.z += 0.2;
		
    	for(var i=0; i<this.v.length; i++) {

            for(var val in this.times[i]) {
                if(this.times[i].hasOwnProperty(val)) {
                    this.times[i][val] += this.velo;
                   if(this.times[i][val] > this.limitT) this.times[i][val] = 0;
                }
            }
            
            this.v[i].affineIn.position = {
                x: this.diff*Math.cos(this.times[i].x*Math.PI/180),
                y: this.diff*Math.sin(this.times[i].y*Math.PI/180),
                z: this.diff*Math.sin(this.times[i].z*Math.PI/180)
            };
            
	    	this.v[i].affineIn.rotate = this.cubeRotate;
            this.v[i].affineIn.size = this.cubeSize;
        	this.v[i].vertexUpdate();
            
            this.ctx.restore();
                
            this.dist[i] = {
                x: this.v[i].affineOut.x,
                y: this.v[i].affineOut.y,
                z: this.v[i].affineOut.z,
                r: this.v[i].r,
                g: this.v[i].g,
                b: this.v[i].b
            };
        }    
    
        for(var s=0; s<this.dist.length; s++) {
            for(var k=0; k<this.dist.length; k++) {
                if(s===k) continue;
            
                var distan = distance(this.dist[s], this.dist[k]);
     
                if(distan < LIMIT) {
                    this.ctx.save();
                    this.ctx.beginPath();

                    var r = this.dist[s].r + this.dist[k].r,
                        g = this.dist[s].g + this.dist[k].g,
                        b = this.dist[s].b + this.dist[k].b,
                        alpha = (LIMIT - distan) / LIMIT;
                    this.ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
                    //this.ctx.strokeStyle = "rgba(20, 180, 255, " + alpha + ")";
                    this.ctx.moveTo(this.dist[s].x, this.dist[s].y);
                    this.ctx.lineTo(this.dist[k].x, this.dist[k].y);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
       }  
    };

    
    Main.prototype.loop = function() {      
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
        
    };
    
    Main.prototype.run = function() {
        this.loop();
    };
    
    var main = new Main();
    main.run();

    
})(jQuery, window, window.document);

                    
