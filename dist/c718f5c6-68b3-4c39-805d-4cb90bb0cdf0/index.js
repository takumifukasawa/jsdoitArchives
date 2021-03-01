// forked from takumifukasawa's "[2015..2.8] svgのパスに沿ってdomを動かす" http://jsdo.it/takumifukasawa/4dKr

"use strict";

window.onload = function () {

    var svg = document.getElementById("my-svg");
    var circle = document.getElementById("circle");

    var path = document.getElementById("my-path");
    var pathLength = path.getTotalLength();

    var nowPos = 0;

    function anime() {
        $({ pos: 0 }).animate({
            pos: pathLength
        }, {
            duration: 3000,
            progress: function progress(anime, _progress, fx) {
                var obj = anime.elem;
                var point = path.getPointAtLength(obj.pos);
                var x = point.x - 15 + "px";
                var y = point.y - 15 + "px";
                circle.style.left = x;
                circle.style.top = y;
            },
            complete: anime
        });
    }

    anime();
};

