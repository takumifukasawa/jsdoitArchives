(function(window, document, undefined) {
    
    "use strict";
    
    var NUM = 2200;
    var RADIUS = 2;
    var LINE_WIDTH = 1;
    var NODE_LIMIT = 15;
    var BASE_TIME = 8;
    var DIRECTIONAL_TIME = 4;
    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
    
    var Shape = function(opts) {
        this.opts = opts || {};   
        this.points = [];
        this.radius = RADIUS;
        this.t = 0;
        this.dt = ((BASE_TIME+Math.random()*DIRECTIONAL_TIME) / 1000);
        this.bezierPoints = {};
        this.initialize();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {
        
        // ベジェ曲線をコントロールする3点
        for(var i=0; i<3; i++) {
            var point = {
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight
            };
            this.points.push(point);
        }     
        /*
        this.color = "rgba(255, 150, 100, 0.2)";
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
        */
    };
    
    Shape.prototype.setBezierPosition = function(points) {
        var t = this.t;
        var tp = 1 - this.t;
        
	    this.x = t*t*points.goalX + 2*t*tp*points.controllX + tp*tp*points.beginX;
	    this.y = t*t*points.goalY + 2*t*tp*points.controllY + tp*tp*points.beginY;

        this.t += this.dt;
    };
        
    Shape.prototype.update = function() {
        
        // ベジェ曲線上を動き終わったらリセット
        if(this.t >= 1) {
            this.t = 0;
            this.dt = ((BASE_TIME+Math.random()*DIRECTIONAL_TIME) / 1000);
            var newPoint = {
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight
            };
            this.points.shift();
            this.points.push(newPoint);
        }
        
        this.bezierPoints = {
            beginX: (this.points[0].x + this.points[1].x) / 2,
            beginY: (this.points[0].y + this.points[1].y) / 2,
            goalX: (this.points[1].x + this.points[2].x) / 2,
            goalY: (this.points[1].y + this.points[2].y) / 2,
            controllX: this.points[1].x,
            controllY: this.points[1].y
        };
        
        this.setBezierPosition(this.bezierPoints);
    };
    
    Shape.prototype.getPoints = function() {
        return { x: this.x, y: this.y };
    };

       
    /////////////////////////////////
    // Main
    /////////////////////////////////
    
    var Main = function() {
        this.canvas = null;
        this.stage = null;
        this.bg = null;
        
        this.shapes = [];
        this.points = [];

        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        
        this.stage = new createjs.Stage(this.canvas);
        
        this.bg = new createjs.Shape();
        this.stage.addChild(this.bg);
        
        this.shapeBg = new createjs.Shape();
        this.stage.addChild(this.shapeBg);
        
        for(var s=0; s<NUM; s++) {
            var shape = new Shape();
            this.stage.addChild(shape);  
            this.shapes.push(shape);
        }
        
        this.trianglePoints = [];
      
        createjs.Ticker.setFPS(10);
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        //this.update();
    };
    
    Main.prototype.update = function() {
        this.bg.graphics.clear();

        for(var i=0, shapeLen=this.shapes.length; i<shapeLen; i++) {
            this.shapes[i].update();
            this.points[i] = this.shapes[i].getPoints();
        }
        
        this.linesPoints = [];
        
        for(var s=0, pointsLen=this.points.length; s<pointsLen; s++) {
            
            var p1 = this.points[s];
            
            this.trianglePoints = [];
            this.trianglePoints.push(p1);
            this.drawedShape = false;
            
            for(var j=0, nowPointsLen=this.points.length; j<nowPointsLen; j++) {
                if(j===s) continue;

                var p2 = this.points[j];
                
                var pointsLength = this.getPointsLength(p1, p2);

                if(pointsLength<NODE_LIMIT) {            
                    var diff = (NODE_LIMIT-pointsLength) / NODE_LIMIT;
                    //this.updateBg([p1, p2], diff);
                    this.trianglePoints.push(p2);
                }
                if(this.trianglePoints.length > 2 && !this.drawedShape) {
                    this.updateShapeBg(this.trianglePoints);
                    this.drawedShape = true;
                }               
            }
        }

        this.stage.update();
        
        
        this.ctx.save();
            var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var i, r, g, b, a;
            for(var y=0, yLen=this.canvas.width; y<yLen; y++) {
                for(var x=0, xLen=this.canvas.height; x<xLen; x++) {
                    i = y*this.canvas.width+x;
                    if(
                        imageData.data[i*4] === 0 ||
                        imageData.data[i*4+1] === 0 ||
                        imageData.data[i*4+2] === 0
                    ) continue;
                    imageData.data[i*4] = imageData.data[i*4]+Math.random()*150;
                    imageData.data[i*4+1] = imageData.data[i*4+1]+Math.random()*150;
                    imageData.data[i*4+2] = imageData.data[i*4+2]+Math.random()*150;
                    imageData.data[i*4+3] = imageData.data[i*4+3]+Math.random()*10;
                }
            }
        this.ctx.restore();
        this.ctx.putImageData(imageData, 0, 0);  
    };
    
    Main.prototype.updateBg = function(p, alpha) {
        this.bg.graphics.setStrokeStyle(LINE_WIDTH);
        this.bg.graphics.beginStroke("rgba(255,150,100," + alpha + ")");
        this.bg.graphics.moveTo(p[0].x, p[0].y);
        this.bg.graphics.lineTo(p[1].x, p[1].y);
    };
    
    Main.prototype.updateShapeBg = function(points) {
        this.bg.graphics.beginFill("rgba(255,150,100,0.2)");
        this.bg.graphics
            .moveTo(points[0].x, points[0].y)
            .lineTo(points[1].x, points[1].y)
            .lineTo(points[2].x, points[2].y);
        this.bg.graphics.endFill();
    };
    
    Main.prototype.getPointsLength = function(p1, p2) {
        var x = p1.x-p2.x;
        var y = p1.y-p2.y;
        return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    };

    window.addEventListener("load", function() {
        var main = new Main();
    });
    
})(window, window.document, undefined);
