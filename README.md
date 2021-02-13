PROJECT UNDER DEVELOPMENT, PLEASE DO NOT USE YET !!!

# discord-faucet-adex
Multicurrency faucet discord bot using AtomicDex as multi cryptocurrency lightwallet

## How to install
1. Install nodejs
```bash
cd ~
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs
```
2. Git clone this repository
```bash
git clone https://github.com/phm87/discord-faucet-adex
cd discord-faucet-adex
```

3. Install required packages
```bash
npm install discord.js
npm install --save node-cron
```

4. Create a (discord account if you don't have one), a new discord application and a new discord bot

TODO

5. Install AtomicDEX (to be used as multi currency mightwallet)
```bash
sudo apt update
sudo apt install build-essential snapd
sudo snap install rustup --classic
rustup install nightly-2020-10-25
rustup default nightly-2020-10-25
rustup component add rustfmt-preview
git clone https://github.com/KomodoPlatform/atomicDEX-API
cd atomicDEX-API
cargo build --features native
```

## How to use
TO DO

## Credits
- AtomicDex
- https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-fr
