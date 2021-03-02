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
            goalY: this.opts.goalY
        };
  
        this.rad = this.opts.rad;
        this.initialize();
    };
    
    Ray.prototype.initialize = function() {

        this.beginPointsTime = 2000 + Math.floor(Math.random()*1000);
        this.endPointsTime = 1500 + Math.floor(Math.random()*1000);
        this.pointInitialize();
    };
    
    Ray.prototype.pointInitialize = function() {        
        this.fromPointsInitialize();
        this.toPointsInitialize();
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
            duration: this.endPointsTime,
            //complete: this.toPointsInitialize.bind(this)
        });
    };
    
    Ray.prototype.update = function() {
    };
    
    Ray.prototype.draw = function(ctx) {
        ctx.save();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
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
                goalX: this.canvas.width/2 + LENGTH*Math.cos(rad),
                goalY: this.canvas.height/2 + LENGTH*Math.sin(rad),
                rad: rad
            };
            var ray = new Ray(rayOpts);
            this.rays.push(ray);
            console.log(rayOpts.goalX);
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