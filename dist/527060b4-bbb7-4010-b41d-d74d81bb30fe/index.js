var synthes = new SpeechSynthesisUtterance(
    "がんばるぞい"
);
synthes.lang = "ja-JP";

var $button = document.getElementById("play");
$button.addEventListener('click', function() {
    speechSynthesis.speak(synthes);
}, false);