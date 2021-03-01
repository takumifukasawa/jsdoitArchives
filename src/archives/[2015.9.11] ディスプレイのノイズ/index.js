(function($, win, doc) {
    
    "use strict";
    
    var NUM = 30;

    var Line = function(opt) {
        opt = opt || {};
        
        var y = Math.random()*win.innerHeight;
        this.posY = y;
        this.points = [
            { x: 0, y: y },
            { x: win.innerWidth, y: y }
        ];
        this.dy = 5 + Math.random()*20;
        
        var r = Math.floor(100+Math.random()*20);
        var g = Math.floor(100+Math.random()*20);
        var b = Math.floor(100+Math.random()*20);
        var a = 0.12;
        this.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        
        this.lineWidth = 5 + Math.random()*10;
        this.initialize();
    };
    
    Line.prototype.initialize = function() {};
    
    Line.prototype.update = function() {
        this.posY += this.dy;
        if(this.posY > win.innerHeight) this.posY = 0;
        
        this.points[0].y = this.posY;
        this.points[1].y = this.posY;
    };
    
    Line.prototype.render = function(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[1].x, this.points[1].y);
        ctx.closePath();
        ctx.stroke();
    };
    
    
    
    
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
             
        this.lines = [];
        for(var i=0; i<NUM; i++) {   
            this.lines.push(new Line());
        }

        this.run();
    };
    
    Main.prototype.reset = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.update = function() {

    };
    
    Main.prototype.draw = function() {
        this.reset();
        
        this.ctx.save();
            //this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight);
        this.ctx.restore();
        for(var s=0, sLen=this.lines.length; s<sLen; s++) {
            this.ctx.save();
            this.lines[s].update();
            this.lines[s].render(this.ctx);
            this.ctx.restore();
        }
            
            
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
                    /*
                    r = imageData.data[(i + diffRed)*4];
                    g = imageData.data[(i + diffGreen)*4+1];
                    b = imageData.data[(i + diffBlue)*4+2];
                    a = imageData.data[i*4+3];
                    */
                    imageData.data[i*4] = imageData.data[i*4]+Math.random()*150;
                    imageData.data[i*4+1] = imageData.data[i*4+1]+Math.random()*150;
                    imageData.data[i*4+2] = imageData.data[i*4+2]+Math.random()*150;
                    imageData.data[i*4+3] = imageData.data[i*4+3]+Math.random()*150;
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
        src: "http://jsrun.it/assets/8/c/w/9/8cw9R.jpg"
    });
    
})(jQuery, window, window.document);