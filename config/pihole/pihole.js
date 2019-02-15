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

        'strict-order': true,
        'server': [
            '/dnsdock/192.168.178.28',
            '8.8.8.8',
            '8.8.4.4',
            '/fritz.box/192.168.178.1'
        ],
        'conf-dir': false,
        'interface': 'eth0'
    }
};