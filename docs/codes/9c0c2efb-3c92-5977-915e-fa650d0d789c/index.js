(function($, window, document, undefined) {
    
    "use strict";
    
    var THROTTLE    = 50,
        WID         = window.innerWidth,
        HEI         = window.innerHeight,
        IMG         = "/jsdoitArchives/assets/img/photo-1444837881208-4d46d5c1f127.jpeg";
       
    
    var Rect = function(opt) {
        var opts = opt || {};
        
        this.image = opts.image;
        this.imageDiv = this.image.width / this.image.height;
        this.posY = 0;
        this.initialize();
    };
    
    Rect.prototype.initialize = function() {
    };
    
    Rect.prototype.update = function(pos) {
        this.posY = pos*(-0.1);
    };
    
    Rect.prototype.draw = function(ctx) {
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(WID-20, 40);
        ctx.lineTo(WID-20, HEI-20);
        ctx.lineTo(20, HEI-40);
        ctx.closePath();
        ctx.fill();
        ctx.clip();
        ctx.drawImage(this.image, 0, this.posY, WID, this.imageDiv*WID);
        ctx.restore();
    };
    
    
    
    var Main = function() {
        this.scrollPos = 0;
        this.image = new Image();
        this.image.src = IMG;
        
        this.initialize();
    };

    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = WID;
        this.canvas.height = HEI;
        
      
        this.image.onload = function() {
            var opt = {
                image: this.image
            };
            this.clip = new Rect(opt);
            this.run();
        }.bind(this);
    };
    
    Main.prototype.update = function(scrollPos) {
        this.scrollPos = scrollPos;
        this.clip.update(this.scrollPos);
    };
        
    Main.prototype.resetCanvas = function() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.restore();
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        this.clip.draw(this.ctx);        
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
    //main.run();    
    
    var throttle = new Throttle(THROTTLE);
    
    $(window).on("scroll", function() {
        throttle.exec(function() {
            main.update($(this).scrollTop());
            main.draw();
        }.bind(this));
    });
    
})(jQuery, window, window.document, undefined);