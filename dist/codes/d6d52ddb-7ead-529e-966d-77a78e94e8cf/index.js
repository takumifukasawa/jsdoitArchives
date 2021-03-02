(function($, window, document, undefined) {

    "use strict";
    
    var WID = window.innerWidth,
        HEI = window.innerHeight,
        NUM = 6,
        SLICES = NUM,
        HALF_PI = Math.PI / 2,
        TWO_PI = Math.PI * 2,
        IMG_SRC = "/common/img/photo-1474821792123-fa67193d18a5.jpeg";
     
    var Kaleidscope = function(opt) {
        this.opts = opt || {};
        this.ctx = this.opts.ctx;     
        this.offsetRotation = 0.0;
        this.offsetScale = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.radius = WID/2;
        this.zoom = 1.0;
        this.image = this.opts.image;
        this.index = this.opts.index;
 
        this.ctx.fillStyle = this.ctx.createPattern(this.image, 'repeat');
        
        this.scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
        this.step = TWO_PI / SLICES;
        this.cx = this.image.width / 2; 
    };

    Kaleidscope.prototype.initialize = function() {
    };
    
    Kaleidscope.prototype.update = function(ctx) {
    };
    
    Kaleidscope.prototype.draw = function(ctx) {
        ctx.save();
        
        ctx.translate(this.radius, this.radius);
        ctx.rotate(this.index * this.step);
      
        ctx.beginPath();
        ctx.moveTo(-0.5, -0.5);
        ctx.arc(0, 0, this.radius, this.step * -0.51, this.step * 0.51, false);
        ctx.lineTo(0.5, 0.5);
        ctx.closePath();
        
        ctx.rotate(HALF_PI);
        ctx.scale(this.scale, this.scale);
        
        ctx.scale([-1,1][this.index % 2], 1);
        ctx.translate(this.offsetX - this.cs, this.offsetY);
        ctx.rotate(this.offsetRotation);
        ctx.scale(this.offsetScale, this.offsetScale);
      
        ctx.fill();

        ctx.restore();
    };
    

    var Main = function() {
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "my-canvas";
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = WID;
        this.canvas.height = HEI;  
        this.grd = null;
        
        this.image = new Image();
        this.image.src = IMG_SRC;
 
        this.circles = [];
        var opt = {};
        var circle;
        
        this.image.onload = function() {        
            for(var i=0, len=NUM; i<len; i++) {
                opt = {
                    index: i,
                    image: this.image,
                    ctx: this.ctx
                };
                circle = new Kaleidscope(opt);
                this.circles.push(circle);
            }
            this.run();
        }.bind(this);
    };
    
    Main.prototype.update = function() {
    };
        
    Main.prototype.resetCanvas = function() {
        this.ctx.save();
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.restore();
    };
    
    Main.prototype.front = function() {
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        for(var i=0, len=this.circles.length; i<len; i++) {
            this.circles[i].draw(this.ctx);
        }

    };
    
    Main.prototype.run = function() {
        /*
        window.requestAnimationFrame = (function(){
            return window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    window.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        
        var loop = function() {                                                                                                                                                                              
            this.draw(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        requestAnimationFrame(loop);  
        */
        this.draw();
    };
    
    var main = new Main();

    
})(jQuery, window, window.document, undefined);