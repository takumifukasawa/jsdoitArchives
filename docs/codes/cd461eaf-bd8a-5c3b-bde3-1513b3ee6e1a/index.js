"use strict";

var fibonacci = memolizer([0, 1], function (shell, n) {
    return shell(n - 1) + shell(n - 2);
});

var factorial = memolizer([1, 1], function (shell, n) {
    return n * shell(n - 1);
});

function memolizer(memo, fundamental) {
    var shell = function shell(n) {
        var result = memo[n];
        //console.log(n);
        if (typeof result !== "number") {
            result = fundamental(shell, n);
            memo[n] = result;
        }
        return result;
    };
    return shell;
};

fibonacci(10);

