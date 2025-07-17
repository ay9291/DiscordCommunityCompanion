
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'Flip a coin',
  usage: '',
  category: 'fun',
  aliases: ['flip', 'coin'],
  cooldown: 2,
  async execute(message, args, client) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '🪙' : '🔘';

    const embed = new EmbedBuilder()
      .setColor(result === 'Heads' ? '#ffd700' : '#c0c0c0')
      .setTitle(`${emoji} Coin Flip`)
      .setDescription(`The coin landed on **${result}**!`)
      .setFooter({ text: `Flipped by ${message.author.tag}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
