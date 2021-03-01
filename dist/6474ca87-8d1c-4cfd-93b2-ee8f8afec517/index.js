// forked from edo_m18's "ドロネー三角形分割を実装する" http://jsdo.it/edo_m18/dPBy

var w = window.innerWidth;
var h = window.innerHeight;
var fillColor = 'rgba(255, 0, 0, 0.1)';
var strokeColor = 'rgba(255, 0, 0, 0.2)';


(function (win, doc) {

    'use strict';

    var Main = function() {
        this.w             = window.innerWidth;
        this.h             = window.innerHeight;

        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas          = doc.getElementById('my-canvas');
    
        this.ctx             = this.canvas.getContext('2d');
        this.canvas.width    = this.w;
        this.canvas.height   = this.h;
        
        
        this.t = 0;
        this.num = 36;
        // 三角分割したい点をランダムに生成
        this.points = [];
        this.basePoints = [];
        this.createRandomPoints(this.num);
        //this.points = this.createRandomPoints(this.num);

    };
    
    Main.prototype.createRandomPoints = function(num) {
        var points = [];
        var x, y;
        for (var i = 0; i < num; i++) {
            x = Math.random() * this.w;
            y = Math.random() * this.h;
            this.points.push(new DT.Point(x, y));
            this.basePoints.push({
                x: x,
                y: y,
                t: Math.floor(Math.random()*360)
            });
        }
    };
    
    Main.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    Main.prototype.update = function() {


        var x, y;
        for(var i=0; i<this.num; i++) {
            this.basePoints[i].t++;
            if(this.basePoints[i].t > 360) {
                this.basePoints[i].t = 0;
            }
            x = this.basePoints[i].x + 30*Math.cos(this.basePoints[i].t*Math.PI/180);
            y = this.basePoints[i].y + 30*Math.sin(this.basePoints[i].t*Math.PI/180);
            this.points[i] = new DT.Point(x, y);
        }

    };
    
    Main.prototype.render = function() {

        // for DEBUG.
        for (var i = 0, l = this.num; i < l; i++) {
            DT.utils.drawPoint(this.ctx, this.points[i]);
        }
        
        var triangles = DT.calculate(this.points);
        DT.utils.drawTriangles(this.ctx, triangles);
    
        /*
        for (var i = 0, t; t = triangles[i]; i++) {
            var circle = DT.getCircumscribedCircle(t);
            DT.utils.drawCircle(this.ctx, circle);
        }
        */
    };
    
    Main.prototype.run = function() {
        var run = function() {
            this.clear();
            this.update();
            this.render();
            setTimeout(function() {
                run();
            }, 1000/30);
        }.bind(this);
        run();
    };
    
    var main = new Main();
    main.run();
    /*
    (function() {
        var run = function() {
            main.run();
            setTimeout(function() {
                run();
            }, 1000/30);
        };
        run();
    })();
    */
    
}(window, document));