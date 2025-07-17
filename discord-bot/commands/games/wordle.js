
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'wordle',
  description: 'Play Wordle game',
  usage: '',
  category: 'games',
  cooldown: 10,
  async execute(message, args, client) {
    const words = ['ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN'];
    const word = words[Math.floor(Math.random() * words.length)];
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🟩 Wordle Game Started!')
      .setDescription('Guess the 5-letter word! You have 6 attempts.')
      .addFields(
        { name: 'How to play:', value: '🟩 = Correct letter in correct position\n🟨 = Correct letter in wrong position\n⬛ = Letter not in word' },
        { name: 'Usage:', value: 'Type your 5-letter guess in chat!' }
      )
      .setFooter({ text: 'Game will timeout in 5 minutes' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
    
    // Note: In a full implementation, this would use a collector to handle guesses
    // For now, this is just the game start interface
  }
};
