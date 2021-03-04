$(function() {


    "use strict";

    const IMAGE_SRC = "/jsdoitArchives/assets/img/photo-1474470172489-c75ce5cbf836.jpeg";
    
    /*
     * main
     */
    
    var Main = function() {
        this.image = null;
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("canvas");
        if(!this.canvas.getContext) throw new Error("cannot use context");
        
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.image = new Image();

    };
    
    Main.prototype.preLoad = function() {
        this.image.src = IMAGE_SRC + "?" + new Date().getTime();

        var instance = this;
        this.image.onload = function() {
            instance.draw();
        };
    };
    
    Main.prototype.draw = function() {
        var w, h;
        w = 120;
        h = 80;
        for(var i=0; i<this.canvas.width/w; i++) {
            for(var j=0; j<this.canvas.height/h; j++) {
                this.ctx.drawImage(this.image, i*w, j*h, w, h);
            }
        };
        
    };
    
    /*
     * action
     */
    
    var main = new Main();

    window.onload = function() {
        main.preLoad();
    };
});