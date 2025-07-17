
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'loop',
  description: 'Toggle loop mode',
  usage: '[off|track|queue]',
  category: 'music',
  aliases: ['repeat'],
  cooldown: 3,
  async execute(message, args, client) {
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to be in a voice channel to use this command!');
    }

    const modes = ['off', 'track', 'queue'];
    const mode = args[0]?.toLowerCase() || 'track';
    
    if (!modes.includes(mode)) {
      return message.reply('❌ Valid loop modes: `off`, `track`, `queue`');
    }

    const emojis = { off: '⏹️', track: '🔂', queue: '🔁' };
    const descriptions = {
      off: 'Loop disabled',
      track: 'Current track will loop',
      queue: 'Entire queue will loop'
    };

    const embed = new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle(`${emojis[mode]} Loop ${mode === 'off' ? 'Disabled' : 'Enabled'}`)
      .setDescription(descriptions[mode])
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
