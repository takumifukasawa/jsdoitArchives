// forked from takumifukasawa's "text-shadowだけでblur" http://jsdo.it/takumifukasawa/UpUE

'use strict';

window.onload = function () {

    var $texts = $('.text');

    for (var i = 0, len = $texts.length; i < len; i++) {
        var $text = $texts.eq(i);
        var chars = $text.text().split('');
        var char = chars.filter(function (e) {
            if (e !== "" && e !== " " && e !== "　" && e !== "\n") return e;
        });
    }
};

