// forked from Biske's "forked: DOM要素をcanvasで描画" http://jsdo.it/Biske/6L7x
// forked from Biske's "DOM要素をcanvasで描画" http://jsdo.it/Biske/wAu3
(function(d, w){
    var WIDTH = 450;
    var HEIGHT = 450;
    var FONT_SIZE = 24;
    var canvas = d.getElementById("world");
    var dom = d.getElementById("dom");
    var button = d.getElementById("button_change");
    var ctx = canvas.getContext("2d");
    var data = 
        "<svg xmlns='http://www.w3.org/2000/svg' width='"+WIDTH+"px' height='"+HEIGHT+"px'>" +
            "<foreignObject width='100%' height='100%'>" +
                "<div xmlns='http://www.w3.org/1999/xhtml' style='font: "+FONT_SIZE+"px sans-serif;'>" +
                    dom.innerHTML+
                "</div>" +
            "</foreignObject>" +
        "</svg>";
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg);
    img.addEventListener("load", function() {
        console.log('loaded');
        DOMURL.revokeObjectURL(url);
        button.addEventListener("click", function(){
            ctx.drawImage(img, 0, 0);
            dom.style.display = "none";
            button.removeEventListener("click", arguments.callee, false);
        }, false);
    }, false);
    console.log(DOMURL, DOMURL.createObjectURL);
    img.src = url;
    ctx.canvas.width = WIDTH;
    ctx.canvas.height= HEIGHT;
})(document, window);