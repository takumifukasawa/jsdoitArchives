var wrapper = document.getElementById('wrapper');

var src = "http://jsrun.it/assets/A/Q/Z/j/AQZj7.mp3";

var audio = document.createElement("audio");

audio.addEventListener('loadedmetadata', function() {
    wrapper.innerText = audio.duration + " s";
}, false);

audio.addEventListener('canplaythrough', function() {
    audio.play();
}, false);

audio.src = src;
