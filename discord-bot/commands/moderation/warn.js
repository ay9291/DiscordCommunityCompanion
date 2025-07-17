
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Warn a user',
  usage: '<user> <reason>',
  category: 'moderation',
  permissions: ['ManageMessages'],
  cooldown: 3,
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('❌ You need **Manage Messages** permission to use this command.');
    }

    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
    if (!user) return message.reply('❌ Please mention a valid user.');

    const reason = args.slice(1).join(' ');
    if (!reason) return message.reply('❌ Please provide a reason for the warning.');

    const member = message.guild.members.cache.get(user.id);
    if (!client.utils.permissions.canModerate(message.member, member)) {
      return message.reply('❌ You cannot warn this user.');
    }

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setTitle('⚠️ User Warned')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Moderator', value: message.author.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });

    try {
      const dmEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('⚠️ You have been warned')
        .addFields(
          { name: 'Server', value: message.guild.name },
          { name: 'Moderator', value: message.author.tag },
          { name: 'Reason', value: reason }
        );
      
      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      // User has DMs disabled
    }
  }
};
