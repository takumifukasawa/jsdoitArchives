(function($, window, document, undefined) {
    
    "use strict";
    
    var Circle = function(opt) {
        this.data = {};
        this.initialize();
    };
    
    Circle.prototype.initialize = function() {
        var x = 20 + Math.floor(Math.random()*window.innerWidth);
        var y = 10 + Math.floor(Math.random()*window.innerHeight);
        var r = 1 + Math.floor(Math.random()*30);
        this.data = {
            x: x,
            y: y,
            dx: 0.015,
            dy: 0.015,
            radius: r,
            toX: window.innerWidth - x,
            toY: window.innerHeight - y,
            r: 200 + Math.floor(Math.random()*50),
            g: 100 + Math.floor(Math.random()*50),
            b: 100 + Math.floor(Math.random()*150),
            alpha: 0.06,
            toAlpha: 1,
            alphaDir: 1,
            color: 0
        };

    };
    
    Circle.prototype.update = function() {

        var data = this.data;
        var _self = this;
        
        if(data.alpha > 0.95) {
            data.alphaDir *= -1;
        }
        if(data.alpha < 0.05) {
            setTimeout(function() {
                _self.initialize();
            }, 300);
        } else {
            data.x += (data.toX - data.x) * data.dx;        
            data.alpha += ((data.toAlpha - data.alpha) * 0.04)*data.alphaDir;
            data.y += (data.toY - data.y) * data.dy;        
        }

    };
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();
       
        var data = this.data;
        
  
        ctx.globalAlpha = data.alpha;
        ctx.globalCompositeOperation = "lighter";
        
        ctx.beginPath();
        var edge1 = "rgba(" + data.r + "," + data.g + "," + data.b + ", 0.6)";
        var edge2 = "rgba(" + data.r + "," + data.g + "," + data.b + ", 0.4)";
        var edge3 = "rgba(" + data.r + "," + data.g + "," + data.b + ", 0.15)";
        var edge4 = "rgba(" + data.r + "," + data.g + "," + data.b + ", 0.0)";


        var gradBlur = ctx.createRadialGradient(data.x, data.y, 0, data.x, data.y, data.radius);
        gradBlur.addColorStop(0, edge1);
        gradBlur.addColorStop(0.08, edge1);
        gradBlur.addColorStop(0.2, edge2);
        gradBlur.addColorStop(0.3, edge3);
        gradBlur.addColorStop(0.5, edge4);
        
        ctx.fillStyle = gradBlur;
        
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
        
        this.frame = 1000 / 30;
        this.num = 150;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.$canvas = $("#my-canvas");
        this.canvas = this.$canvas[0];
        
        if(!this.canvas.getContext) throw new Error("cannnot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        for(var i=0; i<this.num; i++) {
            this.circle.push(new Circle());
        }

    };
    
    Main.prototype.reset = function() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
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

    };
    
    var main = new Main();
    main.run();
    
})(jQuery, window, window.document, undefined);