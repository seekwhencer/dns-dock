```
sudo apt-get update
sudp apt-get install dnsmasq -y
sudo systemctl disable dnsmasq
sudo systemctl stop dnsmasq
sudo mkdir -p /etc/default
sudo ls -s /app/dnsmasq/default /etc/default/dnsmasq
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.default
```