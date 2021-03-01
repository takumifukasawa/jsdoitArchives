// forked from takumifukasawa's "[2015.8.10] 面のバネ弾性" http://jsdo.it/takumifukasawa/8bmJ
(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 160;
    var DIFF = 0.08;
    var BOUND = 0.92;
    var HEART = 16;
    var TIME = 1000;
    
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
        this.toX = window.innerWidth/2;
        this.toY = window.innerHeight/2;
        this.ax = 0;
        this.ay = 0;
        this.vx = 0;
        this.vy = 0;
        this.r = 150 + Math.floor(Math.random()*50);
        this.g = 100 + Math.floor(Math.random()*50);
        this.b = 100 + Math.floor(Math.random()*50);
        this.alpha = 1;
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
        ctx.strokeStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
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
        this.relPoints = {
            x: window.innerWidth/2,
            y: window.innerHeight/2
        };
        this.t = 0;
        this.dt = 1;
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
        
        var opt, hei, wid, line;
        var len = NUM/2;
        var baseHeight = this.canvas.height/(len+1);
        var baseWidth = this.canvas.width/(len+1);
        this.lines = [];

        for(var i=0; i<len; i++) {
            hei = baseHeight*(i+1);
            opt = {
                points: [
                    { x: 0, y: hei },
                    { x: this.canvas.width/2, y: hei },
                    { x: this.canvas.width, y: hei }
                ]
            };
            line = new Line(opt);
            this.lines.push(line);
        }
        for(var j=0; j<len; j++) {
            wid = baseWidth*(j+1);
            opt = {
                points: [
                    { x: wid, y: 0 },
                    { x: wid, y: this.canvas.height/2 },
                    { x: wid, y: this.canvas.height }
                ]
            };
            line = new Line(opt);
            this.lines.push(line);
        }
        
        setInterval(function() {            
            for(var i=0, len=this.lines.length; i<len; i++) {
                this.relPoints = {
                    x: this.canvas.width/2 + this.canvas.width/HEART*Math.cos(Math.random()*360/180),
                    y: this.canvas.height/2 + this.canvas.height/HEART*Math.sin(Math.random()*360/180)
                };
                this.lines[i].setRelPoint(this.relPoints);
            }
        }.bind(this), TIME);
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