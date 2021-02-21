PROJECT UNDER DEVELOPMENT, PLEASE DO NOT USE YET !!!

# discord-faucet-adex
Multicurrency faucet discord bot using AtomicDex-API as multi cryptocurrency lightwallet.

AtomicDEX-API can be used as a DEX (based on atomic swaps) and as a lightwallet for multi cryptocurrencies. It is using electrums and explorers to be able to broadcast transaction and retrieve needed information from blockchain.

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
cd target/debug
```
The RPC password will be used by different bash files so we can define it in userpass file
```bash
nano userpass
```
with the following content
```bash
export userpass="RPC_PASSWORD"
```
Using your chose RPC password and passphrase (seed), create a file to start AtomicDEX-API/mm2:
```bash
nano start_mm2.sh
```
with the following content
```bash
source userpass
stdbuf -oL ./mm2 "{\"gui\":\"MM2GUI\",\"netid\":9999, \"userhome\":\"/${HOME#"/"}\", \"passphrase\":\"YOUR_PASSPHRASE_HERE\", \"rpc_password\":\"$userpass\"}" &
```
Create another file to activate the coins of your choice (RICK and MORTY in our example)
```bash
nano connect_coins.sh
```
with the following content
```bash
source userpass
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"RICK\",\"servers\":[{\"url\":\"electrum1.cipig.net:10017\"},{\"url\":\"electrum2.cipig.net:10017\"},{\"url\":\"electrum3.cipig.net:10017\"}]}"
curl --url "http://127.0.0.1:7783" --data "{\"userpass\":\"$userpass\",\"method\":\"electrum\",\"coin\":\"MORTY\",\"servers\":[{\"url\":\"electrum1.cipig.net:10018\"},{\"url\":\"electrum2.cipig.net:10018\"},{\"url\":\"electrum3.cipig.net:10018\"}]}"
```
Make all bash files executable
```bash
chmod +x start_mm2.sh connect_coins.sh
```

Detailled official instruction are available at ###



## How to launch
1. Launch AtomicDEX-API/mm2
```bash
cd ~
cd atomicDEX-API/target/debug
./start_mm2.sh
```

2. Wait few seconds then activate the chosen coins and connect to their electrums or explorers
```bash
./connect_coins.sh
```
Copy and paste elsewhere (in notepad as example) the "address" in the json output.

3. In a screen, launch the faucet nodejs server
```bash
screen -S faucet
cd ~
cd discord-faucet-adex
node index.js
```
To quit the screen without killing it, press Ctrl, A, D
To recall the screen, ``screen -r faucet``

4. Fund the address displayed at step 2. For RICK and MORTY smartchains, you can grab few testcoins at:
https://www.atomicexplorer.com/#/faucet/rick

https://www.atomicexplorer.com/#/faucet/morty

5. Invite the bot to your discord server: @@

## How to operate
As operator, you should make sure that the mm2 instance is properly running, the all chosen coins are activated and that their electrums or explorers are online.

See details availble in the official instructions to run the scripts in nohup or another tool to make sure that it is relaunched if it stops.

### Troubleshooting
```bash
node index.js
xx
{ Error: connect ECONNREFUSED 127.0.0.1:7783
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1107:14)
  errno: 'ECONNREFUSED',
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 7783 }
```
Please launch AtomicDEX-API/mm2 before launching the nodejs faucet.
```bash
cd ~/atomicDEX-API/target/debug
./start_mm2.sh
./connect_electrums.sh
```

## How to use
After the faucet setup, please execute the command ``!help`` and read the instructions.

## Credits
- AtomicDEX Dev Team for AtomicDex-API https://github.com/KomodoPlatform/atomicDEX-API
- https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-fr
