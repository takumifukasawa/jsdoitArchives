var NUM = 300;
var WIN = window.innerWidth;
var HEI = window.innerHeight;


///////////////////////////////////////////
// utility
///////////////////////////////////////////

var dtr = function(d) { return d*Math.PI/180; };

var randomPos = function() { return Math.sin(Math.floor(Math.random()*360)*Math.PI/180); };


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

///////////////////////////////////////////
// vertex3d use affine transform
///////////////////////////////////////////


var vertex3d = function(param) {
    this.affineIn = {};
    this.affineOut = {};
    this.affineIn.vertex = (param.vertex);
    this.affineIn.size = (param.size);
    this.affineIn.rotate = (param.rotate);
    this.affineIn.position = (param.position);
};
vertex3d.prototype.vertexUpdate = function() {
    this.affineOut = affine.process(
        this.affineIn.vertex,
        this.affineIn.size,
        this.affineIn.rotate,
        this.affineIn.position,
        camera.display
    ); 
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0.5;
ctx.strokeStyle = "rgba(0, 0, 0, 1)";
ctx.fillStyle = "rgba(20, 180, 255, 1)";

var v = [];

for(var i=0, len=NUM; i<len; i++) {   
    v[i] = new vertex3d({
        vertex     : { x: randomPos(), y: randomPos(), z: randomPos() },
        size       : { x: 0, y: 0, z: 0 },
        rotate     : { x: 20, y: -20, z: 0 },
        position   : { x: 0, y: 0, z: 0 }
    });
}
        
        
var cubeRotate = {
    x: 0,
    y: 0,
    z: 0
};

var cubeSize = {
    x: WIN/2,
    y: HEI/2,
    z: WIN/2
};


var draw = function() {
	ctx.clearRect(0, 0, 465, 465);
	camera.update();
		
	cubeRotate.x += 2;
	cubeRotate.y += 1;
	cubeRotate.z += 0.5;
		
	for(var i=0; i<v.length; i++) {
		v[i].affineIn.rotate = cubeRotate;
        v[i].affineIn.size = cubeSize;
    	v[i].vertexUpdate();
        ctx.save();
        ctx.beginPath();
        ctx.arc(v[i].affineOut.x, v[i].affineOut.y, v[i].affineOut.p*2, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    } 
};

var loop = function() {    
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
        draw(); 
        requestAnimationFrame(loop);  
    };
    requestAnimationFrame(loop);  
};

loop();
                    
