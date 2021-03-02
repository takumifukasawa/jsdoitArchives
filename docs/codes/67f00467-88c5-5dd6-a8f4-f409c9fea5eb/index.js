    
    var Throttle = function(minInterval) {
        var _timeStamp = 0,
            _timerId;
        
        var exec = function(func) {
            var now   = +new Date(),
                delta = now - _timeStamp;

            clearTimeout(_timerId);
            if (delta >= minInterval) {
                _timeStamp = now;
                func();
            } else {
                _timerId = setTimeout(function() {
                    exec(func);
                }, minInterval - delta);
            }
        };
        
        return {
            exec : exec
        };
    };
  