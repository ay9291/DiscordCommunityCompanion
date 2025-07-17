
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'work',
  description: 'Work to earn coins',
  usage: '',
  category: 'economy',
  cooldown: 3600, // 1 hour
  async execute(message, args, client) {
    const jobs = [
      { name: 'Pizza Delivery Driver', earning: [15, 35], emoji: '🍕' },
      { name: 'Code Developer', earning: [50, 100], emoji: '💻' },
      { name: 'Uber Driver', earning: [20, 45], emoji: '🚗' },
      { name: 'Dog Walker', earning: [10, 25], emoji: '🐕' },
      { name: 'Freelancer', earning: [30, 70], emoji: '📝' },
      { name: 'Streamer', earning: [5, 80], emoji: '📺' },
      { name: 'Chef', earning: [25, 55], emoji: '👨‍🍳' },
      { name: 'Teacher', earning: [40, 60], emoji: '👨‍🏫' }
    ];

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const earned = Math.floor(Math.random() * (job.earning[1] - job.earning[0] + 1)) + job.earning[0];

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle(`${job.emoji} Work Complete!`)
      .setDescription(`You worked as a **${job.name}** and earned **${earned}** coins!`)
      .addFields(
        { name: 'Time Worked', value: '1 hour', inline: true },
        { name: 'Next Work', value: '<t:' + Math.floor((Date.now() + 3600000) / 1000) + ':R>', inline: true }
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
