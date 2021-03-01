// forked from takumifukasawa's "hoverで背景が変わるボタン" http://jsdo.it/takumifukasawa/j1DU
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