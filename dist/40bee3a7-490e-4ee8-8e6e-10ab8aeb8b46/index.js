(function($, win, doc) {

    "use strict";
    
    var WID         = window.innerWidth,
        HEI         = window.innerHeight,
        NUM         = 10,
        RADIUS      = WID/10,
        COL         = WID / RADIUS + 2,
        ROW         = HEI / RADIUS + 1,
        LIMIT       = 360;
    
    var Circle = function(opt) {
        this.opts           = opt || {};
        this.radius         = this.opts.radius || RADIUS;
        this.x              = this.opts.x || 0;
        this.y              = this.opts.y || 0;
        this.baseR          = this.radius;
        this.r              = 100;
        this.g              = 120;
        this.b              = 150;
        this.alpha          = 0;
        this.time           = LIMIT - (LIMIT * this.opts.index);
        
        this.initialize();
    };
   
    Circle.prototype.initialize = function() {
    };
    
    Circle.prototype.update = function(ctx) {
        this.time++;
        if(this.time > LIMIT) {
            this.time = 0;
        }       
        this.alpha = Math.sin(this.time * Math.PI/180);
    };
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();       
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
        ctx.globalCompositeOperation = "xor";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.closePath();
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
        
        this.circles = [];
        var circle;
        
        for(var i=0, len=COL; i<len; i++) {
            var diffX = i % 2;
            for(var s=0, sLen=ROW; s<len; s++) {
                circle = new Circle({
                    x: RADIUS*2*s - RADIUS*diffX - RADIUS,
                    y: RADIUS*i - RADIUS,
                    radius: RADIUS,
                    index: (s*i) / (COL*ROW) 
                });
            this.circles.push(circle);
            }
        }
    };
    
    Main.prototype.update = function() {
    };
        
    Main.prototype.resetCanvas = function() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        for(var i=0, len=this.circles.length; i<len; i++) {
            this.circles[i].update(this.ctx);
            this.circles[i].draw(this.ctx);
        }
    };
    
    Main.prototype.run = function() {
        
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

        var _self = this;

        var loop = function() {                                                                                                                                                                              
            _self.draw(); 
            requestAnimationFrame(loop);  
        };
        requestAnimationFrame(loop);  
        
        //this.draw();
    };
    
    var main = new Main();
    main.run();

    
})(jQuery, window, window.document);