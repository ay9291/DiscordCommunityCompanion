const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  name: 'rank',
  description: 'View your or someone else\'s rank and level',
  aliases: ['level', 'xp', 'profile'],
  usage: '!rank [@user]',
  cooldown: 5,
  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(target.id);
    
    if (!member) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ User Not Found')
        .setDescription('Could not find that user in this server.')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // TODO: Get actual user data from database
    const userData = {
      level: Math.floor(Math.random() * 100) + 1,
      xp: Math.floor(Math.random() * 1000),
      totalXp: Math.floor(Math.random() * 100000) + 5000,
      rank: Math.floor(Math.random() * 500) + 1,
      messagesCount: Math.floor(Math.random() * 10000) + 100,
      voiceTime: Math.floor(Math.random() * 500000) + 10000, // in minutes
      reputation: Math.floor(Math.random() * 100),
      badges: ['🔥 Active Member', '🎵 Music Lover', '💬 Chatty'],
      joinedAt: member.joinedAt,
      customTitle: 'Discord Legend'
    };
    
    const currentLevelXp = userData.level * 1000;
    const nextLevelXp = (userData.level + 1) * 1000;
    const progressPercent = Math.floor((userData.xp / 1000) * 100);
    
    // Create progress bar
    const progressBar = '█'.repeat(Math.floor(progressPercent / 5)) + '░'.repeat(20 - Math.floor(progressPercent / 5));
    
    const embed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle(`📊 ${target.username}'s Rank Card`)
      .setDescription(`${userData.customTitle ? `**${userData.customTitle}**\n` : ''}${target === message.author ? 'Your' : `${target.username}'s`} server statistics and progression`)
      .addFields([
        { 
          name: '📈 Level & XP', 
          value: `**Level:** ${userData.level}\n**XP:** ${userData.xp}/${nextLevelXp}\n**Total XP:** ${userData.totalXp.toLocaleString()}`, 
          inline: true 
        },
        { 
          name: '🏆 Ranking', 
          value: `**Server Rank:** #${userData.rank}\n**Reputation:** ${userData.reputation} ⭐\n**Messages:** ${userData.messagesCount.toLocaleString()}`, 
          inline: true 
        },
        { 
          name: '⏱️ Activity', 
          value: `**Voice Time:** ${Math.floor(userData.voiceTime / 60)}h ${userData.voiceTime % 60}m\n**Joined:** <t:${Math.floor(userData.joinedAt.getTime() / 1000)}:R>\n**Status:** 🟢 Active`, 
          inline: true 
        },
        {
          name: '🎯 Progress to Next Level',
          value: `${progressBar} ${progressPercent}%\n${userData.xp}/${nextLevelXp} XP (${nextLevelXp - userData.xp} needed)`,
          inline: false
        }
      ])
      .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTimestamp();
    
    // Add badges if user has any
    if (userData.badges.length > 0) {
      embed.addFields({
        name: '🏅 Badges',
        value: userData.badges.join(' • '),
        inline: false
      });
    }
    
    // Add level rewards info
    const nextRewards = getNextLevelRewards(userData.level + 1);
    if (nextRewards.length > 0) {
      embed.addFields({
        name: '🎁 Next Level Rewards',
        value: nextRewards.join('\n'),
        inline: false
      });
    }
    
    // Add comparison if checking someone else
    if (target !== message.author) {
      embed.setFooter({ 
        text: `Use !rank to see your own stats • Requested by ${message.author.username}` 
      });
    } else {
      embed.setFooter({ 
        text: 'Keep chatting and staying active to level up! • Use !leaderboard to see top users' 
      });
    }
    
    message.reply({ embeds: [embed] });
  }
};

// Helper function to get next level rewards
function getNextLevelRewards(level) {
  const rewards = [];
  
  if (level % 10 === 0) {
    rewards.push('🎁 Special Role Unlock');
  }
  
  if (level % 25 === 0) {
    rewards.push('💎 Custom Color Access');
  }
  
  if (level % 50 === 0) {
    rewards.push('👑 VIP Perks');
  }
  
  if (level === 100) {
    rewards.push('🏆 Legend Status');
  }
  
  return rewards;
}