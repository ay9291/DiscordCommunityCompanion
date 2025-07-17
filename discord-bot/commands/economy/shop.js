
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'shop',
  description: 'Browse the shop',
  usage: '',
  category: 'economy',
  cooldown: 3,
  async execute(message, args, client) {
    const items = [
      { name: 'Laptop', price: 2500, emoji: '💻', description: 'Increases work earnings by 20%' },
      { name: 'Phone', price: 800, emoji: '📱', description: 'Reduces work cooldown by 10 minutes' },
      { name: 'Car', price: 15000, emoji: '🚗', description: 'Unlocks car-related work jobs' },
      { name: 'House', price: 50000, emoji: '🏠', description: 'Passive income of 50 coins/hour' },
      { name: 'Crown', price: 100000, emoji: '👑', description: 'Shows off your wealth!' },
      { name: 'Lucky Charm', price: 1000, emoji: '🍀', description: 'Increases crime success rate by 10%' }
    ];

    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🛒 Economy Shop')
      .setDescription('Use `!buy <item>` to purchase items!')
      .setFooter({ text: 'Items provide various bonuses to your economy experience!' })
      .setTimestamp();

    items.forEach(item => {
      embed.addFields({
        name: `${item.emoji} ${item.name}`,
        value: `**${item.price}** coins\n${item.description}`,
        inline: true
      });
    });

    message.reply({ embeds: [embed] });
  }
};
