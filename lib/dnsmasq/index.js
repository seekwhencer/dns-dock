const
    Event = require('events'),
    fs = require('fs-extra'),
    spawn = require('child_process').spawn,
    crypto = require('crypto'),
    config = require('./config'),
    leases = require('./leases'),
    names = require('./names');


module.exports = function (args) {
    const
        name = 'dnsmasq',
        label = 'DNSMASQ',
        defaults = CONFIG[name],
        event = new Event();

    let
        ready = false,
        options = {},
        proc = false;

    function init() {
        mergeOptions();
        createConfigFile();
        getAddresses();

        on('ready', function () {
            ready = true;
            LOG(label, '>>> READY');
        });

        on('data', function (chunk) {
            ready = true;
            LOG(label, 'CHUNK', chunk);
        });

        if (options.autostart === true && options.pihole !== true) {
            run();
        }
    }

    function mergeOptions() {
        if (typeof args === 'object') {
            options = R.merge(defaults, args);
        } else {
            options = defaults;
        }
        options.config['conf-dir'] = `${options.config_dir}/,*.conf`;
        options.config['dhcp-leasefile'] = options.lease_file;
    }

    function run() {
        if (options.pihole === true) {

        } else {
            const processOptions = ['-C', options.config_file, '--no-daemon'];
            LOG(label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

            const match = {
                updating: new RegExp(/update: starting/),
            };

            proc = spawn(options.bin, processOptions);
            proc.stdout.setEncoding('utf8');
            proc.stderr.setEncoding('utf8');
            proc.stderr.on('data', function (chunk) {
                emit('data', chunk);
                Object.keys(match).forEach(function (key) {
                    if (match[key].length === undefined) {
                        if (chunk.match(match[key])) {
                            emit(key, chunk);
                        }
                    } else {
                        match[key].forEach(function (event) {
                            if (chunk.match(event)) {
                                emit(key, chunk);
                            }
                        });
                    }
                });
            });
            proc.stdout.on('data', function (chunk) {
                LOG(label, '>>>>>>', chunk);
            });
            proc.stderr.on('end', function () {
                emit('shutdown');
            });
        }
    }

    function stop() {
        proc.kill();
    }

    function restart() {
        if (options.pihole === true) {
            spawn('/usr/local/bin/pihole', ['restartdns']);
        } else {
            stop();
            setTimeout(() => {
                run();
            }, options.restart_delay);
        }
    }

    function createConfigFile() {
        if (options.pihole === true) {
            return false;
        }
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
        fs.writeFileSync(`${options.config_file}`, configFileData);
    }

    function getAddresses() {
        LOG(label, 'GET ADDRESS FILES');
        let addressFiles = [];
        fs.readdirSync(options.config_dir).forEach(function (file) {
            const fileName = `${options.config_dir}/${file}`;
            const prefixMatch = `${file.substring(options.config_prefix.length, 0)}`;
            if(prefixMatch !== options.config_prefix){
                return;
            }
            const fileData = fs.readFileSync(fileName);
            const address = fileData.toString().split('=')[1];
            const target = address.split('/')[2];
            const source = address.split('/')[1];
            addressFiles.push({
                target: target,
                source: source,
                address: address,
                id: crypto.createHash('md5').update(`${address}`).digest("hex")
            });
        });
        const count = Object.keys(addressFiles).length;
        if (count === 0) {
            LOG(label, 'NO FILE FOUND');
        } else {
            LOG(label, count, 'ADDRESSES LOADED');
        }
        return addressFiles;
    }

    function addAddress(address) {
        LOG(label, 'ADD', address);
        const row = `address=/${address.source}/${address.target}`;
        const fileName = `${options.config_dir}/${options.config_prefix}${address.source}.conf`;
        fs.writeFileSync(fileName, row);
        restart();
    }

    function deleteAddress(id) {
        LOG(label, 'REMOVE', id);
        const addresses = getAddresses();
        addresses.forEach(item => {
            if (item.id === id) {
                fs.removeSync(`${options.config_dir}/${options.config_prefix}${item.source}.conf`);
            }
        });
        restart();
    }

    function on() {
        event.on.apply(event, Array.from(arguments));
    }

    function emit() {
        event.emit.apply(event, Array.from(arguments));
    }

    init();

    return {
        start: run,
        stop: stop,
        restart: restart,
        getAddresses: getAddresses,
        addAddress: addAddress,
        deleteAddress: deleteAddress
    };
};


/*
function dnsmasq(config){
    if(!(this instanceof dnsmasq))
        return new dnsmasq(config);
    this.config = config;
    return this;
}

dnsmasq.config = config;
dnsmasq.leases = leases;
dnsmasq.names = names;

module.exports = dnsmasq;
*/