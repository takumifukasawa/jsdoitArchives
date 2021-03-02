(function($, win, doc) {
    
    "use strict";

    
    var Main = function(opt) {
        opt = opt || {};
        if(!opt.src) throw new Error("please set image src");
                
        this.image = new Image();
        this.image.src = opt.src + "?" + new Date().getTime();
        
        this.maskAlpha = 1;
        this.size = 50;
        this.maxSize = 5000;
        this.beginTrans = false;
        this.text = "Loading.";
        
        if(this.image.complete) {
            this.initialize();
        } else {
            this.image.onload = function() {
                this.initialize();
            }.bind(this);
        }

    };
    
    Main.prototype.initialize = function() {
        this.canvas = doc.getElementById("my-canvas");
        if(!this.canvas.getContext("2d")) throw new Error("cannot make ctx.");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = win.innerWidth;
        this.canvas.height = win.innerHeight;
             
        this.ctx.fillStyle = "lightblue";
          
        this.run();
    };
    
    Main.prototype.drawText = function() {
        this.ctx.font = "bold " + this.size + "px Arial";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(
            this.text,
            (this.canvas.width - this.ctx.measureText(this.text).width)/2 - 9*this.size/50,
            this.canvas.height/2
        );
    };
    
    Main.prototype.reset = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    Main.prototype.update = function() {
        if(this.maskAlpha >= 0) {
            this.maskAlpha -= 0.015;
        } else {
            //if(this.size < this.maxSize) this.size += 5;
            this.size += (this.maxSize - this.size) * 0.018;
        }
        
    };
    
    Main.prototype.draw = function() {
        this.reset();
        
        this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight);

        this.ctx.save();
            this.ctx.globalAlpha = 1;
            this.ctx.globalCompositeOperation = "destination-in";     
            this.drawText();
        this.ctx.restore();

        if(this.maskAlpha >= 0) {
            this.ctx.save();
            this.ctx.globalAlpha = this.maskAlpha;
            this.drawText();
            this.ctx.restore();
        }
       
    };
    
    Main.prototype.run = function() {
        setTimeout(function() {
            this.beginTrans = true;
        }.bind(this), 750);
        
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
            if(this.beginTrans) this.update();
            this.draw(); 
            requestAnimationFrame(loop);  
        }.bind(this);
        requestAnimationFrame(loop);  
    };
    
    var main = new Main({
        src: "/common/img/photo-1473849512542-60ddc51e1c9f.jpeg"
    });
    
})(jQuery, window, window.document);