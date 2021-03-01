// forked from takumifukasawa's "[2015.8.13] 縁がもぞもぞ動いている円" http://jsdo.it/takumifukasawa/1lCG
// forked from takumifukasawa's "[2015.8.12] もぞもぞ動く円" http://jsdo.it/takumifukasawa/gZFS
(function($, window, document, undefined) {

    "use strict";
    
    var WID = window.innerWidth,
        HEI = window.innerHeight,
        NUM = 40,
        RADIUS = WID*9/10,
        BOUND = 0.92,
        DIFF = 0.08,
        DIRECTION = 180,
        TIME = 1000;
    
    var RECT_DIFF = 50,
        RECT_NUM = Math.floor(WID/2/RECT_DIFF);
    
    var Circle = function(opt) {
        this.opt = opt || {};
        this.x = this.opt.x || 0;
        this.y = this.opt.y || 0;
        this.radius = this.opt.radius || RADIUS;
        this.r = this.opt.r || Math.floor(Math.random()*150);
        this.g = this.opt.g || Math.floor(Math.random()*150);
        this.b = this.opt.b || Math.floor(Math.random()*150);
        this.alpha = 0.05;
        this.color = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
        
        this.rel = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
        };
        this.rad = 0;
        this.dr = 1;
        this.moveX = 0;
        this.moveY = 0;
            
        this.initialize();
    };
    
    Circle.prototype.initRelPoint = function() {
        this.moveToX = DIRECTION*Math.cos(Math.random()*360*Math.PI/180);
        this.moveToY = DIRECTION*Math.sin(Math.random()*360*Math.PI/180);
    };
    
    Circle.prototype.initialize = function() {
        this.initRelPoint();
        setInterval(function() {
            this.initRelPoint();
        }.bind(this), TIME+Math.floor(Math.random()*100));
    };
    
    Circle.prototype.update = function(ctx) {
        this.moveX += (this.moveToX - this.rel.e)*DIFF;
        this.moveY += (this.moveToY - this.rel.f)*DIFF;
        this.moveX *= BOUND;
        this.moveY *= BOUND;        
        this.rel.e += this.moveX;
        this.rel.f += this.moveY;
       
        ctx.setTransform(this.rel.a, this.rel.b, this.rel.c, this.rel.d, this.rel.e, this.rel.f);
    };
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();
        ctx.beginPath();
        this.update(ctx);
        ctx.fillStyle = this.color;
        ctx.globalCompositeOperation = 'lighter';
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillRect(this.x-this.radius/2, this.y-this.radius/2, this.radius, this.radius);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };
    
    
    /*
    var Rect = function(opt) {
        this.opt = opt || {};
        this.wid = this.opt.wid || 0;
        this.hei = this.opt.hei || 0;
        this.lineWidth = this.opt.lineWid || 0;
        this.initialize();
    };
    
    Rect.prototype.initialize = function() {
    };
    
    Rect.prototype.draw = function(ctx) {
        ctx.save();
        
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(WID/2-this.wid/2, HEI/2-this.hei/2, this.wid, this.hei);
        ctx.stroke();
        ctx.closePath();
        
        ctx.restore();
    };
    */
    
    var Main = function() {
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "my-canvas";
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = WID;
        this.canvas.height = HEI;  
        this.grd = null;
        
        this.circles = [];
        var opt = {};
        var circle;
        
        for(var i=0, len=NUM; i<len; i++) {
            opt = {
                x: this.canvas.width/2,
                y: this.canvas.height/2,
                radius: RADIUS+Math.random()*50
            };
            circle = new Circle(opt);
            this.circles.push(circle);
        }
        
        /*
        this.rects = [];
        var rectOpts = {};
        var rect,
            size;
        for(var s=0, rectLen=RECT_NUM; s<rectLen; s++) {
            size = RECT_DIFF*((s+1)*5);
            rectOpts = {
                wid: size,
                hei: size,
                lineWid: RECT_DIFF
            };
            rect = new Rect(rectOpts);
            this.rects.push(rect);
        }
        */
    };
    
    Main.prototype.update = function() {
    };
        
    Main.prototype.resetCanvas = function() {
        this.ctx.save();
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        this.ctx.restore();
    };
    
    Main.prototype.front = function() {
        /*
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(0,0,0,0.9)";
        this.ctx.arc(WID/2, HEI/2, RADIUS+46, 0, Math.PI*2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
        */
    };
    
    Main.prototype.draw = function() {
        this.resetCanvas();
        for(var i=0, len=this.circles.length; i<len; i++) {
            this.circles[i].draw(this.ctx);
        }
//        this.front();
        /*
        for(var s=0, rectsLen=this.rects.length; s<rectsLen; s++) {
            this.rects[s].draw(this.ctx);
        }
        */
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