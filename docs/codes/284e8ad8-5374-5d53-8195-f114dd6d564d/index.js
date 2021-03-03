(function($, window, document, undefined) {
    
    "use strcit";
    
    var FRAME = 1000 / 30;
    
    var RotateImage = function(opt) {
        var opts = opt || null;
        if(!opts) throw new Error("please set default data.");
        
        this.canvas = null;
        this.ctx = null;
        this.src = opts.src;
        this.image = new Image();
        
        this.rad = {
            num: 0
        };
        
        this.initialize();
    };
    
    RotateImage.prototype.initialize = function() {   
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    
    RotateImage.prototype.resetCanvas = function() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    RotateImage.prototype.resetRotate = function() {
        var _self = this;
        _self.rad.num = 0;
        setTimeout(function() {
            $(_self.rad).animate({
                num: 360
            }, {
                duration: 2000
            });
        }, 1000);

    };
    
    RotateImage.prototype.draw = function() {
        var _self = this;

        if(this.rad.num >= 360) {
            _self.resetRotate();
        }
        
        this.resetCanvas();        
        
        this.ctx.save();
              
        var rad = this.rad.num * Math.PI / 180;
        
        this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
        this.ctx.rotate(rad);
        this.ctx.translate(-1 * this.canvas.width/2, -1 * this.canvas.height/2);
        this.ctx.drawImage(this.image, this.canvas.width/2-this.image.width/2, this.canvas.height/2-this.image.height/2, this.image.width, this.image.height);
        
        this.ctx.restore();
    };
    
    RotateImage.prototype.main = function() {
        var _self = this;
        this.image.src = this.src + "?" + new Date().getTime();
        this.image.onload = function() {
            _self.resetRotate();
            setInterval(function() {
                _self.draw();
            }, FRAME);
        };
    };
       
    var opts = {
        src: "/jsdoitArchives/assets/img/photo-1417716226287-2f8cd2e80274.jpeg"
    };
    var rotateImage = new RotateImage(opts);
    
    $(window).load(function() {
        rotateImage.main();
    });
    
})(jQuery, window, window.document, undefined);