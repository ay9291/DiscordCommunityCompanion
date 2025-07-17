
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'daily',
  description: 'Claim your daily coins',
  usage: '',
  category: 'economy',
  cooldown: 86400, // 24 hours
  async execute(message, args, client) {
    const userId = message.author.id;
    const dailyAmount = 100 + Math.floor(Math.random() * 50); // 100-150 coins
    
    // In a real bot, this would use a database
    // For now, we'll simulate it
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('💰 Daily Reward Claimed!')
      .setDescription(`You received **${dailyAmount}** coins!`)
      .addFields(
        { name: 'Streak', value: '1 day', inline: true },
        { name: 'Next Claim', value: '<t:' + Math.floor((Date.now() + 86400000) / 1000) + ':R>', inline: true }
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
