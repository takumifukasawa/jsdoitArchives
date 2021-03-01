"use strict";

(function () {
    var properties = Object.keys(Function("return this")());
    Array.prototype.forEach.call(properties, function (value) {
        document.write(value + "<br/>");
    });
})();

