$(function() {


    "use strict";

    var FRAME_RATE = 30;
    
    /*
     * circle
     */
    
    var Circle = function(opts) {
        opts = opts || {};

        this.start = opts.start;
        this.end = this.start;
        this.add = Math.PI*2 / FRAME_RATE / 5;
        
        this.r = opts.r;
        
        this.initialize();
    };
    
    Circle.prototype.initialize = function() {
    };
    
    /*
     * main
     */
    
    var Main = function() {
        this.circles = [];
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        if(!this.canvas.getContext) throw new Error("cannot get context.");

        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        for(var i = 1; i < 12; i++) {
            var opts = {
                start: Math.PI*2/10 * i,
                r: 20*i
            };
            var circle = new Circle(opts);
            this.circles.push(circle);
        }

        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    };

    Main.prototype.draw = function() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = 3;
        

        this.ctx.strokeStyle = "#49D5D5";
        
        
        for(var i = 0; i < this.circles.length; i++) {
            this.ctx.beginPath();
            if(this.circles[i].start > Math.PI*2) {
                this.circles[i].start = 0;
                this.circles[i].end = 0;
            } else {
                this.circles[i].start = this.circles[i].end;
                this.circles[i].end += this.circles[i].add;
            }
            this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.circles[i].r, this.circles[i].start, this.circles[i].end, false);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
    };
    
    Main.prototype.main = function() {
        var instance = this;
        setInterval(function() {
            instance.draw();
        }, FRAME_RATE);
    };
    
    var main = new Main();
    main.main();
});