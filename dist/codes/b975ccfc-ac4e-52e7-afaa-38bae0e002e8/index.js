document.getElementById("helloWorld").innerHTML = "asyncTest";

var async = function (fns) {
    (function exec (index) {
        if (!fns[index]) {
            return;
        }
        fns[index](function () {
            exec(index + 1);
        });
    })(0);
};

var alert1 = function(next) {
    setTimeout(function() {
        document.getElementById("helloWorld").innerHTML = "alert1";
        next();
    }, 2000);
};

var alert2 = function(next) {
    setTimeout(function() {
        document.getElementById("helloWorld").innerHTML = "alert2";
        next();
    }, 2000);
};

var fnsArray = [alert1, alert2];

async(fnsArray);