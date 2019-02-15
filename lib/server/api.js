const
    Super = require('../super');

module.exports = class Api extends Super {

    constructor(args) {
        super(args);

        this.name = 'api';
        this.label = 'API';

        LOG(this.label, 'INIT');
        this.mergeOptions();

        APP.use('/option', require(`${APP_DIR}/lib/server/routes/option.js`));
        APP.use('/address', require(`${APP_DIR}/lib/server/routes/address.js`));
        APP.use('/config', require(`${APP_DIR}/lib/server/routes/config.js`));
        LOG(this.label, '>>> READY');
    }

};