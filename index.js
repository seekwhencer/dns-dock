const
    Api = require('./lib/api');

require('./lib/globals');

if (global.ENV === 'pihole') {
    const Pihole = require('./lib/pihole');
    global.ENGINE = new Pihole();
} else {
    const DnsMasq = require('./lib/dnsmasq');
    global.ENGINE = new DnsMasq();
}

//global.DNSMASQ = new DnsMasq();
global.API = new Api();
