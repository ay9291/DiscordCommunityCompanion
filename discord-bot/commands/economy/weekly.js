
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'weekly',
  description: 'Claim your weekly coins',
  usage: '',
  category: 'economy',
  cooldown: 604800, // 7 days
  async execute(message, args, client) {
    const userId = message.author.id;
    const weeklyAmount = 1000 + Math.floor(Math.random() * 500); // 1000-1500 coins
    
    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🎁 Weekly Reward Claimed!')
      .setDescription(`You received **${weeklyAmount}** coins!`)
      .addFields(
        { name: 'Bonus', value: 'Weekly rewards are 10x daily!', inline: true },
        { name: 'Next Claim', value: '<t:' + Math.floor((Date.now() + 604800000) / 1000) + ':R>', inline: true }
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
