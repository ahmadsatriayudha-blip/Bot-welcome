// index.js — Welcome & Goodbye Bot
const { Client, GatewayIntentBits } = require('discord.js');
const { sendWelcome, sendGoodbye } = require('./welcome');

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ]
});

client.once('ready', () => {
  console.log(`✅ Welcome Bot online: ${client.user.tag}`);
});

client.on('guildMemberAdd',    member => sendWelcome(member));
client.on('guildMemberRemove', member => sendGoodbye(member));

client.login(TOKEN);
