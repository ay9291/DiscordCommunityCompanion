
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Remove timeout from a user',
  usage: '<user> [reason]',
  category: 'moderation',
  permissions: ['ModerateMembers'],
  cooldown: 3,
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('❌ You need **Timeout Members** permission to use this command.');
    }

    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
    if (!user) return message.reply('❌ Please mention a valid user.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ User not found in this server.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await member.timeout(null, reason);
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🔊 User Unmuted')
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
          { name: 'Moderator', value: message.author.tag, inline: true },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Failed to unmute user: ' + error.message);
    }
  }
};
