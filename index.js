const Discord = require('discord.js');
const pm = require('pretty-ms');
const client = new Discord.Client();
const {
    prefix,
    joinAgeChannel,
    modRoleName,
    defaultKickTime,
    embedColorHex,
    embedColorHexBot,
    token,
} = require('./config.json');
var kicktime = defaultKickTime;
var infoenabled = true;

function kickFunc(member, agems) {
    member.kick(`Recorded account age < ${kicktime} day(s). (${pm(agems, { verbose: true })})`);
    console.log(`${member.user.tag} has been kicked for account age violation. (${pm(agems, { verbose: true })})`);
    return;
}
function noPerms(msg, cmd){
    msg.reply(`You do not have permissions to use "${cmd}"`);
    console.log(`${msg.author.tag} tried using "${cmd}" but had insufficient permissions.`)
    return;
}
function embed(member, age, ch) {
    const embed = new Discord.MessageEmbed()
        .setColor(embedColorHex)
        .setTitle(member.user.tag)
        .setAuthor('FM Security', "https://media.discordapp.net/attachments/680182797339590659/729615114164240384/Factorio_Mods.png?width=677&height=677")
        .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
        .addFields(
            { name: 'Account age', value: `${pm(age, { verbose: true })}` },
            { name: 'ID', value: member.user.id },
        )
        .setTimestamp()
        .setFooter('Automated message from FM Security');
    ch.send(embed);
    return;
}
function embedBot(member, age, ch) {
    const embed = new Discord.MessageEmbed()
        .setColor(embedColorHexBot)
        .setTitle(member.user.tag)
        .setAuthor('FM Security', "https://media.discordapp.net/attachments/680182797339590659/729615114164240384/Factorio_Mods.png?width=677&height=677")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription('**BOT**')
        .addFields(
            { name: 'Account age', value: `${pm(age, { verbose: true })}` },
            { name: 'ID', value: member.user.id },
        )
        .setTimestamp()
        .setFooter('Automated message from FM Security');
    ch.send(embed);
    return;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`)
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(`${message.createdAt} ---- ${message.author.tag} issued command: "${command}" with args: ${args}`);
    if (command === 'kicktime') {
        if (message.member.roles.cache.some(role => role.name === modRoleName)) {
            if (!args.length) {
                message.reply(`current minimum account age is: ${kicktime} day(s).`)
            } else {
                kicktime = args[0];
                console.log(`Minimum account age has been set to: ${kicktime} day(s).`);
                message.reply(`minimum account age has been set to: ${kicktime} day(s).`);
            }
        } else {
            noPerms(message, command);
        }
    }
    if (command === 'toggleinfo') {
        if (message.member.roles.cache.some(role => role.name === modRoleName)) {
            infoenabled = ! infoenabled;
            message.reply(`info on join is now: ${infoenabled}.`);
            console.log(`Info on join is now: ${infoenabled}.`);
        } else {
            noPerms(message, command);
        }
    }
    if (command === 'info') {
        if (!args.length) {
            const age = Date.now() - message.author.createdTimestamp;
            embed(message.member, age, message.channel);
        } else {
            const taggedUser = message.mentions.users.first();
            if (taggedUser) {
                const taggedMember = message.guild.member(taggedUser);
                const age = Date.now() - taggedUser.createdTimestamp;
                embed(taggedMember, age, message.channel)
            } else {
                message.reply('no valid user was mentioned.')
            }
        }
    }
    if (command === 'help') {
        let infochannel = message.channel
        const embed = new Discord.MessageEmbed()
            .setColor(embedColorHex)
            .setTitle("Help")
            .setAuthor('FM Security', "https://media.discordapp.net/attachments/680182797339590659/729615114164240384/Factorio_Mods.png?width=677&height=677")
            .addFields(
                { name: `${prefix}info`, value: "Lists information about users. Usage: ```info [member]```If no member is given it will default to the author of the message." },
                { name: `${prefix}help`, value: "This command" },
            )
            .setTimestamp()
            .setFooter('Automated message from FM Security');
        infochannel.send(embed)
    }
});

client.on('guildMemberAdd', member => {
    if (!infoenabled) return console.log(`${member.joinedAt} -==- ${member.user.tag} joined but info is disabled.`);
    console.log(`${member.joinedAt} -==- ${member.user.tag} joined the server.`);
    const joinmsgch = member.guild.channels.cache.find(ch => ch.name === joinAgeChannel);
    const age = Date.now() - member.user.createdTimestamp;
    if (member.user.bot) {
        embedBot(member, age, joinmsgch);
    } else {
        embed(member, age, joinmsgch);
    }
    if (age < 1000 * 60 * 60 * 24 * kicktime){
        kickFunc(member, age);
        joinmsgch.send(`${member.user.tag} has been kicked.`);
    }
});

client.login(token);