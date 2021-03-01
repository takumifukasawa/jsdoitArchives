(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 30;
    var RADIUS = 20;
    var LENGTH = 200;

 
    /////////////////////////////////////////////
    // ray
    /////////////////////////////////////////////
    
    var Ray = function(opt) {
        this.opts = opt || {};
        
        this.basePoints = {
            beginX: this.opts.beginX,
            beginY: this.opts.beginY,
            goalX: this.opts.goalX,
            goalY: this.opts.goalY,
            beginTimeRandom: Math.floor(Math.random()*500),
            endTimeRandom: Math.floor(Math.random()*500),
            beginLineWidth: 1,
            goalLineWidth: 4
        };

        this.baseAnimationTime = 1600;
        this.dt = -500;
        this.timeMaxLimit = 1600;
        this.timeMinLimit = 250;
  
        this.rad = this.opts.rad;
        this.initialize();
    };
    
    Ray.prototype.initialize = function() {
        this.animationTimeInitialize();
        this.pointInitialize();
    };
    
    Ray.prototype.pointInitialize = function() {        
        this.animationTimeInitialize();
        this.fromPointsInitialize();
        this.toPointsInitialize();
        this.lineWidthInitialize();
    };

    Ray.prototype.animationTimeInitialize = function() {
        this.baseAnimationTime += this.dt;
        if(this.baseAnimationTime <= this.timeMinLimit || this.baseAnimationTime >= this.timeMaxLimit) {
            this.dt *= -1;
        }
        this.beginPointsTime = this.baseAnimationTime + 400 + this.basePoints.beginTimeRandom;
        this.endPointsTime = this.baseAnimationTime + this.basePoints.endTimeRandom;
    };
    
    Ray.prototype.lineWidthInitialize = function() {
        var _self = this;
        
        this.line = {
            width: this.basePoints.beginLineWidth
        };
        
        $(this.line).animate({
            width: this.basePoints.goalLineWidth
        }, {
            duration: this.beginPointsTime
        });
    };
    
    Ray.prototype.fromPointsInitialize = function() {
        var _self = this;
        
        this.fromPoints = {
            x: this.opts.beginX,
            y: this.opts.beginY,
        };
         
        $(this.fromPoints).animate({
            x: this.basePoints.goalX,
            y: this.basePoints.goalY
        }, {
            duration: this.beginPointsTime,
            complete: this.pointInitialize.bind(this)
        });
    };

    Ray.prototype.toPointsInitialize = function() {   
        var _self = this;
        
        this.toPoints = {
            x: this.opts.beginX,
            y: this.opts.beginY,
        };

        $(this.toPoints).animate({
            x: this.basePoints.goalX,
            y: this.basePoints.goalY           
        }, {
            duration: this.endPointsTime
        });
    };
    
    Ray.prototype.update = function() {
    };
    
    Ray.prototype.draw = function(ctx) {
        ctx.save();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = this.line.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.fromPoints.x, this.fromPoints.y);
        ctx.lineTo(this.toPoints.x, this.toPoints.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
    
    /////////////////////////////////////////////
    // main
    /////////////////////////////////////////////
        
    var Main = function() {
        //this.canvas;
        //this.ctx;
        this.rays = [];
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
 
        var baseDeg = 360/NUM;
        for(var i=0; i<NUM; i++) {
            var deg = baseDeg*i;
            var rad = deg*Math.PI/180;
            var rayOpts = {
                beginX: this.canvas.width/2 + RADIUS*Math.cos(rad),
                beginY: this.canvas.width/2 + RADIUS*Math.sin(rad),
                goalX: this.canvas.width/2 + (LENGTH+Math.random()*60)*Math.cos(rad),
                goalY: this.canvas.height/2 + (LENGTH+Math.random()*60)*Math.sin(rad),
                rad: rad
            };
            var ray = new Ray(rayOpts);
            this.rays.push(ray);
        }
    };
    
    Main.prototype.clearCanvas = function() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.draw = function() {
        this.clearCanvas();
        for(var i=0; i<NUM; i++) {
            this.rays[i].update();
            this.rays[i].draw(this.ctx);
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

    };
    
    var main = new Main();
    main.run();
    
})(jQuery, window, window.document, undefined);