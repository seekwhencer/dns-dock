module.exports = {
    bin: '/usr/sbin/dnsmasq',
    autostart: true,
    restart_delay: 0,
    config_file: '/app/dnsmasq/dnsmasq.conf',
    config_dir: '/app/dnsmasq/config',
    lease_file: '/app/dnsmasq/leases',

    config: {
        'log-queries': true,
        'strict-order': true,
        'expand-hosts': true,

        'no-resolv': true,
        'no-hosts': false,
        'domain-needed': false,
        'bogus-priv': false,

        'server': [
            '192.168.178.1',
            '8.8.8.8',
            '/dnsdock/192.168.178.28'
        ],
        'local': '/dnsdock/',
        'conf-dir': false,
        'dhcp-leasefile': false
    }
};