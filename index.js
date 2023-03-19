const { Client, GatewayIntentBits } = require('discord.js')
const dotenv = require("dotenv")
const httpClient = require('./http-client.js');

dotenv.config()

const prefix = "gpt"

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
})

client.on("messageCreate", async msg => {
  if(!msg.content.startsWith(prefix) || msg.author.bot) return
  msg.channel.sendTyping()
  try {
    const args = msg.content.slice(prefix.length).split(/ +/)
    const command = args.join(" ").toLowerCase()

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
          { "role": "user", "content": command }
      ],
      temperature: 0.7
  };

    const chatGpt = await httpClient.post("", data)

    if (msg.content) {
      msg.reply({ content: chatGpt.choices[0].message.content, ephemeral: true });
    }
  } catch (err) {
    console.log(err);
    if (msg.content) {
      msg.reply({ content: 'ChatGpt is sleeping', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN)

module.exports = client