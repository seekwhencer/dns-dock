const
    Super = require('../super'),
    fs = require('fs-extra'),
    crypto = require('crypto');

module.exports = class Config extends Super {
    constructor(args) {
        super(args);

        this.name = 'dnsconfig';
        this.label = 'DNS CONFIG';

        this.mergeOptions();
    }

    createConfigFile() {
        const options = this.options;
        LOG(this.label, 'CREATE CONFIG FILE', options.config_file);
        let configFileData = '\n# this file is managed by dns-dock\n# dont touch it manually\n\n';
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

    getAddresses() {
        const options = this.options;
        LOG(this.label, 'GET ADDRESS FILES IN:', options.config_dir);
        let addressFiles = [];
        fs.readdirSync(options.config_dir).forEach(function (file) {
            const fileName = `${options.config_dir}/${file}`;
            const prefixMatch = `${file.substring(options.config_prefix.length, 0)}`;
            if (prefixMatch !== options.config_prefix) {
                return;
            }
            LOG('FILENAME', fileName);
            const fileData = fs.readFileSync(fileName);
            const address = fileData.toString().split('=')[1];
            const target = address.split('/')[2];
            const source = address.split('/')[1];
            addressFiles.push({
                target: target,
                source: source,
                address: address,
                id: crypto.createHash('md5').update(`${address}`).digest("hex"),
                path: fileName
            });
        });
        const count = Object.keys(addressFiles).length;
        if (count === 0) {
            LOG(this.label, 'NO FILE FOUND');
        } else {
            LOG(this.label, count, 'ADDRESSES LOADED');
        }
        return addressFiles;
    }

    addAddress(address) {
        LOG(this.label, 'ADD', address);
        const row = `address=/${address.source}/${address.target}`;
        const fileName = `${this.options.config_dir}/${this.options.config_prefix}${address.source}.conf`;
        fs.writeFileSync(fileName, row);
    }

    deleteAddress(id) {
        LOG(this.label, 'REMOVE', id);
        const addresses = this.getAddresses();
        addresses.forEach(item => {
            if (item.id === id) {
                fs.removeSync(`${this.options.config_dir}/${this.options.config_prefix}${item.source}.conf`);
            }
        });
    }

};