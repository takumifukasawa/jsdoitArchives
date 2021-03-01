// forked from takumifukasawa's "[2015.10.4] 星のベース" http://jsdo.it/takumifukasawa/qqLH
(function($, win, doc) {
    
    "use strict";

   
    ///////////////////////////////////////////////////////////
    // Star
    ///////////////////////////////////////////////////////////
        
    
    var Star = function(opt) {
        opt = opt || {};
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.defColor = opt.color || { r: 255, g: 255, b: 255 };
        this.radius = opt.radius || 2;
        this.t = 360*Math.random();
        this.dt = 1*Math.random()/2;
        
        this.update();
    };
    
    Star.prototype.initialize = function() {};
    
    Star.prototype.update = function() {
        this.t += this.dt;
        if(this.t > 360) {
            this.t = 0;
        }
        this.alpha = Math.abs(Math.sin(this.t*Math.PI/180));
          
        this.color = "rgba(" + this.defColor.r + "," + this.defColor.g + "," + this.defColor.b + "," + this.alpha + ")";
    };
    
    Star.prototype.render = function(ctx) {
        ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            ctx.closePath();
            ctx.fill();
        ctx.restore();
    };
    
    
    ///////////////////////////////////////////////////////////
    // Main
    ///////////////////////////////////////////////////////////
        
    
    var Main = function(opt) {
        opt = opt || {};
        
        if(!opt.canvasID) throw new Error("set canvas opt");
        
        this.num = 400;
        this.canvasID = opt.canvasID;
        this.width = opt.width || 300;
        this.height = opt.height || 300;
        this.ratio = opt.ratio || 1;

        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.$canvas = $("#" + this.canvasID);
        this.canvas = doc.getElementById(this.canvasID);
        
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.width * this.ratio;
        this.canvas.height = this.height * this.ratio;
        
        this.$canvas.width(this.width);
        this.$canvas.height(this.height);

        this.ctx.scale(this.ratio, this.ratio);
        
        
        this.canvasBuffer = doc.createElement("canvas");
        this.$canvasBuffer = $(this.canvasBuffer);
        this.ctxBuffer = this.canvasBuffer.getContext("2d");
        
        this.canvasBuffer.width = this.width*this.ratio;
        this.canvasBuffer.height = this.height*this.ratio;
        
        this.$canvasBuffer.width(this.width);
        this.$canvasBuffer.height(this.height);
        
        this.ctxBuffer.scale(this.ratio, this.ratio);
        
        
        this.stars = [];
        var radius, blur;
        for(var i=0; i<this.num; i++) {
            radius = Math.random()*3/3;
            blur = radius*2;
            this.stars.push(new Star({
                x: Math.random()*this.width,
                y: Math.random()*this.height,
                radius: radius,
                color: {
                    r: Math.floor(150+Math.random()*50),
                    g: Math.floor(150+Math.random()*50),
                    b: Math.floor(150+Math.random()*50)
                }
            }));
        }
        
        this.run();
    };
    
    Main.prototype.clear = function(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
    };
    
    Main.prototype.update = function() {};
    
    Main.prototype.render = function() {
        this.clear(this.ctxBuffer);
        this.clear(this.ctx);
        
        for(var i=0, len=this.stars.length; i<len; i++) {
            this.stars[i].update();
            this.stars[i].render(this.ctxBuffer);
        }
        
        this.ctx.drawImage(
            this.ctxBuffer.canvas,
            0, 0,
            this.width*this.ratio, this.height*this.ratio,
            0, 0,
            this.width, this.height
        );
        
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
            this.render(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        loop();
        //requestAnimationFrame(loop);  
    };
    
    
    
    ///////////////////////////////////////////////////////////
    // run
    ///////////////////////////////////////////////////////////
        
      
    var main = new Main({
        canvasID: "my-canvas",
        width: win.innerWidth,
        height: win.innerHeight,
        ratio: 1
    });
    //main.run();

})(jQuery, window, window.document);