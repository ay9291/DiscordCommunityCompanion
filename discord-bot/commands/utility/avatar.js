
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Display user avatar',
  usage: '[@user]',
  category: 'utility',
  aliases: ['av', 'pfp'],
  cooldown: 3,
  async execute(message, args, client) {
    const user = message.mentions.users.first() || 
                 message.guild.members.cache.get(args[0])?.user || 
                 message.author;

    const embed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: 'Download', value: `[PNG](${user.displayAvatarURL({ extension: 'png', size: 1024 })}) | [JPG](${user.displayAvatarURL({ extension: 'jpg', size: 1024 })}) | [WEBP](${user.displayAvatarURL({ extension: 'webp', size: 1024 })})` }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
