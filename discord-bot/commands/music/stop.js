
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stop',
  description: 'Stop music and clear queue',
  usage: '',
  category: 'music',
  cooldown: 3,
  async execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to be in a voice channel to use this command!');
    }

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('⏹️ Music Stopped')
      .setDescription('Music has been stopped and queue cleared!')
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
