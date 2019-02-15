module.exports = {
    bin: '/usr/local/bin/pihole',
    auto_log: false,
    config_dir: '/etc/dnsmasq.d',
    config_prefix: '1000-',
    config_file: '/etc/dnsmasq.d/01-pihole.conf',

    config: {
        'addn-hosts': [
            '/etc/pihole/gravity.list',
            '/etc/pihole/black.list',
            '/etc/pihole/local.list'
        ],
        'localise-queries': true,
        'no-resolv': true,
        'cache-size': 10000,
        'log-queries': true,
        'log-facility': '/var/log/pihole.log',
        'local-ttl': 2,
        'log-async': true,

        'server': [
            '192.168.178.1',
            '8.8.8.8',
            '8.8.4.4',
            '192.168.178.28'
        ],
        'conf-dir': false,
        'interface': 'eth0'
    }
};