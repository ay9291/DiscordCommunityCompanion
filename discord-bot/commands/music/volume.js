
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'volume',
  description: 'Set music volume',
  usage: '<0-100>',
  category: 'music',
  aliases: ['vol'],
  cooldown: 3,
  async execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to be in a voice channel to use this command!');
    }

    const volume = parseInt(args[0]);
    
    if (isNaN(volume) || volume < 0 || volume > 100) {
      return message.reply('❌ Please provide a volume between 0 and 100!');
    }

    const embed = new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle('🔊 Volume Changed')
      .setDescription(`Volume set to **${volume}%**`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
