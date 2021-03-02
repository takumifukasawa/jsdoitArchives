// forked from takumifukasawa's "4桁のinputテスト" http://jsdo.it/takumifukasawa/O6oy

'use strict';

createEvents({
    input: document.getElementById('tel-pass'),
    logger: document.getElementById('tel-logger')
});

function createEvents(_ref) {
    var input = _ref.input;
    var logger = _ref.logger;

    var currentValue = '';

    input.addEventListener('input', function () {
        update();
    });

    update();

    function update() {
        var inputValue = input.value;
        var value = validatePasscord(inputValue, currentValue);
        input.value = value;
        currentValue = value;
        logger.textContent = value;
    }
}

function validatePasscord(inputValue, currentValue) {
    var pattern = /^[0-9]{1,4}$/;
    if (inputValue.match(pattern) != null) {
        return inputValue;
    }

    if (inputValue !== '') {
        return currentValue;
    }

    return '';
}

