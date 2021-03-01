$(function() {


    "use strict";

    var FRAME_RATE = 30;
    
    
    var Circle = function() {
        this.canvas = null;
        this.ctx = null;

        this.secondsStart = 0;
        this.secondsEnd = 0;
        this.secondsAdd = Math.PI*2 / FRAME_RATE;
                
        this.initialize();
    };
    
    Circle.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        if(!this.canvas.getContext) throw new Error("cannot get context.");

        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

    };

    Circle.prototype.draw = function() {

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#49D5D5";
        if(this.secondsStart > Math.PI*2) {
            this.secondsStart = 0;
            this.secondsEnd = 0;
        } else {
            this.secondsStart = this.secondsEnd;
            this.secondsEnd += this.secondsAdd;
        }
        console.log(this.secondsEnd);
        this.ctx.arc(this.canvas.width/2, this.canvas.height/2, 45, this.secondsStart, this.secondsEnd, false);
        this.ctx.stroke();

    };
    
    Circle.prototype.main = function() {
        this.draw();
        var instance = this;
        setInterval(function() {
            instance.draw();
        }, FRAME_RATE);
    };
    
    var circle = new Circle();
    circle.main();
});