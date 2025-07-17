
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'crime',
  description: 'Commit a crime for high risk/reward',
  usage: '',
  category: 'economy',
  cooldown: 7200, // 2 hours
  async execute(message, args, client) {
    const crimes = [
      { name: 'Rob a bank', success: 30, reward: [200, 500], fail: [100, 300] },
      { name: 'Steal a car', success: 50, reward: [100, 250], fail: [50, 150] },
      { name: 'Pickpocket', success: 70, reward: [50, 150], fail: [25, 75] },
      { name: 'Hack a website', success: 40, reward: [150, 400], fail: [75, 200] },
      { name: 'Smuggle goods', success: 35, reward: [180, 450], fail: [90, 250] }
    ];

    const crime = crimes[Math.floor(Math.random() * crimes.length)];
    const success = Math.random() * 100 < crime.success;
    
    let embed;
    
    if (success) {
      const earned = Math.floor(Math.random() * (crime.reward[1] - crime.reward[0] + 1)) + crime.reward[0];
      embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🎯 Crime Successful!')
        .setDescription(`You successfully completed: **${crime.name}**`)
        .addFields(
          { name: 'Earned', value: `${earned} coins`, inline: true },
          { name: 'Risk Level', value: `${100 - crime.success}%`, inline: true }
        );
    } else {
      const lost = Math.floor(Math.random() * (crime.fail[1] - crime.fail[0] + 1)) + crime.fail[0];
      embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🚨 Crime Failed!')
        .setDescription(`You were caught trying to: **${crime.name}**`)
        .addFields(
          { name: 'Fine', value: `${lost} coins`, inline: true },
          { name: 'Success Rate', value: `${crime.success}%`, inline: true }
        );
    }

    embed.addFields({ name: 'Next Crime', value: '<t:' + Math.floor((Date.now() + 7200000) / 1000) + ':R>', inline: true })
         .setThumbnail(message.author.displayAvatarURL())
         .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
