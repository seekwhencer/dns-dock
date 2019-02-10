#!/bin/sh
sudo apt-get update
sudo apt-get install dnsmasq -y
sudo systemctl stop dnsmasq
sudo systemctl disable dnsmasq
sudo mkdir -p /etc/default
sudo ls -s /app/dnsmasq/default /etc/default/dnsmasq
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.default
