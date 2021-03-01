(function($, win, doc) {
    
    "use strict";
    
    var NUM = 1,
        LENGTH = 2,
        DIFF = 20;
    
    var Circle = function(opt) {
        var opts = opt || {};
        this.data = {};
        this.initialize(opts);
    };
    
    Circle.prototype.initialize = function(opts) {       
        this.beginX = opts.x;
        this.beginY = opts.y;
        
        this.col = 1;
        this.moveIndex = 1;
        // 1=>bottom, 2=>right, 3=>top, 4=>left
        this.direction = 1;
        
        this.data = {
            x: opts.x,
            y: opts.y,
            dx: 0.2,
            dy: 0.2,
            radius: 3,
            toX: opts.x,
            toY: opts.y + DIFF,
            moving: opts.y,
            movingTo: opts.y + DIFF,
            r: 200 + Math.floor(Math.random()*50),
            g: 100 + Math.floor(Math.random()*50),
            b: 100 + Math.floor(Math.random()*150),
            alpha: 0.8
        };
        this.fillStyle = "rgba(" + this.data.r + "," + this.data.g + "," + this.data.b + "," + this.data.alpha + ")";

        var data = this.data;
        setInterval(function() {
            this.direction++;
                        
            if(this.direction > 4) {
                this.direction = 1;
            }
            
            if(this.moveIndex === 1) {
                this.moveIndex++;
            } else {
                this.moveIndex = 1;
                this.col++;
            }
            
            switch(this.direction) {
                case 1:
                    data.toY += DIFF*this.col;
                    data.moving = data.y;
                    data.movingTo = data.toY;
                    break;
                case 2:
                    data.toX += DIFF*this.col;
                    data.moving = data.x;
                    data.movingTo = data.toX;
                    break;
                case 3:
                    data.toY -= DIFF*this.col;
                    data.moving = data.y;
                    data.movingTo = data.toY;
                    break;
                case 4:
                    data.toX -= DIFF*this.col;
                    data.moving = data.x;
                    data.movingTo = data.toX;
                    break;
            }
            
        }.bind(this), 500);
    };
    
    Circle.prototype.updatePos = function(position) {
        this.data.toY = this.beginY + position/5;
    };
    
    Circle.prototype.update = function() {
        var data = this.data;
        data.x += (data.toX - data.x) * data.dx;        
        //data.alpha += ((data.toAlpha - data.alpha) * 0.04)*data.alphaDir;
        data.y += (data.toY - data.y) * data.dy;

        
        //if(Math.abs(data.movingTo - data.moving) < 1) {

    };
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();
       
        var data = this.data;
        
        ctx.beginPath();        
        ctx.fillStyle = this.fillStyle;       
        ctx.arc(data.x, data.y, data.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };
    
    ///////////////////////////////////
    
    var Main = function() {
        this.$canvas = null;
        this.canvas = null;
        this.ctx = null;
        this.circle = [];
        
        this.scrollThrottle = new Throttle(100);
        this.scrollPos = 0;

        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        
        if(!this.canvas.getContext) throw new Error("cannnot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = win.innerWidth;
        this.canvas.height = win.innerHeight;

        for(var i=0; i<NUM; i++) {
            this.circle.push(new Circle({
                x: win.innerWidth/2,
                y: win.innerHeight/2
            }));
        }
    };
    
    Main.prototype.reset = function() {
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    Main.prototype.draw = function() {
        this.reset();
        for(var i=0; i<this.circle.length; i++) {
            this.circle[i].update();
            this.circle[i].draw(this.ctx);
        }
        
    };
    
    Main.prototype.run = function() {
        win.requestAnimationFrame = (function(){
            return window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    win.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        
        var loop = function() {                                                                                                                                                                              
            this.draw(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        requestAnimationFrame(loop);  

    };
    
    var main = new Main();
    main.run();
    
})(jQuery, window, window.document);