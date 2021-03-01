(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 20;
    
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
        this.a = Math.random()/3;
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

        this.relPointX1 = Math.random()*window.innerWidth;
        this.relPointY1 = Math.random()*window.innerHeight;
        this.relPointX2 = Math.random()*window.innerWidth;
        this.relPointY2 = Math.random()*window.innerHeight;
        this.goalX = Math.random()*window.innerWidth;
        this.goalY = Math.random()*window.innerHeight;
        this.t = 0;
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
        this.t += 30/4000;
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
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.$canvas = $("#my-canvas");
        this.canvas = this.$canvas[0];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.stage = new createjs.Stage(this.canvas);
        
        for(var i=0; i<NUM; i++) {
            var shape = new Shape();
            this.shapes.push(shape);
            this.stage.addChild(shape);
        }            

    	createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this), false);       
    };
    
    Main.prototype.update = function() {
        for(var i=0; i<NUM; i++) {
            this.shapes[i].updatePixels();
        }
        this.stage.update();
    };
    

    $(window).on("load", function() {
        var main = new Main();
    });

        
})(jQuery, window, window.document, undefined);