'use strict';

window.onload = function () {
    $('.wrapper').on('transitionend', function () {
        alert('transitionend!');
    });
    $('.wrapper > div').addClass('is-show');
};

