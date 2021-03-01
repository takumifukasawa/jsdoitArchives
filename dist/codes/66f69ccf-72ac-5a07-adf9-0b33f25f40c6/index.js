(function($, window, document, undefined){
    
    "use strict";
    
    var FRAME = 33;
    
    // make class
    var Main = function(opt) {
        this.opts = opt || null;
        this.canvas = null;
        this.ctx = null;
        
        this.points = {
            p1: { x: this.opts.p1.x, y: this.opts.p1.y },
            p2: { x: this.opts.p2.x, y: this.opts.p2.y },
            p3: { x: this.opts.p3.x, y: this.opts.p3.y },
            p4: { x: this.opts.p4.x, y: this.opts.p4.y }
        };
        //console.log(this.points);
        this.posX = 0;
        this.posY = 0;
        this.t = this.opts.t || 0;
        this.dt = 1 / (FRAME * 3);
        
        this.r = this.opts.r || 5;
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.reset();

    };
    
    Main.prototype.reset = function() {
        
        // reset canvas.
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // reset time.
        this.t = 0;

        // visible setting points.
        var index = 1;
        var color = "";        
        for(var key in this.points) {
            if(this.points.hasOwnProperty(key)) {
                this.ctx.beginPath();
                color = (index == 1 || index == 4) ? "#f00" : "#0f0";                       
                this.ctx.fillStyle = color;
                this.ctx.arc(this.points[key].x, this.points[key].y, this.r, 0, Math.PI*2, false);
                this.ctx.fill();
                this.ctx.closePath();
                index++;
            }            
        }
        
        // visible setting points line.
        this.ctx.beginPath();
        this.ctx.moveTo(this.points.p1.x, this.points.p1.y);
        this.ctx.lineTo(this.points.p2.x, this.points.p2.y);
        this.ctx.lineTo(this.points.p3.x, this.points.p3.y);
        this.ctx.lineTo(this.points.p4.x, this.points.p4.y);
        this.ctx.strokeStyle = "#fff";
        this.ctx.stroke();
    };
    
    Main.prototype.setBezierPosition = function() {
        this.posX = (Math.pow(1-this.t, 3))*this.points.p1.x + 3*this.t*(Math.pow(1-this.t, 2))*this.points.p2.x + 3*(Math.pow(this.t, 2))*(1-this.t)*this.points.p3.x + (Math.pow(this.t, 3))*this.points.p4.x;
        this.posY = (Math.pow(1-this.t, 3))*this.points.p1.y + 3*this.t*(Math.pow(1-this.t, 2))*this.points.p2.y + 3*(Math.pow(this.t, 2))*(1-this.t)*this.points.p3.y + (Math.pow(this.t, 3))*this.points.p4.y;
    };
        
    Main.prototype.draw = function() {
        var _self = this;
        setInterval(function() {
            _self.ctx.beginPath();
            _self.setBezierPosition();
            _self.ctx.fillStyle = "#fff";
            _self.ctx.arc(_self.posX, _self.posY, _self.r, 0, Math.PI*2, false);
            _self.ctx.fill();
            _self.ctx.closePath();
            
            _self.t += _self.dt;
            if(_self.t > 1) {
                _self.reset();
            }
        }, FRAME);
    };
    
    // action.
    var opt = {
        p1: { x: 30, y: 250 },
        p2: { x: 140, y: 420 },
        p3: { x: 315, y: 380 },
        p4: { x: 400, y: 60 }
    };
    var main = new Main(opt);
    main.draw();
    
})(jQuery, window, document, undefined);