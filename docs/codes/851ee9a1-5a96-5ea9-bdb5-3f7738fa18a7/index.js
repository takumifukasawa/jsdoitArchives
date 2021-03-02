// forked from takumifukasawa's "forked: [2015.10.18] 自分でsvgを描いてみる" http://jsdo.it/takumifukasawa/aIlR
// forked from takumifukasawa's "[2015.10.18] 自分でsvgを描いてみる" http://jsdo.it/takumifukasawa/sjII

$lines = document.getElementById("lines");

var html,
    frag,
    line,
    x1 = 0,
    y1 = 0,
    x2 = -465,
    y2 = 465,
    num = 60,
    diff = 16;

$(document).ready(function() {
    frag = document.createDocumentFragment();
    for(var i=0; i<num; i++) {
        line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute("x1", x1+diff*i);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2+diff*i);
        line.setAttribute("y2", y2);
        //line.setAttribute("onmouseover", "evt.target.setAttribute('class', 'hover')");
        //line.setAttribute("onmouseout", "evt.target.removeAttribute('class')");
        frag.appendChild(line);
    }
    $lines.appendChild(frag);
});

