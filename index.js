const
    DnsMasq = require('./lib/dnsmasq'),
    Api = require('./lib/api');

require('./lib/globals');

global.DNSMASQ = new DnsMasq();
global.API = new Api();
