// forked from takumifukasawa's "[2015.9.23] ctx.shadowBlurを試す" http://jsdo.it/takumifukasawa/oJaB
// forked from takumifukasawa's "[2015.9.14] 動くノードに面を貼る" http://jsdo.it/takumifukasawa/gsDV
(function(window, document, undefined) {
    
    "use strict";
    
    var NUM = 2;
    var RADIUS = 1;
    var LINE_WIDTH = 1;
    var NODE_LIMIT = 90;
    var BASE_TIME = 5;
    var DIRECTIONAL_TIME = 2;
    
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
        
        this.color = "rgba(255, 150, 100, 1)";
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
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

        this.ctx.shadowColor = 'rgba(255, 255, 100, 0.9)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        
        this.stage = new createjs.Stage(this.canvas);
        
        for(var s=0; s<NUM; s++) {
            var shape = new Shape();
            this.stage.addChild(shape);  
            this.points.push(shape);
        }
        
        this.trianglePoints = [];
      
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        //this.update();
    };
    
    Main.prototype.update = function() {    
        for(var i=0, shapeLen=this.points.length; i<shapeLen; i++) {
            this.points[i].update();
        }
        
        this.stage.update();
           
    };
    

    window.addEventListener("load", function() {
        var main = new Main();
    });
    
})(window, window.document, undefined);
