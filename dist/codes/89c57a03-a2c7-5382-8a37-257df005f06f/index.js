var camera = {
    self: {
        x: 0,
        y: 0,
        z: 465
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
        x: 465/2,
        y: 465/2,
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

var dtr = function(d) {
    return d*Math.PI/180;
};

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

var vertex3d = function(param) {
    this.affineIn = {};
    this.affineOut = {};
    this.affineIn.vertex = (param.vertex);
    this.affineIn.size = (param.size);
    this.affineIn.rotate = (param.rotate);
    this.affineIn.position = (param.position);
};
vertex3d.prototype = {
    vertexUpdate: function() {
        this.affineOut = affine.process(
            this.affineIn.vertex,
            this.affineIn.size,
            this.affineIn.rotate,
            this.affineIn.position,
            camera.display
        );
    }
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 0.5;
ctx.strokeStyle = "rgba(0, 0, 0, 1)";
ctx.fillStyle = "rgba(20, 180, 255, 1)";

var v = [];
v[0] = new vertex3d({
    vertex     : { x: -1, y: 1, z: 1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 10 },
    position   : { x: 0, y: 0, z: 0 }
});

v[1] = new vertex3d({
    vertex     : { x: 1, y: 1, z: 1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});
                    

v[2] = new vertex3d({
    vertex     : { x: 1, y: -1, z: 1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});
                    

v[3] = new vertex3d({
    vertex     : { x: -1, y: -1, z: 1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});
                    

v[4] = new vertex3d({
    vertex     : { x: -1, y: 1, z: -1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});

v[5] = new vertex3d({
    vertex     : { x: 1, y: 1, z: -1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});
                    
                    

v[6] = new vertex3d({
    vertex     : { x: 1, y: -1, z: -1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});
                    

v[7] = new vertex3d({
    vertex     : { x: -1, y: -1, z: -1 },
    size       : { x: 100, y: 100, z: 100 },
    rotate     : { x: 20, y: -20, z: 0 },
    position   : { x: 0, y: 0, z: 0 }
});

var cubeRotate = {
    x: 0,
    y: 0,
    z: 0
};

var loop = function() {
	setTimeout(function() {
		ctx.clearRect(0, 0, 465, 465);
		camera.update();
		
		cubeRotate.x += 0.5;
		cubeRotate.y += 1;
		cubeRotate.z += 3;
		
		for(var i=0; i<v.length; i++) {
			v[i].affineIn.rotate = cubeRotate;
			v[i].vertexUpdate();
        }
		
		ctx.beginPath();
        
		ctx.moveTo(v[0].affineOut.x, v[0].affineOut.y);
		ctx.lineTo(v[1].affineOut.x, v[1].affineOut.y);
		ctx.lineTo(v[2].affineOut.x, v[2].affineOut.y);
		ctx.lineTo(v[3].affineOut.x, v[3].affineOut.y);
		ctx.lineTo(v[0].affineOut.x, v[0].affineOut.y);
		
		ctx.moveTo(v[4].affineOut.x, v[4].affineOut.y);
		ctx.lineTo(v[5].affineOut.x, v[5].affineOut.y);
		ctx.lineTo(v[6].affineOut.x, v[6].affineOut.y);
		ctx.lineTo(v[7].affineOut.x, v[7].affineOut.y);
		ctx.lineTo(v[4].affineOut.x, v[4].affineOut.y);
		
		ctx.moveTo(v[0].affineOut.x, v[0].affineOut.y);
		ctx.lineTo(v[4].affineOut.x, v[4].affineOut.y);

		ctx.moveTo(v[1].affineOut.x, v[1].affineOut.y);
		ctx.lineTo(v[5].affineOut.x, v[5].affineOut.y);
		
		ctx.moveTo(v[2].affineOut.x, v[2].affineOut.y);
		ctx.lineTo(v[6].affineOut.x, v[6].affineOut.y);

        ctx.moveTo(v[3].affineOut.x, v[3].affineOut.y);
		ctx.lineTo(v[7].affineOut.x, v[7].affineOut.y);
       
		ctx.stroke();

		loop();
	}, 1000/60);
};

loop();
                    
