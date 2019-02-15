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

    createConfigFile() {
        const options = this.options;
        LOG('CREATE CONFIG FILE', options.config_file);
        let configFileData = '';
        Object.keys(options.config).forEach(key => {
            const item = options.config[key];
            if (typeof item === 'boolean') {
                if (item === true) {
                    configFileData += `${key}\n`;
                }
            }
            if (typeof item === 'string') {
                configFileData += `${key}=${item}\n`;
            }
            if (typeof item === 'object') {
                item.forEach(row => {
                    configFileData += `${key}=${row}\n`
                });
            }
        });
        fs.writeFileSync(options.config_file, configFileData);
    }
};