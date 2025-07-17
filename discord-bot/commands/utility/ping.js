const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Check the bot\'s latency and response time',
  aliases: ['latency', 'pong'],
  usage: '!ping',
  cooldown: 3,
  async execute(message, args, client) {
    const start = Date.now();
    
    const pingEmbed = new EmbedBuilder()
      .setColor('#FFC107')
      .setTitle('🏓 Pinging...')
      .setDescription('Calculating latency...')
      .setTimestamp();
    
    const msg = await message.reply({ embeds: [pingEmbed] });
    
    const end = Date.now();
    const messageLatency = end - start;
    const apiLatency = Math.round(client.ws.ping);
    
    // Determine status based on latency
    let status = '';
    let color = '';
    
    if (apiLatency < 100) {
      status = '🟢 Excellent';
      color = '#4CAF50';
    } else if (apiLatency < 200) {
      status = '🟡 Good';
      color = '#FFC107';
    } else if (apiLatency < 500) {
      status = '🟠 Average';
      color = '#FF9800';
    } else {
      status = '🔴 Poor';
      color = '#ff6b6b';
    }
    
    const resultEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('🏓 Pong!')
      .addFields([
        { name: '📤 Message Latency', value: `${messageLatency}ms`, inline: true },
        { name: '💓 API Latency', value: `${apiLatency}ms`, inline: true },
        { name: '📊 Status', value: status, inline: true },
        { name: '⚡ Performance', value: getPerformanceBar(apiLatency), inline: false },
      ])
      .setFooter({ text: 'Lower is better • API latency is to Discord\'s servers' })
      .setTimestamp();
    
    await msg.edit({ embeds: [resultEmbed] });
  }
};

function getPerformanceBar(latency) {
  const maxLatency = 1000;
  const percentage = Math.min((latency / maxLatency) * 100, 100);
  const filled = Math.floor(percentage / 10);
  const empty = 10 - filled;
  
  const greenBars = Math.max(0, Math.min(3, 3 - Math.floor(filled / 3)));
  const yellowBars = Math.max(0, Math.min(4, 4 - Math.max(0, filled - 3)));
  const redBars = Math.max(0, filled - 7);
  
  return '🟢'.repeat(greenBars) + '🟡'.repeat(yellowBars) + '🔴'.repeat(redBars) + '⚫'.repeat(empty);
}