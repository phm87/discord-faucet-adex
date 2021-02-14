const cron = require('node-cron');
const Discord = require("discord.js");
const config = require("./config.json");
var WAValidator = require('wallet-address-validator');

const client = new Discord.Client();

const prefix = "!";
var addrs = [];
var inlist = false;

// var dataString2= ["{\"method\":\"withdraw\",\"coin\":\"MORTY\",\"to\":\"", "\",\"amount\":\"0.1\",\"userpass\":\"RPC_PASSWORD\"}"];

var request = require('request');
class PostRequest {
  constructor(body) {
//    this.action() = action;
    this.options = {
      url: 'http://127.0.0.1:7783',
      method: 'POST',
      body: body // '' // dataString2[0]+item[0]+dataString2[1]
    };
  }
  call(action, returned) {
//    console.log("call");
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
//        console.log("callbacked status 200 OK");
//        console.log(body);
        returned = action(error, response, body);
      }
      else if (!error && response.statusCode != 200) {
        console.log(response.statusCode);
      }
      else if (error && response.statusCode != 200) {
        console.log(error);
      }
      else {
        console.log("KO");
      }
    }
    request(this.options, callback);
  }
}

client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }

  else if (command === "help") {
    message.reply("TipBot using lightwallet multi currencies\n"+
      "This TipBot can be used with the following commands:\n"+
      "- ``"+prefix+"help`` displays this help page\n"+
      "- ``"+prefix+"faucet.set <Currency> <Address>`` allows to set your deposit address, it must be used in Direct Message (DM) to the bot\n"+
      "- ``"+prefix+"faucet`` to enter the line in the faucet (all currencies), you can repeat the !faucet command once per day.\n"+
      "\n"+
      "This discord bot faucet is using AtomicDEX as multi cryptocurrency lightwallet in the back-end.");
  }

  else if (command == "faucet") {
    var found = false;
    addrs.forEach(function(item, index, array) {
      if(item[3].sender === message.sender) {
        message.reply("Conditions to apply ...");
        if (item[2] == "PAID" && item[1] < Date.now() - 2 * 60 * 1000) {
          item[2] = "NOTPAID";
          message.reply("Thank you, the faucet will send you coins in a minute.");
        }
        else if (item[2] == "PAID" && item[1] >= Date.now() - 2 * 60 * 1000) {
          // item[2] = "PAID";
          message.reply("Please wait " + (Date.Now - item[1]) + " before executing again the "+prefix+"faucet command again. Thank you.");
        }
        else if (item[2] == "NOTPAID") {
          // item[2] = "PAID";
          message.reply("you don't need to execute the "+prefix+"faucet command again, please wait that payment occurs. Thank you.");
        }
        found = true;
      }
    });
    if (found == false) {
      message.reply("Please use the "+prefix+"faucet.set command in DM to the bot to set your deposit address then use the "+prefix+"faucet command.");
    }
  }
  else if (command == "faucet.set") {
// TODO: Add condition to avoid several address per discord id
    if (message.channel.type === 'dm') {
        var valid = WAValidator.validate(args[0], 'KMD');
        if (valid) {
            message.reply("KMD Address OK");
            addrs.forEach(function(item, index, array) {
              inlist = false;
              if (item[0] == args[0] && item[2] == "NOTPAID") {
                message.reply("Your address is already in the list, not yet paid, you don't need to execute again the "+prefix+"faucet.set command.");
                inlist = true;
                }
              else if (item[0] == args[0] && item[2] == "PAID") {
                message.reply("Your address is already in the list, already paid, you don't need to execute again the "+prefix+"faucet.set command.");
                inlist = true;
                }
            });
            if (inlist == false) {
                addrs.push([args[0], Date.now(), 'NOTPAID', message]);
                message.reply("Your address has been added to the list, it should be paid in few minutes. In 24 hours, please execute the "+prefix+"faucet command to receive coins again.");
//          message.reply("Should be added in the list");
                }
        }
        else {
            message.reply("Not valid KMD address, please try a correct KMD address.");
        }
    }
    else {
      message.reply("Please use the "+prefix+"faucet.set command only in direct message (DM) to the bot for privacy.");
    }
 }
});


var balance = 0;
var balance_ok = false;
cron.schedule('5 * * * * *', () => {
  console.log('running a task every minute at the 5th second');
  var balance_ok = false;
  addrs.forEach(function(item, index, array) {
    console.log(item[1]+"\n");
    console.log(Date.now() + "\n");
    if (item[2] == "NOTPAID" && item[1] < Date.now() - 2 * 60 * 1000 ) {
      console.log("test : withdraw "+item[0]);
      var req_withdraw = new PostRequest("{\"method\":\"withdraw\",\"coin\":\"MORTY\",\"to\":\""+item[0]+"\",\"amount\":\"0.01\",\"userpass\":\"RPC_PASSWORD$
      var w = req_withdraw.call(function(error, response, body) {
        console.log(JSON.parse(body).tx_hex);
        console.log("1 withdraw OK\n");
        var req_send = new PostRequest(
          "{\"method\":\"send_raw_transaction\",\"coin\":\"MORTY\",\"tx_hex\":\""+JSON.parse(body).tx_hex+"\",\"userpass\":\"RPC_PASSWORD\"}");
        var s = req_send.call(function(error2, response2, body2) {
          console.log(JSON.parse(body2));
          console.log("2\n");
          console.log("Ok, payment sent "+JSON.parse(body).tx_hash);
          item[3].reply("MORTY coins sent, tx:\nhttps://morty.explorer.dexstats.info/tx/"+JSON.parse(body).tx_hash);
          item[2] = "PAID";
          item[1] = Date.now();
        });
      });
    }
  });
});

var req_balance = new PostRequest('{"userpass":"RPC_PASSWORD","method":"my_balance","coin":"MORTY"}');
console.log("xx");
if (req_balance.call(function(error, response, body) {
//        console.log("begin action");
        console.log(JSON.parse(body).balance);
        return JSON.parse(body).balance;
        }) > 0 ) {
          balance_ok = true;
        }

client.login(config.BOT_TOKEN);

