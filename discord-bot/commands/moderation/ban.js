const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server',
  aliases: ['b', 'banish'],
  usage: '!ban @user [reason]',
  cooldown: 5,
  permissions: [PermissionsBitField.Flags.BanMembers],
  async execute(message, args, client) {
    const target = message.mentions.users.first() || client.users.cache.get(args[0]);
    
    if (!target) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ User Required')
        .setDescription('Please mention a user or provide a user ID to ban.')
        .addFields({ name: 'Usage', value: '`!ban @user [reason]`' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const member = message.guild.members.cache.get(target.id);
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    // Check if user can be banned
    if (member) {
      if (member.id === message.author.id) {
        return message.reply('❌ You cannot ban yourself!');
      }
      
      if (member.id === client.user.id) {
        return message.reply('❌ I cannot ban myself!');
      }
      
      if (member.roles.highest.position >= message.member.roles.highest.position) {
        return message.reply('❌ You cannot ban someone with equal or higher roles!');
      }
      
      if (!member.bannable) {
        return message.reply('❌ I cannot ban this user! Check my permissions and role hierarchy.');
      }
    }
    
    try {
      // Try to DM user before ban
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('🔨 You have been banned')
          .setDescription(`You have been banned from **${message.guild.name}**`)
          .addFields([
            { name: 'Reason', value: reason, inline: true },
            { name: 'Banned by', value: message.author.tag, inline: true },
          ])
          .setTimestamp();
        
        await target.send({ embeds: [dmEmbed] });
      } catch (error) {
        console.log(`Could not DM ${target.tag} about their ban.`);
      }
      
      // Ban the user
      await message.guild.members.ban(target, { reason: reason });
      
      // Success embed
      const successEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('🔨 User Banned')
        .setDescription(`Successfully banned **${target.tag}**`)
        .addFields([
          { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
          { name: 'Moderator', value: message.author.tag, inline: true },
          { name: 'Reason', value: reason, inline: false },
        ])
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      
      message.reply({ embeds: [successEmbed] });
      
      // Log to mod-log channel
      const logChannel = message.guild.channels.cache.find(c => 
        c.name === 'mod-logs' || c.name === 'moderation-logs' || c.name === 'logs'
      );
      
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('🔨 Member Banned')
          .addFields([
            { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
            { name: 'Moderator', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: 'Channel', value: message.channel.toString(), inline: true },
            { name: 'Reason', value: reason, inline: false },
          ])
          .setThumbnail(target.displayAvatarURL({ dynamic: true }))
          .setTimestamp();
        
        logChannel.send({ embeds: [logEmbed] });
      }
      
    } catch (error) {
      console.error('Error banning user:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Ban Failed')
        .setDescription('Failed to ban the user. Please check my permissions.')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};