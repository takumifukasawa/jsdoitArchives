// forked from fnobi's "htmlSushiv" http://jsdo.it/fnobi/0MeK
(function htmlSushiv() {
    var SUSHI_LIST = ["すし", "寿司", "sushi", "ト"];
    for (var i = 0; i < SUSHI_LIST.length; i++) {
        document.createElement(SUSHI_LIST[i]);
    }
})();

var el = document.createElement("ト");
document.body.appendChild(el);
el.innerHTML = "マ";
