// forked from mayumii's "2016-06-09 1st" http://jsdo.it/mayumii/ev8L
var queue = new createjs.LoadQueue(true);
var manifest = [
        {"id":"image01", "src":"/jsdoitArchives/assets/img/photo-1473167146081-90eecb675695.jpeg"},
        {"id":"image02", "src":"/jsdoitArchives/assets/img/photo-1465588042420-47a53c2d0320.jpeg"},
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