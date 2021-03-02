var $wrapper = document.getElementById("wrapper"),
    fragment = document.createDocumentFragment(),
    num = 150,
    line;
for(var i=0; i<num; i++) {
    line = document.createElement("div");
    line.className = "star";
    fragment.appendChild(line);
}
$wrapper.appendChild(fragment);