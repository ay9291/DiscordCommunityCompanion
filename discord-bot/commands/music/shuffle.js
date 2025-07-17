
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'shuffle',
  description: 'Shuffle the music queue',
  usage: '',
  category: 'music',
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to be in a voice channel to use this command!');
    }

    const embed = new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle('🔀 Queue Shuffled')
      .setDescription('The music queue has been shuffled!')
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
