var wrapper = document.getElementById('wrapper');

var src = "/jsdoitArchives/assets/audio/jingle9.mp3";

var audio = document.createElement("audio");

audio.addEventListener('loadedmetadata', function() {
    wrapper.innerText = audio.duration + " s";
}, false);

audio.addEventListener('canplaythrough', function() {
    audio.play();
}, false);

audio.src = src;
