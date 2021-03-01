(function($, win, doc) {
    
    "use strict";
    
    var Main = function() {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = "ja-JP";
        this.recognition.interimResults = true;
        this.recognition.continuous = true;
        this.recognition.maxAlternatives = 20;
        
        this.$start = $("#start");
        this.$stop = $("#stop");
        this.$state = $("#state");
        this.$recognizedText = $("#recognized-text");
        
        this.initialize();
    };
    
    Main.prototype.initialize = function() {
        this.recognition.onsoundstart = this.onsoundstart.bind(this);
        this.recognition.onnomatch = this.onnomatch.bind(this);
        this.recognition.onerror = this.onerror.bind(this);
        this.recognition.onsounded = this.onsounded.bind(this);
        this.recognition.onresult = this.onresult.bind(this);
        
        this.$start.on("click", function() {
            this.recognition.start();
        }.bind(this));
        this.$stop.on("click", function() {
            this.recognition.stop();
        }.bind(this));
    };
    
    Main.prototype.onsoundstart = function() {
        this.$state.text("認識中");
    };
    
    Main.prototype.onnomatch = function() {    
        this.$recognizedText.text("もう一度試してください");
    };
    
    Main.prototype.onerror = function() {    
        this.$recognizedText.text("エラー");
    };
    
    Main.prototype.onsounded = function() {    
        this.$state.text("停止中");
    };
    
    Main.prototype.onresult = function() {
        var results = event.results;
        for (var i = event.resultIndex; i<results.length; i++){
            this.$recognizedText.text(results[i][0].transcript);
        }
    };

    var main = new Main();    
    
})(jQuery, window, window.document);
