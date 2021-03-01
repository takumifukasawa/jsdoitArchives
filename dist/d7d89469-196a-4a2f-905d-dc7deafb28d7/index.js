
/*
const manifiestJson = [
    { "id": "image0", "src": "fjei;a.jpg" },
    
    { "id": "image1", "src": "fi;a.jpg" }
];
*/

'use strict';

var manifiest = [];

var $image = $('.preload-img');

$image.each(function () {
    var data = {
        id: $(this).attr('id'), // image0
        src: $(this).attr('data-src') // ~~~~.jpg
    };

    manifiest.push(data);
});

$image.each(function (i) {
    var $item = $image.eq(i);

    var id = 'image-' + i;
    $item.setAttribute(id);

    var data = {
        id: id,
        src: $item.attr('data-src') // ~~~~.jpg
    };

    manifiest.push(data);
});

console.log(manifiest);

