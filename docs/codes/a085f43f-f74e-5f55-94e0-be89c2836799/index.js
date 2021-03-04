// forked from mayumii's "2016-06-09 1st" http://jsdo.it/mayumii/ev8L
var queue = new createjs.LoadQueue(true);
var manifest = [
        {"id":"image01", "src":"/jsdoitArchives/assets/img/photo-1417870839255-a23faa90c6b0.jpeg"},
        {"id":"image02", "src":"/jsdoitArchives/assets/img/photo-1466154714956-9f5f64682fcc.jpg"},
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