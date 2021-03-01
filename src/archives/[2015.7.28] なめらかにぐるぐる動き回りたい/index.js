// forked from takumifukasawa's "[2015.7.26] ベジェ曲線上で動き回る" http://jsdo.it/takumifukasawa/5iwq
(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 1;
    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
     
    var Shape = function() {
        this.x = Math.random()*window.innerWidth;
        this.y = Math.random()*window.innerHeight;
        this.radius = 3;
        this.r = Math.floor(180 + Math.random()*50);
        this.g = Math.floor(100 + Math.random()*50);
        this.b = Math.floor(200 + Math.random()*50);
        this.a = 0.5;
        this.dt;
        this.color = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        this.shape = null;
        this.initialize();
        this.initializePoint();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    };
    
    Shape.prototype.initializePoint = function() {
        this.beginX = this.x;
        this.beginY = this.y;

        var dx1, dx2, dy1, dy2;
        if(this.relPointX1 > window.innerWidth/2) {
            dx1 = -1;
        } else {
            dx1 = 1;
        }
        if(this.relPointY1 > window.innerHeight/2) {
            dy1 = -1;
        } else {
            dy1 = 1;
        }
        if(this.relPointX2 > window.innerWidth/2) {
            dx2 = -1;
        } else {
            dx2 = 1;
        }
        if(this.relPointY2 > window.innerHeight/2) {
            dy2 = -1;
        } else {
            dy2 = 1;
        }
        
        this.relPointX1 = window.innerWidth/2 + (100 * dx1);
        this.relPointX2 = window.innerWidth/2 + (Math.random()*window.innerWidth/5 * dx2);
        this.relPointY1 = window.innerHeight/2 + (Math.random()*window.innerWidth/5 * dy1);
        this.relPointY2 = window.innerHeight/2 + (Math.random()*window.innerWidth/5 * dy2);

        //this.relPointY1 = Math.random()*window.innerHeight;
        //this.relPointX2 = Math.random()*window.innerWidth;
        //this.relPointY2 = Math.random()*window.innerHeight;
        
        var dGoalX, dGoalY;
        if(this.goalX > window.innerWidth) {
            dGoalX = -1;
        } else {
            dGoalX = 1;
        }
        if(this.goalY > window.innerHeight) {
            dGoalY = -1;
        } else {
            dGoalY = 1;
        }
        this.goalX = window.innerWidth/2 + (Math.random()*window.innerWidth/5 * dGoalX);
        this.goalY = window.innerHeight/2 + (Math.random()*window.innerHeight/5 * dGoalY);
        this.t = 0;
        //this.dt = 2000 + Math.random()*1000; 
        this.dt = 2000;
    };
   
    Shape.prototype.updatePixels = function() {
        if(this.t > 1) {
            this.initializePoint();
        }
        this.setBezierPosition();
    };
    
    Shape.prototype.setBezierPosition = function() {
        this.x = (Math.pow(1-this.t, 3))*this.beginX +
                    3*this.t*(Math.pow(1-this.t, 2))*this.relPointX1 +
                    3*(Math.pow(this.t, 2))*(1-this.t)*this.relPointX2 +
                    (Math.pow(this.t, 3))*this.goalX;
        this.y = (Math.pow(1-this.t, 3))*this.beginY +
                    3*this.t*(Math.pow(1-this.t, 2))*this.relPointX2 +
                    3*(Math.pow(this.t, 2))*(1-this.t)*this.relPointY2 +
                    (Math.pow(this.t, 3))*this.goalY;
        this.t += 30/this.dt;
    };
       
        
    /////////////////////////////////
    // Main
    /////////////////////////////////
      
    var Main = function() {
        this.$canvas = null;
        this.canvas = null;
        this.shapes = [];
        this.stage = null;
        this.mousePoint = new createjs.Point();
        this.fading = 0.05;
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.$canvas = $("#my-canvas");
        this.canvas = this.$canvas[0];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = false;
        for(var i=0; i<NUM; i++) {
            var shape = new Shape();
            this.shapes.push(shape);
            this.stage.addChild(shape);
        }            

    	this.addBackground(this.fading);
    	createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this), false);       
    };
    
    Main.prototype.update = function() {
        for(var i=0; i<NUM; i++) {
            this.shapes[i].updatePixels();
        }
        this.stage.update();
    };
    
    Main.prototype.addBackground = function(alpha) {
        this.background = new createjs.Shape();
        this.background.graphics
            .beginFill("black")
	        .drawRect(0, 0, this.canvas.width, this.canvas.height)
	        .endFill();
	    this.stage.addChild(this.background);
	    this.background.alpha = alpha;
    };   

    $(window).on("load", function() {
        var main = new Main();
    });

        
})(jQuery, window, window.document, undefined);