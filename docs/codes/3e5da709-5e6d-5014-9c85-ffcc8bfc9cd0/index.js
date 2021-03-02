var wid = window.innerWidth + "px";
var hei = window.innerHeight + "px";

var wrapper = document.getElementById("wrapper");
wrapper.style.width = wid;
wrapper.style.height= hei;

var rects = document.getElementsByClassName("rect");

window.onload = function() {
    for(var i=0; i<rects.length; i++) {
        rects[i].style.width = wid;
        rects[i].style.height = hei;
    }
    $(".rect").fadeIn(1500);
};
