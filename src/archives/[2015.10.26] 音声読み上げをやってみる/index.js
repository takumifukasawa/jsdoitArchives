var synthes = new SpeechSynthesisUtterance(
    "はろーわーるど hello world"
);
synthes.lang = "ja-JP";

var $button = document.getElementById("play");
$button.addEventListener('click', function() {
    speechSynthesis.speak(synthes);
}, false);