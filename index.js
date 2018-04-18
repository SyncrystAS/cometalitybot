const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {

	if(err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}

	jsfile.forEach((f, i) =>{
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		bot.commands.set(props.help.name, props);
	})
})

bot.on("ready", async () => {
	let prefix = botconfig.prefix;
	console.log(`${bot.user.username} is online! Currently in ${bot.guilds.size} servers!`);
	bot.user.setActivity(`antimonyrp.com | In ${bot.guilds.size} servers`, {type: "Watching"});
	bot.user.setStatus("dnd");
});

bot.on("message", async message => {
  if(message.author.bot) return;
  ////////////////////////////////////////////////////////////////
  if(message.channel.type === "dm"){

	let serverembed = new Discord.RichEmbed()
    .setDescription("Cometality - Syncryst")
    .setColor("#c10000")
    .addField("NOTE", "You can't use bot commands in dms. Use them in a server instead.")
    .addField("Website", "http://antimonyrp.com")
    .addField("Discord", "https://discord.gg/rcSjxDT")
    .addField("NinjaSwiper", "http://antimonyrp.com/ninjaswiper")
    .addField("Remains", "http://antimonyrp.com");

    return message.channel.send(serverembed);
  }
  ////////////////////////////////////////////////////////////////

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});
////////////////////////////////////////////////////////////////

bot.login(process.env.BOT_TOKEN);
