// forked from takumifukasawa's "[2015.8.17] 万華鏡（静止）" http://jsdo.it/takumifukasawa/moGq
(function($, window, document, undefined) {

    "use strict";
    
    var WID = window.innerWidth,
        HEI = window.innerHeight,
        SLICES = 12,
        HALF_PI = Math.PI / 2,
        TWO_PI = Math.PI * 2,
        IMG_SRC = "/jsdoitArchives/assets/img/photo-1464822759023-fed622ff2c3b.jpg",
        
        NUM = 40,
        RADIUS = 120,
        BOUND = 0.92,
        DIFF = 0.04,
        DIRECTION = 50,
        TIME = 250;

    
    /////////////////////////////////////////////////
    // Kaleidscope Class
    /////////////////////////////////////////////////
    
    var Kaleidscope = function(opt) {
        this.opts = opt || {};
        
        if(!this.opts.slices) throw new Error("please input data.");
        
        this.slices = this.opts.slices;
        this.ctx = this.opts.ctx;     
        this.offsetRotation = 0.0;
        this.offsetScale = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.radius = WID/2;
        this.zoom = 1.0;
        this.image = this.opts.image;
        this.index = this.opts.index;
 
        //this.ctx.fillStyle = this.ctx.createPattern(this.image, 'repeat');
        
        this.scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
        this.step = TWO_PI / this.slices;
        this.cx = this.image.width / 2; 
    };
    
    Kaleidscope.prototype.draw = function(ctx, img) {
        for(var i=0, len=this.slices; i<len; i++) {
            ctx.save();
              
            
            ctx.fillStyle = ctx.createPattern(img, 'repeat');
            //ctx.putImageData(img, 0, 0);    
            
            ctx.translate(this.radius, this.radius);
            ctx.rotate(i * this.step);
      
            ctx.beginPath();
            ctx.moveTo(-0.5, -0.5);
            ctx.arc(0, 0, this.radius, this.step * -0.51, this.step * 0.51, false);
            ctx.lineTo(0.5, 0.5);
            ctx.closePath();
        
            ctx.rotate(HALF_PI);
            ctx.scale(this.scale, this.scale);
        
            ctx.scale([-1,1][i % 2], 1);
            ctx.translate(this.offsetX - this.cs, this.offsetY);
            ctx.rotate(this.offsetRotation);
            ctx.scale(this.offsetScale, this.offsetScale);
      
            ctx.fill();


            ctx.restore();
        }
    };


    /////////////////////////////////////////////////
    // Circle Class
    /////////////////////////////////////////////////
    
    var Circle = function(opt) {
        this.opt = opt || {};
        this.x = this.opt.x || 0;
        this.y = this.opt.y || 0;
        this.radius = this.opt.radius || RADIUS;
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
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();
        ctx.beginPath();
        this.update(ctx);
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.restore();
    };

    
    
    
    /////////////////////////////////////////////////
    // Main Class
    /////////////////////////////////////////////////
    
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
        
        this.tmpImage = new Image();
 
        this.scope = null;
        var opt = {};
        
        this.circles = [];
        var circle,
            circleOpt = {};
        
        this.image.onload = function() {
            opt = {
                image: this.image,
                ctx: this.ctx,
                slices: SLICES
            };
            this.scope = new Kaleidscope(opt);
            
            for(var i=0, len=NUM; i<len; i++) {
                circleOpt = {
                    x: WID/2,
                    y: HEI/2,
                    radius: RADIUS+Math.random()*50
                };
                circle = new Circle(circleOpt);
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
        //this.bitMap = this.ctx.createImageData(WID, HEI);
        this.tmp = this.ctx.getImageData(0, 0, WID, HEI);
        this.tmpImage.src = this.canvas.toDataURL();
        this.resetCanvas();

        this.scope.draw(this.ctx, this.tmpImage);
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

    
})(jQuery, window, window.document, undefined);