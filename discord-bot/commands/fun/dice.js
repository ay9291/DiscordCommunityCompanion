
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dice',
  description: 'Roll a dice',
  usage: '[sides]',
  category: 'fun',
  aliases: ['roll'],
  cooldown: 2,
  async execute(message, args, client) {
    const sides = parseInt(args[0]) || 6;
    
    if (sides < 2 || sides > 100) {
      return message.reply('❌ Dice must have between 2 and 100 sides!');
    }

    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setTitle('🎲 Dice Roll')
      .setDescription(`You rolled a **${result}** on a ${sides}-sided dice!`)
      .setFooter({ text: `Rolled by ${message.author.tag}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
