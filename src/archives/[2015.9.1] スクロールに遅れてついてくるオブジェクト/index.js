(function($, win, doc) {
    
    "use strict";
    
    var NUM = 1;
    
    var Circle = function(opt) {
        this.data = {};
        this.initialize();
    };
    
    Circle.prototype.initialize = function() {
        var x = win.innerWidth/2;
        var y = 60;
        this.beginY = y;
        this.data = {
            x: x,
            y: y,
            dx: 0.1,
            dy: 0.1,
            radius: 10,
            toX: x,
            toY: y,
            r: 200 + Math.floor(Math.random()*50),
            g: 100 + Math.floor(Math.random()*50),
            b: 100 + Math.floor(Math.random()*150),
            alpha: 0.5
        };
        this.fillStyle = "rgba(" + this.data.r + "," + this.data.g + "," + this.data.b + "," + this.data.alpha + ")";

    };
    
    Circle.prototype.updatePos = function(position) {
        this.data.toY = this.beginY + position/5;
    };
    
    Circle.prototype.update = function() {
        var data = this.data;
        //data.x += (data.toX - data.x) * data.dx;        
        data.alpha += ((data.toAlpha - data.alpha) * 0.04)*data.alphaDir;
        data.y += (data.toY - data.y) * data.dy; 
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
            this.circle.push(new Circle());
        }
        
        
        $(win).on("scroll", function() {
            this.scrollThrottle.exec(function() {
                this.scrollPos = $(win).scrollTop();
                for(var i=0, len=this.circle.length; i<len; i++) {
                    this.circle[i].updatePos(this.scrollPos);
                }
            }.bind(this));
        }.bind(this));
        
    };
    
    Main.prototype.reset = function() {
        this.ctx.fillStyle = "rgb(255, 255, 255)";
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