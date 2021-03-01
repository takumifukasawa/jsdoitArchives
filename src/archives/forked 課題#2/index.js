// forked from yumikokh_'s "forked: 課題#2" http://jsdo.it/yumikokh_/A291
// forked from kimmy's "課題#2" http://jsdo.it/kimmy/Erue

var $w = $(window);
var ww = $w.width(), wh = $w.height();
var isOpen = false;

var  $popup = $('.popup'), $btn = $('.btn'), $overlay = $('.overlay');

$overlay.css({
    'width' : ww,
    'height' : wh
});

＄overlay.on('transitionend', () => {

            });


$btn.on('click', function() {
    
    $overlay.hasClass('show') ? $overlay.removeClass('show') : $overlay.addClass('show');

    
});
