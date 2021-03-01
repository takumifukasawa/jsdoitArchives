// forked from takumifukasawa's "マンセルの色相環" http://jsdo.it/takumifukasawa/qRc5
(function($, window, document, undefined) {

    /********************
     * const
     *******************/
    
    var COLORS = [
        "E60012",
        "F39800",
        "FFF100",
        "8FC31F",
        "009944",
        "009E96",
        "00A0E9",
        "0068B7",
        "1D2088",
        "920783",
        "E4007F",
        "E5004F"
    ];
    var COLOR_NUM = COLORS.length;
    
    var radius = 30;
    var distance = 150;
    
    /********************
     * class
     *******************/
  
    var Main = function() {
        this.canvas = null;
        this.ctx = null;
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = document.getElementById("my-canvas");
        if(!this.canvas.getContext) throw new Error("cannot make canvas");
        
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    
    Main.prototype.draw = function() {

        var deg = 360 / COLOR_NUM;
        var begin = 90;

        for(var i=0; i<COLOR_NUM; i++) {
            var nowDeg = (deg * i - begin) * Math.PI / 180;
            this.ctx.beginPath();
            this.ctx.arc(
                this.canvas.width / 2 + Math.cos(nowDeg)*distance,
                this.canvas.height / 2 + Math.sin(nowDeg)*distance,
                radius,
                0,
                Math.PI*2,
                false
            );
            console.log(Math.cos(nowDeg)*distance);
            this.ctx.fillStyle = "#" + COLORS[i];
            this.ctx.fill();
            this.ctx.closePath();
        }

    };
    
    var main = new Main();
    main.draw();
    
})(jQuery, window, window.document, undefined);