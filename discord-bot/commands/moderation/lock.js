
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Lock a channel',
  usage: '[channel]',
  category: 'moderation',
  permissions: ['ManageChannels'],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ You need **Manage Channels** permission to use this command.');
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false
      });

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔒 Channel Locked')
        .setDescription(`${channel} has been locked.`)
        .addFields(
          { name: 'Moderator', value: message.author.tag, inline: true },
          { name: 'Channel', value: channel.toString(), inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Failed to lock channel: ' + error.message);
    }
  }
};
