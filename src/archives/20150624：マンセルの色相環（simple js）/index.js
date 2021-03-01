(function($, window, document, undefined) {

    "use strict";

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
    var num = COLORS.length;

    $("#wrapper")
        .width($(window).width())
        .height($(window).height());

    var html = "";
    for(var i=0; i<num; i++) {
        html += '<div class="circle"></div>' + "\n";
    }

    $(".content").append(html);
    var deg = 360 / num;
    var red = deg * (Math.PI/180);
    var begin = 90 * (Math.PI/180);
    var $circles = $(".circle");
    var r = $circles.width() * 3;
    var toCenter = ($("#wrapper").width()/2) - ( $circles.width()/2);

    $circles.each(function(i, elem) {
        var nowDeg = red*i - begin;
        var x = Math.cos(nowDeg) * r + toCenter;
        var y = Math.sin(nowDeg) * r + toCenter;

        $(elem).css({
            'left': x,
            'top': y,
            'background-color': "#" + COLORS[i]
        });
    });
    
})(jQuery, window, window.document, undefined);