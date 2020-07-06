const Discord = require('discord.js');
const pm = require('pretty-ms');
const botConfig = require("./botConfig.json");
const client = new Discord.Client();

const modrole = botConfig.togglerole;
const messagechannel = botConfig.channel
var enabled = true;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

client.on("message", message => {
    if (message.content.startsWith(botConfig.prefix)) {
        console.log(message.author.tag + " called " + message.content + " @ " + message.createdAt)
        var cmd = message.content.substr(1)
        if (cmd.startsWith("myinfo")) {
            let infochannel = message.channel
            let now = Date.now();
            let createdAt = message.author.createdTimestamp;
            let age = now - createdAt;
            const embed = new Discord.MessageEmbed()
            .setColor('#9d4d27')
            .setTitle(message.author.tag)
            .setAuthor('FM Security', "https://media.discordapp.net/attachments/680182797339590659/729615114164240384/Factorio_Mods.png?width=677&height=677")
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                { name: 'Account age', value: `${pm(age, {verbose: true})}` },
                { name: 'ID', value: message.author.id},
            )
            .setTimestamp()
            .setFooter('Automated message from FM Security');
            infochannel.send(embed)
        }
        if (cmd.startsWith("help")) {
            let infochannel = message.channel
            const embed = new Discord.MessageEmbed()
                .setColor('#9d4d27')
                .setTitle("Help")
                .setAuthor('FM Security', "https://media.discordapp.net/attachments/680182797339590659/729615114164240384/Factorio_Mods.png?width=677&height=677")
                .addFields(
                    { name: '$myinfo', value: "Lists information about the person that called it" },
                    { name: '$help', value: "This command" },
                )
                .setTimestamp()
                .setFooter('Automated message from FM Security');
            infochannel.send(embed)
        }
        if (message.member._roles.includes(modrole)) {
            if (cmd == "toggle"){
                enabled = ! enabled;
                message.reply("joininfo is now: " + enabled)
            }
        }
    }
});

client.on("guildMemberAdd", member => {
    console.log(member.user.tag + " just joined the server @ " + member.joinedAt)
    if (enabled == true) {
        const infochannel = member.guild.channels.cache.find(ch => ch.name === messagechannel);
        let now = Date.now();
        let createdAt = member.user.createdTimestamp;
        let age = now - createdAt;
        const embed = new Discord.MessageEmbed()
        .setColor('#9d4d27')
        .setTitle(member.user.tag)
        .setAuthor('FM Security', "https://media.discordapp.net/attachments/680182797339590659/729615114164240384/Factorio_Mods.png?width=677&height=677")
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: 'Account age', value: `${pm(age, {verbose: true})}` },
            { name: 'ID', value: member.user.id},
        )
        .setTimestamp()
        .setFooter('Automated message from FM Security');
        infochannel.send(embed)
    } else {
        console.log("Member joined but info is disabled.")
    }
});

client.login(process.env.token);