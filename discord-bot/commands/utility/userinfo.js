
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Get detailed user information',
  usage: '[@user]',
  category: 'utility',
  aliases: ['ui', 'user'],
  cooldown: 3,
  async execute(message, args, client) {
    const user = message.mentions.users.first() || 
                 message.guild.members.cache.get(args[0])?.user || 
                 message.author;
    
    const member = message.guild.members.cache.get(user.id);
    
    if (!member) {
      return message.reply('❌ User not found in this server.');
    }

    const roles = member.roles.cache
      .filter(role => role.id !== message.guild.id)
      .map(role => role.toString())
      .slice(0, 10);

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || '#7289da')
      .setTitle(`User Information - ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Username', value: user.username, inline: true },
        { name: 'Discriminator', value: user.discriminator, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        { name: 'Highest Role', value: member.roles.highest.toString(), inline: true },
        { name: 'Roles Count', value: roles.length.toString(), inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true }
      )
      .setTimestamp();

    if (roles.length > 0) {
      embed.addFields({ name: 'Roles', value: roles.join(', '), inline: false });
    }

    message.reply({ embeds: [embed] });
  }
};
