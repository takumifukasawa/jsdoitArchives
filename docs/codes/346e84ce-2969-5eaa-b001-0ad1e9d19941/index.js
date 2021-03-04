//////////////////////////////////////////////
// analyser
//////////////////////////////////////////////

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Analyser = (function () {
    function Analyser(opts) {
        _classCallCheck(this, Analyser);

        opts = opts || {};
        // audio init
        this.audioContext = new window.AudioContext();
        this.soundSource = this.audioContext.createBufferSource();
        this.source = null;
        this.audio = new Audio();
        this.srcUrl = "/jsdoitArchives/assets/audio/jazz_opening.mp3";
        //this.srcUrl = "/jsdoitArchives/assets/audio/jazz_opening.mp3";
        this.analyser = this.audioContext.createAnalyser();
        this.timeDomain = new Uint8Array(1024);

        this.run = opts.run || function () {};

        //this.initEvents();
        this.initialize();
    }

    _createClass(Analyser, [{
        key: "initialize",
        value: function initialize() {
            var _self = this;

            var request = new XMLHttpRequest();
            request.open("GET", this.srcUrl, true);
            request.responceType = 'arraybuffer';
            request.onload = function () {
                var res = request.responce;
                console.log(res, this.status, this.responce, request.responce);
                //_self.makeSound(request.responce);
            };
            request.send();
        }
    }, {
        key: "makeSound",
        value: function makeSound(audioData) {
            var _self = this;

            var soundSource = this.audioContext.createBufferSource();
            this.audioContext.decodeAudioData(audioData, function (soundBuffer) {
                soundSource.buffer = soundBuffer;
                // soundSource.connect({ _self.audioContext.destination });
                _self.run();
            });
        }
    }, {
        key: "play",
        value: function play() {
            var source = this.audioContext.createMediaElementSource(this.audio);
            var filter = this.audioContext.createBiquadFilter();
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            //this.canvas.style.display = "block";
            this.audio.play();
            return source;
        }
    }, {
        key: "audioLoad",
        value: function audioLoad(file) {
            var fileReader = new FileReader();
            fileReader.onload = (function (e) {
                //this.canvas.display = 'block';
                var blob = new Blob([e.target.result], { "type": file.type });
                this.audio.src = window.URL.createObjectURL(blob);
                this.play();
                this.audio.play();
                this.run();
            }).bind(this);
            fileReader.readAsArrayBuffer(file);
        }
    }, {
        key: "update",
        value: function update() {
            this.analyser.getByteTimeDomainData(this.timeDomain);
            return this.timeDomain[0] - 128;
        }
    }]);

    return Analyser;
})();

new Analyser();

