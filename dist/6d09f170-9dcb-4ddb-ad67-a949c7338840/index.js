// forked from takumifukasawa's "[2015.7.29] ATフィールド" http://jsdo.it/takumifukasawa/zGSd
(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 8;
    var EDGE = 8;
    
    //////////////////////////////
    // rect
    //////////////////////////////
    
    var Rect = function(opt) {
        this.opts = opt || {};
        this.centerX = this.opts.centerX;
        this.centerY = this.opts.centerY;
        this.r = this.opts.r;
        this.edgeNum = EDGE;
        this.gradWidth = 10;
        this.limitDiff = 1;
        this.a = 1;
        this.diff = 0.1;
        this.d = 0.1;
        this.alpha = this.opts.alpha;
        this.dAlpha = 0.01;
        
        var beginTheta = (this.edgeNum % 2 === 0) ? (360 / this.edgeNum) / 2 : 0;
        var theta = 360 / this.edgeNum;
        this.points = [];    
        this.gradPoints = [];
        this.defPoints = [];

        for(var i=0; i<this.edgeNum; i++) {
            var rad = (-90 + beginTheta + theta*i) * Math.PI / 180;
            var pos = {
                x: this.centerX + this.r * Math.cos(rad),
                y: this.centerY + this.r * Math.sin(rad)
            };
            this.points.push(pos);
            this.defPoints.push(pos);
        }

        
        var gradPoints = {
            outer: Math.floor(this.gradWidth/this.r*10)/10,
            inner: Math.floor(this.gradWidth/this.r*10)/10
        };
        this.gradPoints.push(gradPoints);
        
        this.initialize();
    };
    
    Rect.prototype.initialize = function() {
    };
    
    Rect.prototype.update = function(ctx) {
        if(this.alpha <= 0 || this.alpha >= 1) {
           this.dAlpha *= -1;
        }
        this.alpha += this.dAlpha;
        
        if(this.diff < 0 || this.diff > this.limitDiff) {
            this.d *= -1;
        }
        for(var i=0; i<this.points.length; i++) {
            this.points[i].x += (this.defPoints[i].x+this.limitDiff - this.points[i].x) * this.d;

        }
        this.centerX += (this.opts.centerX+this.limitDiff - this.centerX) * this.d;
        this.r += (this.opts.r+this.limitDiff - this.r) * this.d;
        this.diff += this.d;
    };
    
    Rect.prototype.draw = function(ctx) {
        ctx.save();

        ctx.globalAlpha = this.alpha;
        
        // rotation first
        ctx.translate(this.r, this.r);
        ctx.rotate(-0.2);
        ctx.translate(this.r*-1, this.r*-1);

        // than scale
        ctx.translate(this.r, this.r);
        ctx.scale(1, 1.05);
        ctx.translate(this.r*-1, this.r*-1);
       
        ctx.beginPath();
        // mask図形作成
        for(var i=0; i<this.points.length; i++) {
            if(i === 0) {   
                ctx.moveTo(this.points[i].x, this.points[i].y);
            } else {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        //console.log(this.points);
        ctx.closePath();
        ctx.clip();
        
        ctx.beginPath();
        // gradation作成
        var gradation = ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.r); 
        gradation.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradation.addColorStop(0.5, "rgba(214, 61, 25, 0)");
        gradation.addColorStop(0.75, "rgba(214, 61, 25, 0.2)");
        gradation.addColorStop(1, "rgba(214, 61, 25, 0.5)"); 
        ctx.fillStyle = gradation;
        ctx.arc(this.centerX, this.centerY, this.r+10, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
        
        ctx.restore();
    };
    
    
    
    //////////////////////////////
    // main
    //////////////////////////////
    
    var Main = function() {
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "my-canvas";
        document.body.appendChild(this.canvas);
        
        if(!this.canvas.getContext) throw new Error("cannot make ctx.");
    
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.timer = 0;
        this.rects = [];
        
        var baseRadius = (this.canvas.width/2-30) / NUM;
        for(var i=0; i<NUM; i++) {
            var opt = {
                centerX: this.canvas.width/2,
                centerY: this.canvas.height/2,
                r: baseRadius*(i+1),
                alpha: 1/NUM*i
            };
            var rects = new Rect(opt);
            this.rects.push(rects);
        }
    };
    
    Main.prototype.resetCanvas = function() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        
        var baseTime = 10;
        for(var i=0; i<this.rects.length; i++) {
            this.rects[i].update(this.ctx);
            this.rects[i].draw(this.ctx);     
        }        
        

        this.timer++;
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