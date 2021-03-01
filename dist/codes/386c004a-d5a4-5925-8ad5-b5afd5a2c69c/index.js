(function(window, document, undefined) {
    
    "use strict";
    
    var MAX_R = window.innerWidth*3/2,
        START_R = 0,
        DIVIDE = 12,
        NUM = 18,
        RADIUS = 1,
        LINE_WIDTH = 1,
        CENTER = {
            x: window.innerWidth/2,
            y: window.innerHeight/2
        },
        DT = 0.24,
        DT_DIFF = 0.2;
    
    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
    
    var Shape = function(opts) {
        opts = opts || {};   
        this.points = [];
        this.radius = RADIUS;
        this.t = 0;
        this.dt = opts.dt;
        this.bezierPoints = {};

        this.baseX = opts.baseX;
        this.baseY = opts.baseY;
        this.r = opts.r;
        this.rad = opts.rad;
        
        this.initialize();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {
        this.initPos();
        /*
        this.color = "rgba(255, 150, 100, 0.2)";
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
        */
    };
    
    Shape.prototype.initPos = function() {
        this.x = this.baseX + this.r*Math.cos(this.rad*Math.PI/180);
        this.y = this.baseY + this.r*Math.sin(this.rad*Math.PI/180);        
    };
    
        
    Shape.prototype.update = function() {
        this.rad += this.dt;
        this.initPos();
    };
    
    Shape.prototype.getPoints = function() {
        return { x: this.x, y: this.y };
    };

       
    /////////////////////////////////
    // Main
    /////////////////////////////////
    
    var Main = function() {
        this.canvas = null;
        this.stage = null;
        this.bg = null;
        
        this.shapes = [];
        this.points = [];
        this.lines = [];
        
        for(var i=0; i<DIVIDE; i++) {
            this.points[i] = [];
        }

        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        
        this.stage = new createjs.Stage(this.canvas);
        
        this.bg = new createjs.Shape();
        this.stage.addChild(this.bg);
        
        var x, y, rad, shape;
        var baseRadian = 360 / NUM;
        var baseR = (MAX_R-START_R)/(DIVIDE-1);

        for(var i=0; i<NUM; i++) {       
            rad = baseRadian*i;

            for(var s=0; s<DIVIDE; s++) {
                shape = new Shape({
                    baseX: CENTER.x,
                    baseY: CENTER.y,
                    r: START_R+baseR*s,
                    rad: rad,
                    dt: DT+DT_DIFF*s
                });
                this.stage.addChild(shape);  
                this.points[s].push(shape);        
            }
        }
      
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", this.render.bind(this));
        this.render();
    };
    
    Main.prototype.render = function() {
        this.bg.graphics.clear();
        var points;
        for(var i=0, len=DIVIDE; i<len; i++) {
            for(var s=0; s<NUM; s++) {
                this.points[i][s].update();
                if(i === 0) continue;
                points = [ this.points[i][s], this.points[i-1][s] ];
                this.updateLine(points);
            }
        }
        
        this.stage.update();           
    };
    
    Main.prototype.updateLine = function(p) {
        this.bg.graphics.setStrokeStyle(LINE_WIDTH);
        this.bg.graphics.beginStroke("rgba(255,150,100,1)");
        this.bg.graphics.moveTo(p[0].x, p[0].y);
        this.bg.graphics.lineTo(p[1].x, p[1].y);
    };

    
    Main.prototype.getPointsLength = function(p1, p2) {
        var x = p1.x-p2.x;
        var y = p1.y-p2.y;
        return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    };

    window.addEventListener("load", function() {
        var main = new Main();
    });
    
})(window, window.document, undefined);
