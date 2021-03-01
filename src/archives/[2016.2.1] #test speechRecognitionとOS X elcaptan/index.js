var speech = new SpeechRecognition();

speech.onresult = function(event) {
    console.log(event);
};

$("#button").on('click', function() {
    speech.start();       
});