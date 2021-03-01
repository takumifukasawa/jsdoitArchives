(function($, window, document, undefined){
    
    "use strict";
    
    /////////////////////////////////////////////////////////////////
    // ball class
    /////////////////////////////////////////////////////////////////
 
    var Ball = function(opt) {
        var opts = opt || {};
        if(!opts) throw new Error("please input default data");
        
        this.x = opts.x;
        this.y = opts.y;
        this.r = opts.r;             
        this.d = opts.d;
    };
    
    window.Ball = Ball;
    
    /////////////////////////////////////////////////////////////////
    // wave class
    /////////////////////////////////////////////////////////////////
    
    var FRAME = 1000 / 30;
    var COL_NUM = 12;
    var SIZE = 4;
    
    var WaveBall = function() {
        this.canvas = null;
        this.ctx = null;
        
        this.balls = [];
        this.centerBallPos = {};
        
        this.marginX = 0;
        this.marginY = 0;
        
        this.startTime = +new Date();
               
        this.initialize();
    };
    
    WaveBall.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.marginX = this.canvas.width / (COL_NUM-1);
        this.marginY = this.canvas.height / (COL_NUM-1);

        // 起点にする円を計算
        this.centerBallPos.x = this.marginX * 5;
        this.centerBallPos.y = this.marginY * 5;
        
        // make ball
        for(var x=0; x<COL_NUM; x++) {
            for(var y=0; y<COL_NUM; y++) {
                var posX = this.marginX * x;
                var posY = this.marginY * y;
                
                // 起点にする円と現在の円の中心点距離計算
                var direction = Math.sqrt(Math.pow(Math.abs(this.centerBallPos.x-posX), 2) + Math.pow(Math.abs(this.centerBallPos.y-posY), 2));
                
                var opts = {
                    x: posX,
                    y: posY,
                    r: SIZE,
                    d: direction
                };
                var ball = new Ball(opts);
                this.balls.push(ball);
            }
        }       
    };
    
    WaveBall.prototype.resetCanvas = function() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    WaveBall.prototype.update = function(ball) {
        var time = (+new Date() - this.startTime);
                        
        //三角関数でプチeasing
        var delay = 5000 + ball.d * 2;
        console.log(time);
        ball.r = SIZE + (2 * Math.cos(((time-delay*8)/7000)*Math.PI*2));
        
    };
    
    WaveBall.prototype.draw = function() {
        this.resetCanvas();
        
        this.ctx.fillStyle = "#ff0000";
        
        for(var i=0; i<this.balls.length; i++) {
            this.update(this.balls[i]);

            this.ctx.beginPath();
            this.ctx.arc(this.balls[i].x, this.balls[i].y, this.balls[i].r, 0, Math.PI*2, false);
            this.ctx.fill();
            this.ctx.closePath(); 
        }
    };
    
    WaveBall.prototype.main = function() {
        var _self = this;
        setInterval(function() {
            _self.draw();
        }, FRAME);
    };
    
    /////////////////////////////////////////////////////////////////
    // action
    /////////////////////////////////////////////////////////////////

    $(window).load(function() {  
        var waveBall = new WaveBall();
        waveBall.main();
    });
    
})(jQuery, window, window.document, undefined);