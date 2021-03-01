(function($, win, doc) {
    
    "use strict";

   
    ///////////////////////////////////////////////////////////
    // Star
    ///////////////////////////////////////////////////////////
        
    
    var Star = function(opt) {
        opt = opt || {};
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.color = "rgba(255, 255, 255, 1";
        this.radius = opt.radius || 2;
    };
    
    Star.prototype.initialize = function() {
    };
    
    Star.prototype.update = function() {
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
        
        this.num = 50;
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
        
        
        this.stars = [];
        for(var i=0; i<this.num; i++) {
            this.stars.push(new Star({
                x: Math.random()*this.width,
                y: Math.random()*this.height,
                radius: 1
            }));
        }
    };
    
    Main.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };
    
    Main.prototype.update = function() {};
    
    Main.prototype.render = function() {
        this.clear();
        
        for(var i=0, len=this.stars.length; i<len; i++) {
            this.stars[i].update();
            this.stars[i].render(this.ctx);
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
            this.render(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        requestAnimationFrame(loop);  
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
    main.run();

})(jQuery, window, window.document);