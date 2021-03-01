(function($, window, document, undefined) {
    
    "use strict";
    
    var WID       = window.innerWidth,
        HEI       = window.innerHeight,
        THROTTLE  = 10,
        DIV       = 14,
        NUM       = 30,
        MIN_SIZE  = 20,
        BOUND     = 0.95,
        DIFF      = 0.03,
        DIRECTION = 15,
        TIME      = 200;
   
    
    var Throttle = function(minInterval) {
        var _timeStamp = 0,
            _timerId;
        
        var exec = function(func) {
            var now   = +new Date(),
                delta = now - _timeStamp;

            clearTimeout(_timerId);
            if (delta >= minInterval) {
                _timeStamp = now;
                func();
            } else {
                _timerId = setTimeout(function() {
                    exec(func);
                }, minInterval - delta);
            }
        };
        
        return {
            exec : exec
        };
    };

 
    var Circle = function(opt) {
        this.opt = opt || {};
        this.x = this.opt.x || 0;
        this.y = this.opt.y || 0;
        this.radius = 0;
        this.r = this.opt.r || Math.floor(Math.random()*200);
        this.g = this.opt.g || Math.floor(Math.random()*200);
        this.b = this.opt.b || Math.floor(Math.random()*200);
        this.alpha = 0.1;
        this.color = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
        
        this.rel = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
        };
        this.rad = 0;
        this.dr = 1;
        this.moveX = 0;
        this.moveY = 0;
            
        this.initialize();
    };
    
    Circle.prototype.initRelPoint = function() {
        this.moveToX = DIRECTION*Math.cos(Math.random()*360*Math.PI/180);
        this.moveToY = DIRECTION*Math.sin(Math.random()*360*Math.PI/180);
    };
    
    Circle.prototype.initialize = function() {
        this.initRelPoint();
        setInterval(function() {
            this.initRelPoint();
        }.bind(this), TIME);
    };
    
    Circle.prototype.update = function(ctx) {
        this.moveX += (this.moveToX - this.rel.e)*DIFF;
        this.moveY += (this.moveToY - this.rel.f)*DIFF;
        this.moveX *= BOUND;
        this.moveY *= BOUND;        
        this.rel.e += this.moveX;
        this.rel.f += this.moveY;
       
        ctx.setTransform(this.rel.a, this.rel.b, this.rel.c, this.rel.d, this.rel.e, this.rel.f);
    };
    
    Circle.prototype.draw = function(ctx, size) {
        this.radius = size;
 
        this.update(ctx);
        
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.restore();
    };
 
    
    
    var Main = function() {
        this.scrollPos = 0;
        this.initialize();
    };

    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = WID;
        this.canvas.height = HEI;
       
        this.circles = [];
        var opt = {};
        
        for(var i=0, len=NUM; i<len; i++) {
            opt = {
                x: this.canvas.width/2,
                y: this.canvas.height/2
            };
            var circle = new Circle(opt);
            this.circles.push(circle);
        }
    };
    
    Main.prototype.update = function(scrollPos) {
        this.scrollPos = scrollPos;
    };
        
    Main.prototype.resetCanvas = function() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.restore();
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        for(var i=0, len=this.circles.length; i<len; i++) {
            this.circles[i].draw(this.ctx, MIN_SIZE+(this.scrollPos)/DIV);
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

        var loop = function() {                                                                                                                                                                              
            this.draw(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        requestAnimationFrame(loop);  

        this.draw();
    };
    
    var main = new Main();
    main.run();
    
    
    var throttle = new Throttle(THROTTLE);
    
    $(window).on("scroll", function() {
        throttle.exec(function() {
            main.update($(this).scrollTop());
        }.bind(this));
    });
    
})(jQuery, window, window.document, undefined);