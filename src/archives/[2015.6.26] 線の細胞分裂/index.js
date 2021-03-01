(function($, window, document, undefined) {
    
    "use strict";
    
    var TIMER = 1000;
    var LIMIT = 9;
    
    var Main = function() {
        this.canvas = null;
        this.ctx = null;
        
        this.loopCounter = 0;
        this.counter = 1;
        this.timer = null;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.reset();
    };
    
    Main.prototype.reset = function() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.loopCounter = 0;
        this.counter = 1;
    };
    
    Main.prototype.draw = function() {
        
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "#fff";
        
        var divide = this.counter+1;

        var w = this.canvas.width / divide;
        var h = this.canvas.height / divide;

        this.counter =  Math.pow(2, this.loopCounter) - 1;
        
        for(var i=1; i<=this.counter; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, h*i);
            this.ctx.lineTo(this.canvas.width, h*i);
            this.ctx.stroke();
            this.ctx.closePath();
            
            this.ctx.beginPath();
            this.ctx.moveTo(h*i, 0);
            this.ctx.lineTo(w*i, this.canvas.height);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
    };
    
    Main.prototype.controller = function() {
        var _self = this;
        this.timer = setInterval(function() {
            _self.draw();
            _self.loopCounter++;
            if(_self.loopCounter > LIMIT) {
                _self.reset();
            }
        }, TIMER);
        this.timer();
    };
    
    var main = new Main();
    main.controller();
    
})(jQuery, window, window.document, undefined);