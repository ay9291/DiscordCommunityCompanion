
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rps',
  description: 'Play rock paper scissors',
  usage: '<rock|paper|scissors>',
  category: 'fun',
  aliases: ['rockpaperscissors'],
  cooldown: 3,
  async execute(message, args, client) {
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    
    const userChoice = args[0]?.toLowerCase();
    if (!choices.includes(userChoice)) {
      return message.reply('❌ Please choose rock, paper, or scissors!');
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    
    let result;
    if (userChoice === botChoice) {
      result = "It's a tie!";
    } else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = 'You win!';
    } else {
      result = 'You lose!';
    }

    const embed = new EmbedBuilder()
      .setColor(result === 'You win!' ? '#00ff00' : result === 'You lose!' ? '#ff0000' : '#ffff00')
      .setTitle('✂️ Rock Paper Scissors')
      .addFields(
        { name: 'Your Choice', value: `${emojis[userChoice]} ${userChoice}`, inline: true },
        { name: 'My Choice', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
        { name: 'Result', value: result, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
