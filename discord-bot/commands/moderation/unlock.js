
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unlock',
  description: 'Unlock a channel',
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
        SendMessages: null
      });

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🔓 Channel Unlocked')
        .setDescription(`${channel} has been unlocked.`)
        .addFields(
          { name: 'Moderator', value: message.author.tag, inline: true },
          { name: 'Channel', value: channel.toString(), inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Failed to unlock channel: ' + error.message);
    }
  }
};
