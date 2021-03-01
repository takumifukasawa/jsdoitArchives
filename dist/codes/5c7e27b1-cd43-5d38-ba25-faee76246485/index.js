(function(window, document, undefined) {
    
    "use strict";
    
    var NUM = 1;
    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
    
    var Shape = function(opts) {
        this.opts = opts || {};   
        this.points = [];
        this.radius = 5;
        this.t = 0;
        this.dt = 20 / 1000;
        this.initialize();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {      
        this.color = "rgba(255, 0, 0, 1)";
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    };
    
    Shape.prototype.setBezierPosition = function() {
        var t = this.t;
        var tp = 1 - this.t;
        
	    this.x = t*t*this.points.goalX + 2*t*tp*this.points.controllX + tp*tp*this.points.beginX;
	    this.y = t*t*this.points.goalY + 2*t*tp*this.points.controllY + tp*tp*this.points.beginY;

        this.t += this.dt;
    };
        
    Shape.prototype.update = function(points) {
        this.points = points;
        this.setBezierPosition();
    };

    /////////////////////////////////
    // Main
    /////////////////////////////////
    
    var Main = function() {
        this.canvas = null;
        this.stage = null;
        this.shape = null;
        
        this.controllPoints = [];
        this.controllLines = [];
        this.points = [];    
        this.bezierLine = null;
        this.centerPoints = [];

        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = true;
 
        // ベジェ曲線が制御する線
        for(var s=0; s<2; s++) {
            var controllLine = new createjs.Shape();
            this.controllLines.push(controllLine);
            this.stage.addChild(controllLine);
        }
        
        // ベジェ曲線の軌跡
        this.bezierLine = new createjs.Shape();
        this.stage.addChild(this.bezierLine);

        // ベジェ曲線をコントロールする3点
        for(var i=0; i<3; i++) {
            var point = {
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight
            };
            this.points.push(point);
          
            var controllPoint = new createjs.Shape();
            this.controllPoints.push(controllPoint);
            this.stage.addChild(controllPoint);
        }
        
        // 中点
        for(var j=0; j<2; j++) {
            var centerPoint = new createjs.Shape();
            this.centerPoints.push(centerPoint);
            this.stage.addChild(centerPoint);
        }

        // 軌跡を動く点
        this.shape = new Shape();
        this.stage.addChild(this.shape);  
   
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        //this.update();
    };
    
    Main.prototype.update = function() {
        // ベジェ曲線上を動き終わったらリセット
        if(this.shape.t >= 1) {
            this.shape.t = 0;
            var newPoint = {
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight
            };
            this.points.shift();
            this.points.push(newPoint);
        }

        // 任意に定めた三点
        for(var j=0; j<this.controllPoints.length; j++) {
            this.controllPoints[j].graphics.clear();
            this.controllPoints[j].graphics
                .beginFill("blue")
                .drawCircle(this.points[j].x, this.points[j].y, 2)
                .endFill();
        }

        // 制御線
        for(var s=0; s<this.controllLines.length; s++) {
            this.controllLines[s].graphics.clear();
            this.controllLines[s].graphics
                .setStrokeStyle(1)
                .beginStroke("rgba(210, 210, 210, 0.5");
            this.controllLines[s].graphics
                .moveTo(this.points[s].x, this.points[s].y)
                .lineTo(this.points[s+1].x, this.points[s+1].y);
        }
        
        var bezierPoints = {
            beginX: (this.points[0].x + this.points[1].x) / 2,
            beginY: (this.points[0].y + this.points[1].y) / 2,
            goalX: (this.points[1].x + this.points[2].x) / 2,
            goalY: (this.points[1].y + this.points[2].y) / 2,
            controllX: this.points[1].x,
            controllY: this.points[1].y
        };
            
        // ベジェ曲線の軌跡
        this.bezierLine.graphics.clear();
        this.bezierLine.graphics
            .setStrokeStyle(1)
            .beginStroke("rgba(210, 210, 210, 0.8");
        this.bezierLine.graphics
            .moveTo(bezierPoints.beginX, bezierPoints.beginY)
            .curveTo(bezierPoints.controllX, bezierPoints.controllY, bezierPoints.goalX, bezierPoints.goalY);

        // ベジェ曲線の制御点
        for(var k=0; k<this.centerPoints.length; k++) {
            this.centerPoints[k].graphics.clear();

            var x = (k===0) ? bezierPoints.beginX : bezierPoints.goalX;
            var y = (k===0) ? bezierPoints.beginY : bezierPoints.goalY;
            
            this.centerPoints[k].graphics
                .beginFill("yellow")
                .drawCircle(x, y, 2)
                .endFill();
        }
        
        this.shape.update(bezierPoints);
        
        this.stage.update();
    };
    
    window.addEventListener("load", function() {
        var main = new Main();
    });
    
})(window, window.document, undefined);
