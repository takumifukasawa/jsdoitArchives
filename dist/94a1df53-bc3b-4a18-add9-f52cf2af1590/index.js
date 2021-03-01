(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 30;
    var DIFF = 0.1;
    var BOUND = 0.9;
    
    //////////////////////////////////
    // line
    //////////////////////////////////
        
    var Line = function(opt) {
        var opts = opt || {};
        this.points = opts.points;
        this.centerX = this.points[1].x;
        this.centerY = this.points[1].y;
        this.dx = 0;
        this.dy = 0;
        this.toX = 0;
        this.toY = 0;
        this.ax = 0;
        this.ay = 0;
        this.vx = 0;
        this.vy = 0;
    };
    
    Line.prototype.setRelPoint = function(point) {
        this.toX = point.x;
        this.toY = point.y;
    };
    
    Line.prototype.update = function(ctx) {
        this.ax = (this.toX - this.points[1].x)*DIFF;
        this.ay = (this.toY - this.points[1].y)*DIFF;
        this.vx += this.ax;
        this.vy += this.ay;
        this.vx *= BOUND;
        this.vy *= BOUND;
        
        this.points[1].x += this.vx;
        this.points[1].y += this.vy;
        
        ctx.save();
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.quadraticCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
    
    //////////////////////////////////
    // main
    //////////////////////////////////
    
    var Main = function() {
        
        this.points = []; 
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "my-canvas";
        document.body.appendChild(this.canvas);
        
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = "#000";
        
        var opt, hei;
        var baseHeight = this.canvas.height/(NUM+1);
        this.lines = [];

        for(var i=0; i<NUM; i++) {
            hei = baseHeight*(i+1);
            opt = {
                points: [
                    { x: 0, y: hei },
                    { x: this.canvas.width/2, y: hei },
                    { x: this.canvas.width, y: hei }
                ]
            };
            var line = new Line(opt);
            this.lines.push(line);
        }
        
        var point;
        $("body").mousemove(function(e) {
            point = {
                x: e.pageX,
                y: e.pageY
            };
            for(var s=0; s<NUM; s++) {                
                this.lines[s].setRelPoint(point);
            }
        }.bind(this));
    };
   
    
    Main.prototype.update = function() {
    };
    
    Main.prototype.resetCanvas = function() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        for(var i=0, len=this.lines.length; i<len; i++) {
            this.lines[i].update(this.ctx);
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

        var _self = this;

        var loop = function() {                                                                                                                                                                              
            _self.draw(); 
            requestAnimationFrame(loop);  
        };
        requestAnimationFrame(loop);  

        _self.draw();
    };
    
    var main = new Main();
    main.run();
    
})(jQuery, window, window.document, undefined);