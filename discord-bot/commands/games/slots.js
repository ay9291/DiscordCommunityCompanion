
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'slots',
  description: 'Play slot machine',
  usage: '[bet]',
  category: 'games',
  aliases: ['slot'],
  cooldown: 5,
  async execute(message, args, client) {
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
    const bet = parseInt(args[0]) || 10;
    
    if (bet < 1 || bet > 1000) {
      return message.reply('❌ Bet must be between 1 and 1000 coins!');
    }

    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    let winnings = 0;
    let result = '';

    if (slot1 === slot2 && slot2 === slot3) {
      if (slot1 === '💎') {
        winnings = bet * 10;
        result = 'JACKPOT! 💎💎💎';
      } else if (slot1 === '7️⃣') {
        winnings = bet * 7;
        result = 'LUCKY SEVENS! 7️⃣7️⃣7️⃣';
      } else {
        winnings = bet * 3;
        result = 'THREE OF A KIND!';
      }
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winnings = bet;
      result = 'Two matching!';
    } else {
      winnings = 0;
      result = 'No luck this time...';
    }

    const embed = new EmbedBuilder()
      .setColor(winnings > 0 ? '#00ff00' : '#ff0000')
      .setTitle('🎰 Slot Machine')
      .setDescription(`**${slot1} | ${slot2} | ${slot3}**\n\n${result}`)
      .addFields(
        { name: 'Bet', value: `${bet} coins`, inline: true },
        { name: 'Winnings', value: `${winnings} coins`, inline: true },
        { name: 'Profit', value: `${winnings - bet} coins`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
