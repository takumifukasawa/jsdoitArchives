// forked from takumifukasawa's "[2015.7.24] ついてくるパーティクル" http://jsdo.it/takumifukasawa/zx00
(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 20;

    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
     
    var Shape = function() {
        this.x = Math.random()*window.innerWidth;
        this.y = Math.random()*window.innerHeight;
        this.goalX = Math.random()*window.innerWidth;
        this.goalY = Math.random()*window.innerHeight;
        this.relX = Math.random()*2;
        this.relY = Math.random()*2;
        this.diffX = 0.03 * this.relX;
        this.diffY = 0.03 * this.relY;
        this.radius = Math.floor(1 + Math.random()*8);
        this.r = Math.floor(180 + Math.random()*50);
        this.g = Math.floor(100 + Math.random()*50);
        this.b = Math.floor(200 + Math.random()*50);
        this.a = Math.random()/5;
        this.color = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        this.t = 0;
        this.shape = null;
        this.initialize();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    };
    
    Shape.prototype.updatePixels = function() {
        if(Math.abs(this.goalX - this.x) < 10) {
            this.goalX = Math.random()*window.innerWidth;
        }
        if(Math.abs(this.goalY - this.y) < 10) {
            this.goalY = Math.random()*window.innerHeight;
        }
        this.x += (this.goalX - this.x) * this.diffX;
        this.y += (this.goalY - this.y) * this.diffY;
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