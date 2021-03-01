
// forked from takumifukasawa's "[2015.9.15] 範囲を指定したノード" http://jsdo.it/takumifukasawa/sx5k
(function(window, document, undefined) {
    
    "use strict";
    
    var NUM = 10;
    var RADIUS = 20;
    var LINE_WIDTH = 1;
    var NODE_LIMIT = 40;
    var BASE_TIME = 5;
    var DIRECTIONAL_TIME = 2;
    var WID = 200;
    var HEI = 100;
    var BEGIN_X = (window.innerWidth - WID) / 2;
    var BEGIN_Y = (window.innerHeight - HEI) / 2;
    var points = [
        { x: BEGIN_X, y: BEGIN_Y },
        { x: BEGIN_X+WID, y: BEGIN_Y+HEI }
    ];
    
    /////////////////////////////////
    // Shape
    /////////////////////////////////
    
    var Shape = function(opts) {
        this.opts = opts || {};   
        this.points = [];
        this.radius = this.opts.radius || RADIUS;

        this.x = this.opts.x;
        this.y = this.opts.y;

        this.initialize();
    };
    
    Shape.prototype = new createjs.Shape();
    
    Shape.prototype.initialize = function() {
        this.graphics.clear();
        this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);


        var _graphics = this.graphics;
	    _graphics.append(createjs.Graphics.beginCmd);
    	var circle = new createjs.Graphics.Circle(0, 0, this.radius);
	    _graphics.append(circle);
	    var fill = new createjs.Graphics.Fill(this.color);
        fill.style = this.color;
	    _graphics.append(fill);
    };
    
        
    Shape.prototype.update = function() {
        this.graphics.clear();
        this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        this.graphics.clear()
                    .beginFill(this.color)
                    .drawRect(Math.random()*100, Math.random()*100, 20, 20)
                    .endFill();
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

        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("myCanvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas.");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        
        this.stage = new createjs.Stage(this.canvas);
        
        for(var i=0; i<NUM; i++) {   
            var shape = new Shape({
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight,
                random: Math.random()*RADIUS
            });
            this.stage.addChild(shape);  
            this.shapes.push(shape);
        }

      
        //createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(1);
        createjs.Ticker.addEventListener("tick", this.update.bind(this));
        //this.update();
    };
    
    Main.prototype.update = function() {
        

        for(var i=0, shapeLen=this.shapes.length; i<shapeLen; i++) {
            this.shapes[i].update();
            if(i>2) break;
        }
           

        this.stage.update();
           
    };
    

    window.addEventListener("load", function() {
        var main = new Main();
    });
    
})(window, window.document, undefined);




/*
var stage;
var circle;
var fill;
function initialize(){
	var canvas = document.getElementById("myCanvas");
	var shape = new createjs.Shape();
	stage = new createjs.Stage(canvas);
	stage.addChild(shape);
	drawCircle(shape.graphics, canvas.width / 2, canvas.height / 2, 20, "cyan");
	//shape.addEventListener("click", changeCircle);
	stage.update();
}
function drawCircle(_graphics, x, y, radius, fillColor) {
	_graphics.append(createjs.Graphics.beginCmd);
	circle = new createjs.Graphics.Circle(x, y, radius);
	_graphics.append(circle);
	fill = new createjs.Graphics.Fill(fillColor);
	_graphics.append(fill);
	//_graphics.append(new createjs.Graphics.Stroke("black"));
    console.log(circle, fill);
}
function changeCircle(eventObject) {
	var radius = Math.random() * 50 + 20;
	var color = createjs.Graphics.getRGB(Math.floor(Math.random() * 0xFFFFFF));
	circle.radius = radius;
	fill.style = color;
	stage.update();
}
window.onload = initialize;
*/


