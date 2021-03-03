(function($, win, doc) {
    
    "use strict";
    
    var NUM = 30;
    
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
      
        /*
        this.lines = [];
        for(var i=0; i<NUM; i++) {   
            this.lines.push(new Line());
        }
        */
        
        this.lines = [];
        for(var i=0; i<NUM; i++) {
            this.lines.push({
                y: Math.floor(Math.random()*win.innerHeight),
                diff: 5 + Math.floor(Math.random()*5),
                lineWidth: 5 + Math.floor(Math.random()*5)
            });
        }
        console.log(this.lines);

        this.run();
    };
    
    Main.prototype.reset = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.update = function() {
        for(var i=0, len=this.lines.length; i<len; i++) {
            this.lines[i].y += this.lines[i].diff;
            if(this.lines[i].y > win.innerHeight) this.lines[i].y = 0;
        }
    };
    
    Main.prototype.draw = function() {
        this.update();
        
        this.reset();
            
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
        
            var i, r, g, b, a;

        
            for(var l=0, lineLen=this.lines.length; l<lineLen; l++) {
            
                for(var y=this.lines[l].y, len=this.lines[l].y+this.lines[l].lineWidth; y<len; y++) {
                                    
                    for(var x=0, xLen=this.canvas.width; x<xLen; x++) {
                        i = y*this.canvas.width+x;
                        imageData.data[i*4] = imageData.data[i*4]+Math.random()*150;
                        imageData.data[i*4+1] = imageData.data[i*4+1]+Math.random()*150;
                        imageData.data[i*4+2] = imageData.data[i*4+2]+Math.random()*150;
                        imageData.data[i*4+3] = imageData.data[i*4+3]+Math.random()*150;
                    }
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
        src: "/jsdoitArchives/assets/img/photo-1449942120512-7a6f1ea6b0c4.jpeg"
    });
    
})(jQuery, window, window.document);