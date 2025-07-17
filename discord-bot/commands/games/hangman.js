
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'hangman',
  description: 'Play Hangman game',
  usage: '',
  category: 'games',
  cooldown: 10,
  async execute(message, args, client) {
    const words = ['JAVASCRIPT', 'DISCORD', 'COMPUTER', 'KEYBOARD', 'MONITOR', 'INTERNET', 'WEBSITE', 'CODING'];
    const word = words[Math.floor(Math.random() * words.length)];
    const display = '_ '.repeat(word.length).trim();
    
    const hangmanStages = [
      '```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========```',
      '```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========```',
      '```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========```',
      '```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========```',
      '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========```',
      '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========```',
      '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========```'
    ];

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setTitle('🎯 Hangman Game Started!')
      .setDescription(`Word: ${display}\n\n${hangmanStages[0]}`)
      .addFields(
        { name: 'Lives', value: '6', inline: true },
        { name: 'Guessed Letters', value: 'None', inline: true },
        { name: 'Instructions', value: 'Guess letters one at a time!' }
      )
      .setFooter({ text: 'Game will timeout in 10 minutes' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
