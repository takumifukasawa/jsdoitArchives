// forked from mayumii's "2016-06-09 1st" http://jsdo.it/mayumii/ev8L
var queue = new createjs.LoadQueue(true);
var manifest = [
        {"id":"image01", "src":"/jsdoitArchives/assets/img/photo-1469537053566-3081fd1e0de2.jpeg"},
        {"id":"image02", "src":"/jsdoitArchives/assets/img/photo-1469594292607-7bd90f8d3ba4.jpeg"},
];
    
queue.addEventListener('fileload', fileLoad);
    
function fileLoad(event) {
    console.log(event);
    document.body.appendChild(event.result);
}
   
    
var $btn = $('.btn');

$btn.on('click',  function() {   
    queue.loadManifest(manifest,true);
});