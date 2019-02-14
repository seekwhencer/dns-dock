const
    Event = require('events'),
    fs = require('fs-extra');

module.exports = function (args) {
    const
        name = 'api',
        label = 'API',
        defaults = CONFIG[name],
        event = new Event();

    let
        ready = false,
        options = {};

    function init() {
        mergeOptions();

        LOG(label, 'INIT');

        on('ready', function () {
            ready = true;
            LOG(label, '>>> READY');
        });

        APP.use('/option', require(`${APP_DIR}/lib/server/routes/option.js`));
        APP.use('/address', require(`${APP_DIR}/lib/server/routes/address.js`));
        APP.use('/config', require(`${APP_DIR}/lib/server/routes/config.js`));
        LOG(label, 'READY');
    }

    function mergeOptions() {
        if (typeof args === 'object') {
            options = R.merge(defaults, args);
        } else {
            options = defaults;
        }
    }

    function on() {
        event.on.apply(event, Array.from(arguments));
    }

    function emit() {
        event.emit.apply(event, Array.from(arguments));
    }

    init();

    return {};
};
