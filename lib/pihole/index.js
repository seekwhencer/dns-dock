const
    Super = require('../super'),
    Config = require(`${APP_DIR}/lib/common/config`),
    spawn = require('child_process').spawn;

module.exports = class Pihole extends Super {

    constructor(args) {
        super(args);

        this.name = 'pihole';
        this.label = 'PIHOLE';

        LOG(this.label, 'INIT');
        this.mergeOptions();

        this.proc = false;
        this.config = new Config({
            config_dir: this.options.config_dir,
            config_prefix: this.options.config_prefix
        });

        if (this.options.auto_log === true) {
            this.log();
        }

        LOG(this.label, '>>> READY');
    }

    mergeOptions() {
        super.mergeOptions();
        this.options.config_prefix = `${this.options.config_prefix || ''}`;
    }

    getAddresses() {
        return this.config.getAddresses();
    }

    addAddress(address) {
        const ret = this.config.addAddress(address);
        this.restart();
        return ret;
    }

    deleteAddress(id) {
        const ret = this.config.deleteAddress(id);
        this.restart();
        return ret;
    }

    restart() {
        spawn(this.options.bin, ['restartdns']);
    }

    log() {
        if (this.proc !== false)
            this.proc.kill();

        this.proc = spawn(this.options.bin, ['-t']);
        this.proc.stdout.on('data', this.monitor);
    }

    monitor(chunk) {
        if (chunk) {
            const split = chunk.toString().split('\n');
            const label = this.label;
            split.forEach((row) => {
                if (row !== '') {
                    LOG(label, 'CONSOLE:', row.replace('dnsmasq: ', ''));
                }
            });
        }
    }

    matchLog(chunk, matches) {
        const found = [];
        // ...
        if (found.length === 0)
            return false;

        return found;
    }

};