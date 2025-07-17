
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stats',
  description: 'Show bot statistics',
  usage: '',
  category: 'general',
  aliases: ['statistics', 'info'],
  cooldown: 10,
  async execute(message, args, client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle('📊 Bot Statistics')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
        { name: 'Users', value: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toString(), inline: true },
        { name: 'Channels', value: client.channels.cache.size.toString(), inline: true },
        { name: 'Commands', value: client.commands.size.toString(), inline: true },
        { name: 'Uptime', value: uptimeString, inline: true },
        { name: 'Memory Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: 'Node.js Version', value: process.version, inline: true },
        { name: 'Discord.js Version', value: require('discord.js').version, inline: true },
        { name: 'Bot Version', value: client.config.version, inline: true }
      )
      .setFooter({ text: 'BotMaster Pro - Ultimate Discord Bot' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
