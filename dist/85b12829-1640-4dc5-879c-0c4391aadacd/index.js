var NUM = 465 / 15;

var wrapper,
    rect,
    delay,
    delayTime;

wrapper = document.getElementsByClassName("wrapper")[0];
delayTime = 0.2;

for(var i=0, colLen=NUM-1; i<colLen; i++) {
    for(var s=0, rowLen=NUM-1; s<rowLen; s++) {
        rect = document.createElement("div");
        rect.className = "rect";
        
        delay = (delayTime * i) + "s";
        rect.style.animationDelay = delay;
        
        wrapper.appendChild(rect);
    }
}