const cron = require('node-cron');
//import * as cron from 'node-cron'
const Discord = require("discord.js");
const config = require("./config.json");
//const crypto = require("@polkadot/util-crypto");
var WAValidator = require('wallet-address-validator');

const client = new Discord.Client();

const prefix = "!";
var addrs = [];
var inlist = false;

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
      "- ``!help`` displays this help page\n"+
      "- ``!faucet.set <Currency> <Address>`` allows to set your deposit address, it must be used in Direct Message (DM) to the bot\n"+
      "- ``!faucet`` to enter the line in the faucet (all currencies)"+
      "- ``xx`` "+
      "- ``yy`` "+
      "TODO help message<br />a\nb");
  }
  else if (command == "faucet") {
    // TODO: Retrieve discord ID !
    var found = false;
    addrs.forEach(function(item, index, array) {
      if(item[3].sender === message.sender) {
      message.reply("Conditions to apply ...");
      found = true;
      }
    });
    if (found == false) {
      message.reply("Please use the !faucet.set command in DM to the bot to set your deposit address then use the faucet command.");
    }
  }
  else if (command == "faucet.set") {
    if (message.channel.type === 'dm') {
        var valid = WAValidator.validate(args[0], 'KMD');
        if (valid) {
            message.reply("KMD Address OK");
            addrs.forEach(function(item, index, array) {
              inlist = false;
              if (item[0] == args[0] && item[2] == "NOTPAID") {
                message.reply("Already in the list, not yet paid");
                inlist = true;
                }
              else if (item[0] == args[0] && item[2] == "PAID") {
                message.reply("Already in the list, already paid");
                inlist = true;
                }
            });
            if (inlist == false) {
                addrs.push([args[0], Date.now(), 'NOTPAID', message]);
                message.reply("Added to the list !!!");
//          message.reply("Should be added in the list");
                }
        }
        else {
            message.reply("Not valid KMD address, please try a correct KMD address.");
        }
    }
    else {
      message.reply("Please use the faucetset command only in direct message to the bot for privacy.")
    }
 }
});

cron.schedule('5 * * * * *', () => {
  console.log('running a task every minute at the 5th second');
  addrs.forEach(function(item, index, array) {
    if (item[2] == "NOTPAID") {
      item[2] = "PAID";
      item[3].reply("Payment occurs for your address ...");
      }
  });
});

client.login(config.BOT_TOKEN);
