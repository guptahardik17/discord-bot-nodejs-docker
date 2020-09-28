const { googleSearchResults, localHistorySearchResults } = require("./search");

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    console.log(msg.author, msg.content);
    if (msg.content === 'hi') {
        msg.reply('hey');
    }

    if(msg.content.slice(0, 5) === '!help'){
        msg.reply(["Currently Supported Interactions:", "hi - to get reply", "!help - gives all the available interactions", "!google [anything] - gives top 5 google results link", "!recent [anything] - gives matched searches from your google search"])
    }
    
    if(msg.content.slice(0, 7) === '!google'){
        msg.reply(await googleSearchResults(msg.author.id, msg.content.slice(8).trim()))
    }

    if(msg.content.slice(0, 7) === '!recent'){
        msg.reply(await localHistorySearchResults(msg.author.id, msg.content.slice(8).trim()))
    }
});

client.login(process.env.DISCORD_API_KEY);