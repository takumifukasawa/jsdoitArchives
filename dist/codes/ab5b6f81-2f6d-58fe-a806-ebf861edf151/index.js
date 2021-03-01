// forked from takumifukasawa's "[2015.8.6] 動きつづけ結びつづける" http://jsdo.it/takumifukasawa/eEVq
(function(window, document, undefined) {
    
    "use strict";
    
    var NUM = 5;
    var RADIUS = 2;
    var LINE_WIDTH = 1;
    var NODE_LIMIT = 90;
    var BASE_TIME = 2;
    var DIRECTIONAL_TIME = 10;
    var BASE_LIFE = 1;
    var LIFE_LIMIT = 3;
    
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
        this.life = BASE_LIFE + Math.floor(Math.random()*3);
        this.nowLife = 0;
        this.initialize();
        //this.x = Math.random()*window.innerWidth;
        //this.y = Math.random()*window.innerHeight;
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
        
        this.color = "rgba(255, 150, 100, 0.2)";
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    };
    
    Shape.prototype.getLife = function() {
        return this.nowLife;
    };
    
    Shape.prototype.setBezierPosition = function(points) {
        var t = this.t;
        var tp = 1 - this.t;
        
	    this.x = t*t*points.goalX + 2*t*tp*points.controllX + tp*tp*points.beginX;
	    this.y = t*t*points.goalY + 2*t*tp*points.controllY + tp*tp*points.beginY;

        this.t += this.dt;
    };
        
    Shape.prototype.update = function(mousePoint) {
        
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
            this.nowLife++;
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
        this.deletePoints = [];
        this.mousePoints = new createjs.Point();
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        
        this.stage = new createjs.Stage(this.canvas);
        
        this.clickBg = new createjs.Shape();
        this.stage.addChild(this.clickBg);
        
        this.bg = new createjs.Shape();
        this.stage.addChild(this.bg);
        
        for(var s=0; s<NUM; s++) {
            var shape = new Shape();
            this.stage.addChild(shape);  
            this.shapes.push(shape);
        }
      
        this.clickBg.addEventListener("click", this.addPoint.bind(this));
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        //this.update();
    };
    
    Main.prototype.update = function() {
        this.bg.graphics.clear();
        this.clickBg.graphics.clear();
        this.clickBg.graphics.beginFill("#000").drawRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.deletePoints = [];
        
        for(var i=0, shapeLen=this.shapes.length; i<shapeLen; i++) {
            this.shapes[i].update(this.mousePoints);
            if(this.shapes[i].getLife() >= LIFE_LIMIT) {
                this.deletePoints.push(i);
                this.stage.removeChild(this.shapes[i]);
            }
            this.points[i] = this.shapes[i].getPoints();
        }
        
        if(this.deletePoints.length>0) {
            //console.log("has delete");   
            for(var k=0, deleteLen=this.deletePoints.length; k<deleteLen; k++) {
                var index = this.deletePoints[k];
                this.shapes.splice(index, 1);
                this.points.splice(index, 1);
            }
        }
        
        //this.linesPoints = [];
        
        for(var s=0, pointsLen=this.points.length; s<pointsLen; s++) {
            for(var j=0, nowPointsLen=this.points.length; j<nowPointsLen; j++) {
                if(j===s) continue;
                var p1 = this.points[s],
                    p2 = this.points[j];
                var pointsLength = this.getPointsLength(p1, p2);

                if(pointsLength<NODE_LIMIT) {            
                    var diff = (NODE_LIMIT-pointsLength) / NODE_LIMIT;
                    this.updateBg([p1, p2], diff);
                }
            }
        }

        this.stage.update();
           
    };
    
    Main.prototype.updateBg = function(p, alpha) {
        this.bg.graphics.setStrokeStyle(LINE_WIDTH);
        this.bg.graphics.beginStroke("rgba(255,150,100," + alpha + ")");
        this.bg.graphics.moveTo(p[0].x, p[0].y);
        this.bg.graphics.lineTo(p[1].x, p[1].y);
    };
    
    Main.prototype.getPointsLength = function(p1, p2) {
        var x = p1.x-p2.x;
        var y = p1.y-p2.y;
        return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    };
    
    Main.prototype.addPoint = function(e) {
        var shape = new Shape();
        this.stage.addChild(shape);  
        this.shapes.push(shape);
    };
    
    Main.prototype.recordMousePosition = function(e) {
        this.mousePoints.x = e.stageX;
        this.mousePoints.y = e.stageY;
    };

    window.addEventListener("load", function() {
        var main = new Main();
    });
    
})(window, window.document, undefined);
