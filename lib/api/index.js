const
    Event = require('events'),
    fs = require('fs-extra'),
    formidable = require('formidable');

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

        on('ready', function () {
            ready = true;
            LOG(label, '>>> READY');
        });

        APP.use((req, res, next) => {
            const form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    LOG(name, 'FORMIDABLE ERROR', err, fields);
                }
                if (Object.keys(fields).length > 0) {
                    req.formData = fields;
                    // for passport
                    if (req.originalUrl === '/login') {
                        if (fields.email) req.query.email = fields.email;
                        if (fields.password) req.query.password = fields.password;
                    }
                }
                next();
            });
        });

        APP.use('/', require(`${APP_DIR}/lib/api/routes/home.js`));
        APP.use('/address', require(`${APP_DIR}/lib/api/routes/address.js`));
        APP.use('/config', require(`${APP_DIR}/lib/api/routes/config.js`));
        APP.listen(options.port, onListen);
    }

    function mergeOptions() {
        if (typeof args === 'object') {
            options = R.merge(defaults, args);
        } else {
            options = defaults;
        }
    }

    function onListen() {
        emit('ready');
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
