
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'blackjack',
  description: 'Play Blackjack',
  usage: '[bet]',
  category: 'games',
  aliases: ['bj', '21'],
  cooldown: 10,
  async execute(message, args, client) {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    
    const getCard = () => {
      const card = cards[Math.floor(Math.random() * cards.length)];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      return `${card}${suit}`;
    };

    const playerCards = [getCard(), getCard()];
    const dealerCards = [getCard(), '🂠'];
    
    const bet = parseInt(args[0]) || 50;
    
    if (bet < 10 || bet > 500) {
      return message.reply('❌ Bet must be between 10 and 500 coins!');
    }

    const embed = new EmbedBuilder()
      .setColor('#000000')
      .setTitle('🃏 Blackjack Game')
      .addFields(
        { name: 'Your Cards', value: playerCards.join(' '), inline: true },
        { name: 'Dealer Cards', value: dealerCards.join(' '), inline: true },
        { name: 'Your Total', value: '~15', inline: true },
        { name: 'Bet', value: `${bet} coins`, inline: true },
        { name: 'Actions', value: 'React with ✅ to Hit, ❌ to Stand', inline: false }
      )
      .setFooter({ text: 'Game will timeout in 2 minutes' })
      .setTimestamp();

    const reply = await message.reply({ embeds: [embed] });
    await reply.react('✅');
    await reply.react('❌');
  }
};
