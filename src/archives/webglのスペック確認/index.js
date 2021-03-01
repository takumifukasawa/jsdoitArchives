"use strict";

var canvas = document.createElement("canvas");
var gl = canvas.getContext("webgl");

var extensions = gl.getSupportedExtensions();

var extensionsLogElem = document.getElementById("extensions-log");

var extensionsFrag = document.createDocumentFragment();

extensions.forEach(function (extension) {
    var p = document.createElement("p");
    p.textContent = extension;
    extensionsFrag.appendChild(p);
});

extensionsLogElem.appendChild(extensionsFrag);

var parametersLogElem = document.getElementById("parameters-log");
var checkParameters = ['ALIASED_LINE_WIDTH_RANGE', 'MAX_TEXTURE_IMAGE_UNITS'];

var parametersFrag = document.createDocumentFragment();

checkParameters.forEach(function (parameter) {
    var p = document.createElement("p");
    var param = gl.getParameter(gl[parameter]);
    p.textContent = parameter + " " + param;
    parametersFrag.appendChild(p);
});

parametersLogElem.appendChild(parametersFrag);

