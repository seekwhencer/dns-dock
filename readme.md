# dns-dock
simple registering of names inside your local area network.

### endpoints

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

### installation:

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
mv /etc/systemd/system/pm2-pi-service /etc/systemd/system/pm2-root-service
nano /etc/systemd/system/pm2-root-service
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

