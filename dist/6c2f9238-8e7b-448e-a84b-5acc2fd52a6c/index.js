'use strict';

var DOMURL = self.URL || self.webkitURL || self;

var wrapper = document.getElementById('wrapper');
var canvas = document.getElementById('canvas');
var targetDOM = document.getElementById('dom');
var images = document.querySelectorAll('.image');
var bgImages = document.querySelectorAll('.bg');
var button = document.getElementById('button');

var cssArray = ["font-family", "font-size", "font-weight", "font-style", "color", "text-transform", "text-decoration", "letter-spacing", "word-spacing", "line-height", "text-align", "vertical-align", "direction", "background-color", "background-image", "background-repeat", "background-position", "background-attachment", "opacity", "width", "height", "top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "position", "display", "visibility", "z-index", "overflow-x", "overflow-y", "white-space", "clip", "float", "clear", "cursor", "list-style-image", "list-style-position", "list-style-type", "marker-offset"];

var ctx = canvas.getContext('2d');

var width = 0;
var height = 0;

preloadAndConvertBase64(bgImages);
preloadAndConvertBase64(images);
window.onload = function () {
    resize();
    button.addEventListener('click', draw);
};

function resize() {
    width = targetDOM.offsetWidth;
    height = targetDOM.offsetHeight;

    wrapper.style.width = width + 'px';
    wrapper.style.height = height + 'px';

    canvas.width = width;
    canvas.height = height;
}

function getDOMConvertedInlineStyles(wrapperDOM) {
    var cssText = '';
    var clone = wrapperDOM.cloneNode(true);
    var children = wrapperDOM.querySelectorAll('*');
    var cloneChildren = clone.querySelectorAll('*');
    for (var i = 0, ilen = cloneChildren.length; i < ilen; i++) {
        var elem = children[i];
        var cloneElem = cloneChildren[i];
        for (var j = 0, jlen = cssArray.length; j < jlen; j++) {
            var prop = cssArray[j];
            var value = window.getComputedStyle(elem, null).getPropertyValue(prop);
            cssText += prop + ': ' + value + '; ';
        }
        cloneElem.setAttribute('style', cssText);
    }
    return clone;
}

function getMimeType(src) {
    if (src.match(/.*\.png/)) {
        return 'image/png';
    }
    if (src.match(/.*\.jpg|jpeg/)) {
        return 'image/jpeg';
    }
}

function getBase64(img, mimeType) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
}

function preloadAndConvertBase64(elems) {
    var _loop = function (i, len) {
        var dom = elems[i];
        var type = dom.getAttribute('data-type');
        var src = dom.getAttribute('data-src');
        var mimeType = getMimeType(src);
        var img = new Image();

        img.onload = function () {
            var srcBase64 = getBase64(img, mimeType);
            switch (type) {
                case 'img':
                    dom.src = srcBase64;
                    break;
                case 'bg':
                    dom.style.backgroundImage = 'url(' + srcBase64 + ')';
                    break;
            }
        };

        img.src = src;
    };

    for (var i = 0, len = elems.length; i < len; i++) {
        _loop(i, len);
    }
}

function draw() {
    if (!ctx) return;

    var dom = getDOMConvertedInlineStyles(targetDOM);

    var html = dom.innerHTML.replace(/<br(.*?)>/g, "<br$1\/>").replace(/<img(.*?)>/g, "<img$1\/>");

    var data = '\n    <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'' + width + '\' height=\'' + height + '\'>\n         <foreignObject width=\'100%\' height=\'100%\'>\n             <div xmlns=\'http://www.w3.org/1999/xhtml\'>\n                   ' + html + '\n              </div>\n          </foreignObject>\n    </svg>\n    ';

    var img = new Image();
    var svg = new Blob([data], { type: "image/svg+xml" });

    var url = DOMURL.createObjectURL(svg);

    img.onload = function () {
        console.log('loaded');
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        targetDOM.style.display = 'none';
    };

    //img.crossOrigin = 'anonymous';
    img.src = url;
}

