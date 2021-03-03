// forked from mayumii's "2016-06-09 1st" http://jsdo.it/mayumii/ev8L
var queue = new createjs.LoadQueue(true);
var manifest = [
        {"id":"image01", "src":"common/img/photo-1425036458755-dc303a604201.jpeg"},
        {"id":"image02", "src":"common/img/photo-1455325528055-ad815afecebe.jpeg"},
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