(function($, win, doc) {

    "use strict";
    
    var WID         = window.innerWidth,
        HEI         = window.innerHeight,
        ELEMENTS    = 5,
        RADIUS      = 40,
        DIFF        = 10,
        DIRECTION   = 10,
        DISTANCE    = 20 + RADIUS/2,
        PAR         = RADIUS/2,
        COL         = WID / RADIUS * 3,
        ROW         = HEI / RADIUS/10,
        MOVE        = RADIUS/2,
        FPS         = 8,
        GET_LIMIT   = 10,
        NEW_RAND    = 150;
    
    var Circle = function(opt) {
        this.opts           = opt || {};
        this.radius         = this.opts.radius || RADIUS;
        this.x              = this.opts.x || 0;
        this.y              = this.opts.y || 0;
        this.baseR          = this.radius;
        this.diff           = DIFF;
        this.strokeColor    = "#000";
        this.fillColor      = "#333";
        this.lineWidth      = 7;
        
        this.time = 0;
        
        this.initialize();
    };
   
    Circle.prototype.initialize = function() {
    };
    
    Circle.prototype.update = function(to) {
        this.radius = this.baseR + this.diff * Math.cos(Math.PI*2*this.time);
        this.time++;
        if(this.time > 100) {
            this.time = 0;
        }
    };
    
    Circle.prototype.draw = function(ctx) {
        //this.update();
        for(var i=0, len=ELEMENTS; i<len; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.arc(this.x, this.y, this.radius-DIFF*i, 0, Math.PI*2, false);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

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
            for(var s=0, sLen=ROW; s<len; s++) {
                var diff = i % 2;
                circle = new Circle({
                    x: RADIUS*2*s + RADIUS*diff - DISTANCE,
                    y: RADIUS*2*i/4 - DISTANCE,
                    radius: RADIUS,
                });
            this.circles.push(circle);
            }
        }
    };
    
    Main.prototype.index = function(x, y) {
        return (y * this.canvas.width + x) * 4;
    };
    
    Main.prototype.update = function() {
    };
        
    Main.prototype.resetCanvas = function() {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        for(var i=0, len=this.circles.length; i<len; i++) {
            this.circles[i].draw(this.ctx);
        }
        
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var index;
        
        for(var y=0, yLen=this.canvas.height; y<yLen; y++) {
            for(var x=0, xLen=this.canvas.width; x<xLen; x++) {
                index = this.index(x, y);
                if(
                    imageData.data[index] < GET_LIMIT ||
                    imageData.data[index+1] < GET_LIMIT ||
                    imageData.data[index+2] < GET_LIMIT
                    
                ) continue;
                imageData.data[index]     = imageData.data[index] + GET_LIMIT + Math.random()*NEW_RAND;
                imageData.data[index+1]   = imageData.data[index+1] + GET_LIMIT + Math.random()*NEW_RAND;
                imageData.data[index+2]   = imageData.data[index+2] + GET_LIMIT + Math.random()*NEW_RAND;
                imageData.data[index+3]   = imageData.data[index+3] + GET_LIMIT + Math.random()*50;

            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
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

        var _self = this;

        var loop = function() {                                                                                                                                                                              
            _self.draw(); 
            requestAnimationFrame(loop);  
        };
        requestAnimationFrame(loop);  
        */

        
        setInterval(function() {
            this.draw();
        }.bind(this), 1000/FPS);
        
    };
    
    var main = new Main();
    main.run();

    
})(jQuery, window, window.document);