'use strict';

createEvents({
    input: document.getElementById('text-number-pass'),
    logger: document.getElementById('text-number-logger')
});

createEvents({
    input: document.getElementById('tel-pass'),
    logger: document.getElementById('tel-logger')
});

function createEvents(_ref) {
    var input = _ref.input;
    var logger = _ref.logger;

    input.addEventListener('input', function () {
        var value = input.value;

        logger.textContent = value;
    });
}

