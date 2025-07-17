
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'slowmode',
  description: 'Set channel slowmode',
  usage: '<seconds>',
  category: 'moderation',
  aliases: ['slow'],
  permissions: ['ManageChannels'],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('❌ You need **Manage Channels** permission to use this command.');
    }

    const seconds = parseInt(args[0]);
    
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply('❌ Please provide a valid number between 0 and 21600 seconds (6 hours).');
    }

    try {
      await message.channel.setRateLimitPerUser(seconds);
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('⏱️ Slowmode Updated')
        .setDescription(seconds === 0 ? 'Slowmode has been disabled.' : `Slowmode set to **${seconds}** seconds.`)
        .addFields(
          { name: 'Channel', value: message.channel.toString(), inline: true },
          { name: 'Moderator', value: message.author.tag, inline: true },
          { name: 'Duration', value: seconds === 0 ? 'Disabled' : `${seconds} seconds`, inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Failed to set slowmode: ' + error.message);
    }
  }
};
