
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Timeout a user',
  usage: '<user> [duration] [reason]',
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

    if (!client.utils.permissions.canModerate(message.member, member)) {
      return message.reply('❌ You cannot moderate this user.');
    }

    const duration = args[1] || '10m';
    const reason = args.slice(2).join(' ') || 'No reason provided';
    
    let ms = 0;
    if (duration.includes('s')) ms = parseInt(duration) * 1000;
    else if (duration.includes('m')) ms = parseInt(duration) * 60000;
    else if (duration.includes('h')) ms = parseInt(duration) * 3600000;
    else if (duration.includes('d')) ms = parseInt(duration) * 86400000;
    else ms = 600000; // 10 minutes default

    try {
      await member.timeout(ms, reason);
      
      const embed = new EmbedBuilder()
        .setColor('#ffa500')
        .setTitle('🔇 User Muted')
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
          { name: 'Duration', value: duration, inline: true },
          { name: 'Moderator', value: message.author.tag, inline: true },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Failed to mute user: ' + error.message);
    }
  }
};
