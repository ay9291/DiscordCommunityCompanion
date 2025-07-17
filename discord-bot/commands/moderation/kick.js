const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  aliases: ['k'],
  usage: '!kick @user [reason]',
  cooldown: 5,
  permissions: [PermissionsBitField.Flags.KickMembers],
  async execute(message, args, client) {
    const target = message.mentions.users.first();
    
    if (!target) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ User Required')
        .setDescription('Please mention a user to kick.')
        .addFields({ name: 'Usage', value: '`!kick @user [reason]`' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const member = message.guild.members.cache.get(target.id);
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    if (!member) {
      return message.reply('❌ That user is not in this server!');
    }
    
    if (member.id === message.author.id) {
      return message.reply('❌ You cannot kick yourself!');
    }
    
    if (member.id === client.user.id) {
      return message.reply('❌ I cannot kick myself!');
    }
    
    if (member.roles.highest.position >= message.member.roles.highest.position) {
      return message.reply('❌ You cannot kick someone with equal or higher roles!');
    }
    
    if (!member.kickable) {
      return message.reply('❌ I cannot kick this user! Check my permissions and role hierarchy.');
    }
    
    try {
      // Try to DM user before kick
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('👢 You have been kicked')
          .setDescription(`You have been kicked from **${message.guild.name}**`)
          .addFields([
            { name: 'Reason', value: reason, inline: true },
            { name: 'Kicked by', value: message.author.tag, inline: true },
          ])
          .setTimestamp();
        
        await target.send({ embeds: [dmEmbed] });
      } catch (error) {
        console.log(`Could not DM ${target.tag} about their kick.`);
      }
      
      await member.kick(reason);
      
      const successEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('👢 User Kicked')
        .setDescription(`Successfully kicked **${target.tag}**`)
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
          .setColor('#FFC107')
          .setTitle('👢 Member Kicked')
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
      console.error('Error kicking user:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Kick Failed')
        .setDescription('Failed to kick the user. Please check my permissions.')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};