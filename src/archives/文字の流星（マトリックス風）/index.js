$(function() {


    "use strict";

    var Drops = function() {
        this.canvas = null;
        this.ctx = null;
        
        this.str = "いろはにほへとちりぬるをわかよたれそとつねならむ";
        this.strArray = this.str.split("");
        this.fontSize = 11;
        
        this.columns = 0;
        this.dropArray = [];
        
        this.initialize();
    };
    
    Drops.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        if(!this.canvas.getContext) throw new Error("cannot get context.");

        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.columns = this.canvas.width / this.fontSize;

        for(var i = 0; i < this.columns; i++) {
            this.dropArray[i] = 1;
        }

    };

    Drops.prototype.draw = function() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = "#0F0";
        
        this.ctx.font = this.fontSize + "px";
        for(var i = 0; i < this.columns; i++) {
            var text = this.strArray[Math.floor(Math.random()*this.strArray.length)];
            this.ctx.fillText(text, i*this.fontSize, this.dropArray[i]*this.fontSize);
           
            if(this.dropArray[i]*this.fontSize > this.canvas.height || Math.random() > 0.95) {
                this.dropArray[i] = 0;
            }
            this.dropArray[i]++;
        }
    };
    
    Drops.prototype.main = function() {
        var instance = this;
        setInterval(function() {
            instance.draw(); 
        }, 50);
    };
    
    var drops = new Drops();
    drops.main();
});