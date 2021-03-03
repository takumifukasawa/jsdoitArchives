(function($, win, doc) {
    
    "use strict";

    
    var Main = function(opt) {
        opt = opt || {};
        if(!opt.src || !opt.canvasID) throw new Error("please set image src");
                
        this.canvasID = opt.canvasID;
        this.image = new Image();
        this.image.src = opt.src + "?" + new Date().getTime();
        
        this.diff = 3;
        this.fps = 10;
        
        if(this.image.complete) {
            this.initialize();
        } else {
            this.image.onload = function() {
                this.initialize();
            }.bind(this);
        }

    };
    
    Main.prototype.initialize = function() {
        this.canvas = doc.getElementById(this.canvasID);
        if(!this.canvas.getContext("2d")) throw new Error("cannot make ctx.");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = win.innerWidth;
        this.canvas.height = win.innerHeight;
             
        this.run();
    };
    
    Main.prototype.reset = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    Main.prototype.update = function() {

    };
    
    Main.prototype.draw = function() {
        this.reset();
        
        this.ctx.save();
            this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight);
        this.ctx.restore();
        
        
        this.ctx.save();

            var imageData = this.ctx.getImageData(
                0, 0,
                this.canvas.width, this.canvas.height
            );
        
            /*
            var getIndex = function(x, y) {
                return (y * this.canvas.width + x) * 4;
            }.bind(this); 
            */
        
            var i, r, g, b, a,
                diffRed = Math.floor(Math.random()*this.diff)*3,
                diffGreen = Math.floor(Math.random()*this.diff)*2,
                diffBlue = Math.floor(Math.random()*this.diff)*2;

        
            for(var y=0, len=this.canvas.height; y<len; y++) {
                for(var x=0, xLen=this.canvas.width; x<xLen; x++) {
                    i = y*this.canvas.width+x;
                    r = imageData.data[(i + diffRed)*4];
                    g = imageData.data[(i + diffGreen)*4+1];
                    b = imageData.data[(i + diffBlue)*4+2];
                    a = imageData.data[i*4+3];
                    imageData.data[i*4] = r;
                    imageData.data[i*4+1] = g;
                    imageData.data[i*4+2] = b;
                    imageData.data[i*4+3] = a;
                }
            }
        
        this.ctx.restore();

        this.ctx.putImageData(imageData, 0, 0);
    };
    
    Main.prototype.run = function() {
        /*
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
        */
        setInterval(function() {
            this.draw();
        }.bind(this), 1000/this.fps);
    };
    
    var main = new Main({
        canvasID: "my-canvas",
        src: "/jsdoitArchives/assets/img/photo-1418985991508-e47386d96a71.jpeg"
    });
    
})(jQuery, window, window.document);