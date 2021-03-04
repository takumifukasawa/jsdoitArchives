// forked from mayumii's "2016-06-09 1st" http://jsdo.it/mayumii/ev8L
var queue = new createjs.LoadQueue(true);
var manifest = [
        {"id":"image01", "src":"/jsdoitArchives/assets/img/photo-1475776408506-9a5371e7a068.jpeg"},
        {"id":"image02", "src":"/jsdoitArchives/assets/img/photo-1414541944151-2f3ec1cfd87d.jpeg"},
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