(function($, window, document, undefined) {
    
    "use strict";
    
    var NUM = 5;
    var STROKE = 20;
    var RADIUS = 20;
    var LENGTH = 200;

    /////////////////////////////////////////////
    // circle
    /////////////////////////////////////////////
    
    var Circle = function(opt) {
        this.opts = opt || {};
        
        this.points = {
            x: this.opts.x || 0,
            y: this.opts.y || 0,
            r: this.opts.radius || RADIUS,
            stroke: this.opts.stroke || STROKE
        };
  
        this.initialize();
    };
    
    Circle.prototype.initialize = function() {
    };
    

    Circle.prototype.update = function() {
    };
    
    Circle.prototype.draw = function(ctx, data) {
        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = Math.abs(data)/5;
        ctx.arc(this.points.x, this.points.y, this.points.r+Math.abs(data)/4, 0, Math.PI*2, false);
        ctx.stroke();
        
        ctx.restore();
    };
    
    /////////////////////////////////////////////
    // main
    /////////////////////////////////////////////
        
    var Main = function() {
        // canvas init
        this.canvas = null;
        this.ctx = null;
        
        // object init
        this.circles = [];
        
        // audio init
        this.audioContext = new window.AudioContext();
        this.source = null;
        this.audio = new Audio();
        this.analyser = this.audioContext.createAnalyser();
        this.timeDomain = new Uint8Array(1024);
        
        this.initEvents();
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.display = "none";
 

        for(var i=0; i<NUM; i++) {
            var circleOpts = {
                x: this.canvas.width/2,
                y: this.canvas.height/2,
                radius: RADIUS*i,
                stroke: STROKE*i/10
            };
            var circle = new Circle(circleOpts);
            this.circles.push(circle);
        }
    };
    
    Main.prototype.initEvents = function() {
        
        var _self = this;
        
        document.addEventListener('dragover', function(e) {
            e.dataTransfer.dropEffect = 'copy';
            e.stopPropagation();
            e.preventDefault();
        });
        
        document.addEventListener('drop', function(e) {
            if(_self.source) _self.source.stop(0);
            _self.audioLoad(e.dataTransfer.files[0]);
            e.stopPropagation();
            e.preventDefault();
        });
    };
    
    Main.prototype.play = function() {
        var source = this.audioContext.createMediaElementSource(this.audio);
        var filter = this.audioContext.createBiquadFilter();
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.canvas.style.display = "block";
        this.audio.play();
        return source;
    };
    
    Main.prototype.audioLoad = function(file) {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            this.canvas.display = 'block';
            var blob = new Blob([e.target.result], { "type": file.type });
            this.audio.src = window.URL.createObjectURL(blob);
            this.play();
            this.audio.play();
            this.run();
        }.bind(this);
        fileReader.readAsArrayBuffer(file);
    };
    
    Main.prototype.clearCanvas = function() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    };
    
    Main.prototype.draw = function() {
        this.clearCanvas();
        
        this.analyser.getByteTimeDomainData(this.timeDomain);
        

        for(var i=0; i<NUM; i++) {
            this.circles[i].update();
            this.circles[i].draw(this.ctx, this.timeDomain[0]-128);
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
    
    $(window).on("load", function() {
        var main = new Main();
        
        $(".wrapper").width($(window).width());
        $(".wrapper").height($(window).height());
    });
    
})(jQuery, window, window.document, undefined);