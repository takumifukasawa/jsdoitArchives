// forked from takumifukasawa's "[2015.7.26] ベジェ曲線上で動き回る" http://jsdo.it/takumifukasawa/5iwq
(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 12;
    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
     
    var Shape = function(opts) {
        this.opt = opts || {};
        this.x = opts.x;
        this.y = opts.y;
        this.radius = 3;
        this.r = Math.floor(180 + Math.random()*50);
        this.g = Math.floor(100 + Math.random()*50);
        this.b = Math.floor(200 + Math.random()*50);
        this.a = 0.5;
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
        this.beginX = this.opt.x;
        this.beginY = this.opt.y;

        this.relPointX1 = Math.random()*window.innerWidth;
        this.relPointY1 = Math.random()*window.innerHeight;
        this.relPointX2 = Math.random()*window.innerWidth;
        this.relPointY2 = Math.random()*window.innerHeight;
        this.goalX = this.opt.x;
        this.goalY = this.opt.y;
        this.t = 0;
    };
   
    Shape.prototype.updatePixels = function() {
        if(this.t >= 1) {
            this.initializePoint();
        } else {
            this.setBezierPosition();
        }
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
        this.t += 30/3000;
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
        this.background;
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.$canvas = $("#my-canvas");
        this.canvas = this.$canvas[0];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = false;
        var r = window.innerHeight/2;
        var angle = 360 / NUM;
        
        for(var i=0; i<NUM; i++) {
            var opts = {
                x: r + (r-20)*Math.cos(angle*i*Math.PI/180),
                y: r + (r-20)*Math.sin(angle*i*Math.PI/180)
            };
            var shape = new Shape(opts);
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