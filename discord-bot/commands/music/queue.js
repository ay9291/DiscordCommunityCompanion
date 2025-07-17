
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Show music queue',
  usage: '',
  category: 'music',
  aliases: ['q', 'list'],
  cooldown: 3,
  async execute(message, args, client) {
    // Simulated queue for demonstration
    const queue = [
      'Imagine Dragons - Believer',
      'Ed Sheeran - Shape of You',
      'The Weeknd - Blinding Lights',
      'Dua Lipa - Levitating',
      'Post Malone - Circles'
    ];

    const embed = new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle('🎵 Music Queue')
      .setDescription(queue.length > 0 ? 
        queue.map((song, index) => `${index + 1}. ${song}`).join('\n') :
        'Queue is empty'
      )
      .addFields(
        { name: 'Total Songs', value: queue.length.toString(), inline: true },
        { name: 'Duration', value: '~15 minutes', inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
