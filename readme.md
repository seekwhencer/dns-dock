# dns-dock
simple dns management for your local area network per web api and dnsmasq.
this app creates config files for dnsmasq, starts and stops dnsmasq with a new config.
you can feed dnsmasq via web api and some endpoints:

- /address
- /address/add
- /address/delete
- /restart

> to test and use it, try [Insomnia](https://insomnia.rest/)

### Endpoints

- List all existing addresses
> http://ip_of_your_pi:9000/address

Here you get a json with an id hash for any address. use this hash (id) to remove the address.

- Add a address
> http://ip_of_your_pi:9000/address/add

> With post parameters: `source` and `target`

`target` should be the ip address of your reverse proxy
 
`source` is the named host

- Remove a address
> http://ip_of_your_pi:9000/address/delete/`id`

`id` is a hash, get em from the index listing

### Installation

- make a fresh clean raspberry pi (no desktop, passwort for root, update, upgrade)
- install node with n:
```
curl -L https://git.io/n-install | N_PREFIX=/n bash -s
```
- clone this repo to your pi:
``` 
cd /
sudo git clone ... app
sudo chown pi:root -R /app
cd /app
npm install
``` 
- install pm2
```
npm install pm2 -g
```
- edit root .bashrc
```
sudo su
nano /root/.bashrc
```
- add this
```
export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"
export PATH=$PATH:/home/pi/n/bin
```
- exit and relogin
```
exit
sudo su
```
- autostart the app with pm2
```
sudo su
ln -s /home/pi/n /root/n
cd /app
pm2 start "npm start dev"
pm2 save
```
- edit service
```
sudo su
mv /etc/systemd/system/pm2-pi-service /etc/systemd/system/pm2-root-service
nano /etc/systemd/system/pm2-root-service
systemctl enable pm2-root.service
systectl start pm2-root.service

```
- use this
```
[Unit]
Description=PM2 process manager
Documentation=https://pm2.keymetrics.io/
#After=network.target
 
[Service]
Type=forking
User=root
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/root/n/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=PM2_HOME=/root/.pm2
PIDFile=/root/.pm2/pm2.pid
 
ExecStart=/root/n/lib/node_modules/pm2/bin/pm2 resurrect
ExecReload=/root/n/lib/node_modules/pm2/bin/pm2 reload all
ExecStop=/root/n/lib/node_modules/pm2/bin/pm2 kill
 
[Install]
WantedBy=multi-user.target

```

- reboot and test it
```
reboot
```

## Configuration

Configuration files for the node app are stored in `config/`. All files will be autoloaded by the app and
registered as global `CONFIG.filename` object.
 
Run different configurations with: `npm run dev` or `npm run prod`. 

## Reverse Proxy
In my case, i'm working with a second compouter only for the docker stuff.
On the docker machine i'm using [nginx-proxy](https://github.com/jwilder/nginx-proxy) in a container as a reverse proxy.
But this computer is not the dns server. In this case: the raspberry pi does the job very well.
The reason for this setup is simple: with my home router called ["fritte"](https://avm.de/produkte/fritzbox/fritzbox-7560/) i can't set two
dns servers for the lan clients. if the dns machine is off, the dns in your lan is broken. that is bad.
if you set a own dns - the dns computer must be always on! the power consumption of a pi is okay - equal to a fat docker runner.
and you can use this piece of software together with [pihole](https://github.com/pi-hole/pi-hole)

##Insomnia
Use the `dns-dock_insomnia.har` with [Insomnia](https://insomnia.rest/) and change the environment `base_url`

## Security

> god beware - that piece of software is absolutely not for production or any public or half-public projects.

> All endpoints are reachable from your local area network

> The caller hits directly the app