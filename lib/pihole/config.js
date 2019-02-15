const
    fs = require('fs-extra'),
    Config = require(`${APP_DIR}/lib/common/config`);

module.exports = class PiholeConfig extends Config {

    constructor(args) {
        super(args);

        this.name = 'piholeconfig';
        this.label = 'PIHOLE CONFIG';

        this.options = super.options;
        LOG(this.label, '>>> READY');
    }
};