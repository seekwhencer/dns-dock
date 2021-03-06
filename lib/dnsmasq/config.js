const
    fs = require('fs-extra'),
    Config = require(`${APP_DIR}/lib/common/config`);

module.exports = class DnsmasqConfig extends Config {

    constructor(args) {
        super(args);

        this.name = 'dnsmasqconfig';
        this.label = 'DNSMASQ CONFIG';

        this.options = super.options;
        LOG(this.label, '>>> READY');
    }

};