(function(win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.canvas = doc.getElementById('my-canvas');
        paper.setup(this.canvas);
        paper.view.onframe = this.onFrame;

        this.tool = new paper.Tool();
        this.tool.activate();
        this.tool.onMouseDown = this.mouseDown.bind(this);
        
        this.path = new paper.Path();
        this.path.strokeColor = "black";
                
        this.run();
    };
    
    Main.prototype.mouseDown = function(event) {
        console.log(event);
        this.path.add(event.point);
    };
    
    Main.prototype.run = function() {
    };
    
    new Main();
    
})(window, window.document);
