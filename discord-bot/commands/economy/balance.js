const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'balance',
  description: 'Check your or someone else\'s balance',
  aliases: ['bal', 'money', 'coins', 'cash'],
  usage: '!balance [@user]',
  cooldown: 3,
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
    
    // TODO: Get actual balance from database
    const userData = {
      balance: Math.floor(Math.random() * 10000) + 500,
      bank: Math.floor(Math.random() * 50000) + 1000,
      level: Math.floor(Math.random() * 50) + 1,
      dailyStreak: Math.floor(Math.random() * 30),
      totalEarned: Math.floor(Math.random() * 100000) + 5000,
      rank: Math.floor(Math.random() * 100) + 1
    };
    
    const totalMoney = userData.balance + userData.bank;
    
    const embed = new EmbedBuilder()
      .setColor('#4CAF50')
      .setTitle(`💰 ${target.username}'s Economy Profile`)
      .setDescription(`${target === message.author ? 'Your' : `${target.username}'s`} current financial status`)
      .addFields([
        { 
          name: '💵 Wallet', 
          value: `**${userData.balance.toLocaleString()}** coins`, 
          inline: true 
        },
        { 
          name: '🏦 Bank', 
          value: `**${userData.bank.toLocaleString()}** coins`, 
          inline: true 
        },
        { 
          name: '💎 Net Worth', 
          value: `**${totalMoney.toLocaleString()}** coins`, 
          inline: true 
        },
        { 
          name: '📈 Level', 
          value: `**${userData.level}**`, 
          inline: true 
        },
        { 
          name: '🔥 Daily Streak', 
          value: `**${userData.dailyStreak}** days`, 
          inline: true 
        },
        { 
          name: '🏆 Server Rank', 
          value: `**#${userData.rank}**`, 
          inline: true 
        },
        { 
          name: '📊 Total Earned', 
          value: `**${userData.totalEarned.toLocaleString()}** coins all-time`, 
          inline: false 
        }
      ])
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setFooter({ 
        text: 'Use !daily, !work, or !crime to earn more coins • !shop to spend them' 
      })
      .setTimestamp();
    
    // Add progress bar for next level
    const currentLevelXP = userData.level * 1000;
    const nextLevelXP = (userData.level + 1) * 1000;
    const progressXP = Math.floor(Math.random() * 1000);
    const progressPercent = Math.floor((progressXP / 1000) * 100);
    
    const progressBar = '█'.repeat(Math.floor(progressPercent / 10)) + '░'.repeat(10 - Math.floor(progressPercent / 10));
    
    embed.addFields({
      name: '⭐ XP Progress',
      value: `${progressBar} ${progressPercent}%\n${progressXP}/1000 XP to level ${userData.level + 1}`,
      inline: false
    });
    
    // Add earning suggestions based on current balance
    let suggestions = '';
    if (userData.balance < 1000) {
      suggestions = '💡 **Low on cash?** Try `!daily` for free coins or `!work` to earn more!';
    } else if (userData.balance > 10000) {
      suggestions = '💡 **Rolling in coins!** Consider `!deposit` to keep them safe or check out `!shop`!';
    } else {
      suggestions = '💡 **Doing well!** Try `!gamble` for bigger rewards or `!invest` to grow your money!';
    }
    
    embed.addFields({
      name: '💭 Suggestion',
      value: suggestions,
      inline: false
    });
    
    message.reply({ embeds: [embed] });
  }
};