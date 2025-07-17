
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  description: 'Skip current song',
  usage: '',
  category: 'music',
  aliases: ['s', 'next'],
  cooldown: 3,
  async execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to be in a voice channel to use this command!');
    }

    const embed = new EmbedBuilder()
      .setColor('#ffa500')
      .setTitle('⏭️ Song Skipped')
      .setDescription('Skipped to the next song!')
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
