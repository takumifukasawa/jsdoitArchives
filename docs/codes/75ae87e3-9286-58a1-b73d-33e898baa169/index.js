'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FPS = 30;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var amiImage = new Image();
var amiSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU5OThFMkFENzkzMTFFNTkzRDZGMzVCRUQ0MjY2NzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU5OThFMkJENzkzMTFFNTkzRDZGMzVCRUQ0MjY2NzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNTk5OEUyOEQ3OTMxMUU1OTNENkYzNUJFRDQyNjY3OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNTk5OEUyOUQ3OTMxMUU1OTNENkYzNUJFRDQyNjY3OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkPF34IAAAAmSURBVHjaYvr//z8DCLMwMPxnYgACVkbG/7///2dkgjFAggABBgBNjQ8EVcKPUAAAAABJRU5ErkJggg==";
//const amiSrc = "data:image/gif;base64,R0lGODlhHgAeAJEAAP9MTP/////bTP+mFyH5BAQUAP8ALAAAAAAeAB4AAAJbhI8Zy+0JkZstWoptxFRDPnkKWIkHWZoAyqgGu7grLMNBTbs2zvLoAAwKh4Ki8YgcKoXI5nEJdUqhS6mTqrQ2sUTtkxv0fsEDsZEMNBfRZTVbLXi70XC52S4uAAA7";

var Bar = (function () {
    function Bar(params) {
        _classCallCheck(this, Bar);

        params = params || {};
        this.rate = params.percent / 100;
        this.alpha = 1;
    }

    _createClass(Bar, [{
        key: 'update',
        value: function update() {}
    }]);

    return Bar;
})();

var BarGraph = (function () {
    function BarGraph() {
        _classCallCheck(this, BarGraph);

        this.initialize();
    }

    _createClass(BarGraph, [{
        key: 'initialize',
        value: function initialize() {
            this.canvas = document.getElementById('graph-canvas');
            this.ctx = this.canvas.getContext('2d');

            this.canvasBuffer = document.createElement('canvas');
            this.ctxBuffer = this.canvasBuffer.getContext('2d');

            this.width = WIDTH;
            this.height = HEIGHT;
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.beginTime = +new Date();

            this.barItems = [];

            this.barItems.push(new Bar({
                rate: 30
            }));

            this.barItems.push(new Bar({
                rate: 30
            }));

            this.barItems.push(new Bar({
                rate: 30
            }));

            this.barItems.push(new Bar({
                rate: 30
            }));
        }
    }, {
        key: 'makePattern',
        value: function makePattern() {
            var ctx = this.ctx;
            this.pattern = ctx.createPattern(amiImage, 'repeat');
        }
    }, {
        key: 'clear',
        value: function clear(ctx) {
            ctx.clearRect(0, 0, this.width, this.height);
        }
    }, {
        key: 'update',
        value: function update() {
            var ctx = this.ctx;
            var currentTime = +new Date();
            var diff = currentTime - this.beginTime;
            this.beginTime = currentTime;
            this.clear(ctx);

            for (var i = 0, len = this.barItems.length; i < len; i++) {
                var bar = this.barItems[i];
                ctx.save();

                ctx.globalCompositeOperation = 'source-over';

                var pattern = ctx.createPattern(amiImage, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(150 + 10 * Math.sin(currentTime * Math.PI / 1800), 100 * i + 10 * i, 100, 100);

                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.strokeRect(150 + 10 * Math.sin(currentTime * Math.PI / 1800), 100 * i + 10 * i, 100, 100);

                ctx.globalCompositeOperation = 'source-in';

                var grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
                grad.addColorStop(0, 'rgb(255, 0, 0)');
                grad.addColorStop(1, 'rgb(0, 255, 0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                ctx.restore();
            }
        }
    }, {
        key: 'run',
        value: function run() {
            var _self = this;
            function render() {
                setTimeout(function () {
                    _self.update();
                    render();
                }, 1000 / FPS);
            }
            render();
        }
    }]);

    return BarGraph;
})();

var barGraph = new BarGraph();

amiImage.src = amiSrc;
if (amiImage.complete) {
    barGraph.run();
} else {
    amiImage.onload = barGraph.run.bind(barGraph);
}

