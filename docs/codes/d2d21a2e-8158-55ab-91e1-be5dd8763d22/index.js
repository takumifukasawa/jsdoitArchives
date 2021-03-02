(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 20;

    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
     
    var Shape = function() {
        this.x = Math.random()*window.innerWidth;
        this.y = Math.random()*window.innerHeight;
        this.relX = Math.random()*2;
        this.relY = Math.random()*2;
        this.diffX = 0.1 * this.relX;
        this.diffY = 0.1 * this.relY;
        this.radius = Math.floor(1 + Math.random()*8);
        this.r = Math.floor(180 + Math.random()*50);
        this.g = Math.floor(100 + Math.random()*50);
        this.b = Math.floor(200 + Math.random()*50);
        this.a = Math.random()/5;
        this.color = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        this.shape = null;
        this.initialize();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    };
    
    Shape.prototype.updatePixels = function(mousePos) {
        this.x += (mousePos.x - this.x) * this.diffX;
        this.y += (mousePos.y - this.y) * this.diffY;
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
        createjs.Ticker.setFPS(10);
        this.stage.addEventListener("stagemousemove", this.recordMousePosition.bind(this), false);
    	createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.update.bind(this), false);       
    };
    
    Main.prototype.recordMousePosition = function(e) {
        this.mousePoint.x = e.stageX;
        this.mousePoint.y = e.stageY;
    };
    
    Main.prototype.update = function() {
        for(var i=0; i<NUM; i++) {
            this.shapes[i].updatePixels(this.mousePoint);
        }
        this.stage.update();
    };
    

    $(window).on("load", function() {
        var main = new Main();
    });

        
})(jQuery, window, window.document, undefined);