(function($, window, document, undefined) {
    
    "use strcit";
    
    var FRAME = 1000 / 20;
    
    var Circle = function(opts) {
        var opts = opts || null;
        this.x = opts.x;
        this.y = opts.y;
        this.r = 0;
        this.deg = 0;
        this.d = 8;
        
        this.initialize();
    };
    
    Circle.prototype.initialize = function() {
    };
    
    Circle.prototype.update = function() {
        this.r += 0.8;
        this.d += 8;
        this.deg = this.d * Math.PI / 180;
    };
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            this.x + Math.cos(this.deg) * this.r,
            this.y + Math.sin(this.deg) * this.r,
            this.r,
            0,
            Math.PI*2,
            false
        );
        ctx.stroke();
        ctx.closePath();
        
        ctx.restore();
    };
    
    var Main = function(opt) {
        var opts = opt || null;
        
        this.canvas = null;
        this.ctx = null;
        
        var circleOpts = {
            x: window.innerWidth/2,
            y: window.innerHeight/2
        };
        this.circle = new Circle(circleOpts);
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {   
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    
    Main.prototype.resetCanvas = function() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    Main.prototype.update = function() {
        this.circle.update();
    };
       
    Main.prototype.draw = function() {
        this.circle.update();
        this.circle.draw(this.ctx);
    };
    
    Main.prototype.run = function() {
        var _self = this;
        setInterval(function() {
            _self.draw();
        }, FRAME);

    };
       
    var main = new Main();
    
    $(window).load(function() {
        main.run();
    });
    
})(jQuery, window, window.document, undefined);