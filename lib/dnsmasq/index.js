const
    Config = require('./config.js'),
    spawn = require('child_process').spawn;

module.exports = class Dnsmasq {

    constructor(args) {
        this.name = 'dnsmasq';
        this.label = 'DNSMASQ';
        LOG(this.label, 'INIT');

        this.args = args;
        this.defaults = CONFIG[this.name];
        this.options = {};
        this.proc = false;
        this.mergeOptions();

        this.config = new Config({
            config: this.options.config,
            config_file: this.options.config_file,
            config_dir: this.options.config_dir,
            config_prefix: this.options.config_prefix
        });

        this.createConfigFile();
        this.getAddresses();

        if (this.options.autostart === true) {
            this.start();
        }

        LOG(this.label, '>>> READY');
    }

    get options() {
        return this._options;
    }

    set options(param) {
        this._options = param;
    }

    mergeOptions() {
        if (typeof this.args === 'object') {
            this.options = R.merge(this.defaults, this.args);
        } else {
            this.options = this.defaults;
        }
        this.options.config['conf-dir'] = `${this.options.config_dir}/,*.conf`;
        this.options.config['dhcp-leasefile'] = this.options.lease_file;
        this.options.config_prefix = `${this.options.config_prefix || ''}`;
    }

    createConfigFile() {
        this.config.createConfigFile();
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

    start() {
        const processOptions = ['-C', this.options.config_file, '--no-daemon'];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

        const match = {
            updating: new RegExp(/update: starting/),
        };

        this.proc = spawn(this.options.bin, processOptions);
        this.proc.stdout.setEncoding('utf8');
        this.proc.stderr.setEncoding('utf8');
        this.proc.stderr.on('data', this.monitor.bind(this));
        this.proc.stdout.on('data', this.monitor.bind(this));
        this.proc.stderr.on('end', this.monitor.bind(this));
    }

    stop() {
        this.proc.kill();
    }

    restart() {
        const options = this.options;
        this.stop();
        setTimeout(() => {
            this.start();
        }, options.restart_delay);
    }

    monitor(chunk) {
        if (chunk) {
            const split = chunk.toString().split('\n');
            const label = this.label;
            split.forEach((row) => {
                if (row !== '') {
                    LOG(label, 'CONSOLE:', row.replace('dnsmasq: ', ''));

                    const found = this.matchLog(row, {
                        ready: 'started, '
                    });

                    if (found.ready) {
                        LOG(this.label, 'START COMPLETE');
                    }
                }
            });
        }
    }

    matchLog(row, matches) {
        const found = {};
        Object.keys(matches).forEach(function (event) {
            if (row.match(matches[event])) {
                found[event] = {
                    row: row,
                    event: event,
                    find: matches[event]
                };
            }
        });
        if (Object.keys(found).length === 0)
            return false;

        return found;
    }

};