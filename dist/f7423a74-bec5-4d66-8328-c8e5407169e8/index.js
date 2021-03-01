"use strict";

$("div").on("animationend", ".texts", function () {
    alert("fejiafj");
});

$(".texts").on('click', function () {
    $(this).addClass("anime");
});

