
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  description: 'Show server XP leaderboard',
  usage: '',
  category: 'leveling',
  aliases: ['lb', 'top'],
  cooldown: 10,
  async execute(message, args, client) {
    // Simulated leaderboard data
    const leaderboard = [
      { user: 'User#1234', level: 25, xp: 12450 },
      { user: 'Player#5678', level: 22, xp: 9870 },
      { user: 'Gamer#9012', level: 19, xp: 7650 },
      { user: 'Member#3456', level: 17, xp: 6420 },
      { user: 'User#7890', level: 15, xp: 5230 },
      { user: 'Player#2468', level: 13, xp: 4180 },
      { user: 'Gamer#1357', level: 11, xp: 3120 },
      { user: 'Member#8642', level: 9, xp: 2450 },
      { user: 'User#9753', level: 8, xp: 1980 },
      { user: 'Player#1122', level: 7, xp: 1560 }
    ];

    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle(`🏆 ${message.guild.name} - XP Leaderboard`)
      .setDescription('Top 10 most active members')
      .setThumbnail(message.guild.iconURL())
      .setTimestamp();

    const leaderboardText = leaderboard.map((entry, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      return `${medal} **${entry.user}** - Level ${entry.level} (${entry.xp} XP)`;
    }).join('\n');

    embed.setDescription(leaderboardText);

    message.reply({ embeds: [embed] });
  }
};
