$(function() {

    $("#wrapper")
        .width($(window).width())
        .height($(window).height());
    
    $("#button")
        .css({
            "display": "block",
            "margin-left": (($("#button").width()/2 * -1) + "px"),
            "margin-top": (($("#button").height()/2 * -1) + "px"),
        });

});