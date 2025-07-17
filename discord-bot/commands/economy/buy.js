
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  usage: '<item>',
  category: 'economy',
  cooldown: 3,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('❌ Please specify an item to buy! Use `!shop` to see available items.');
    }

    const items = {
      laptop: { name: 'Laptop', price: 2500, emoji: '💻' },
      phone: { name: 'Phone', price: 800, emoji: '📱' },
      car: { name: 'Car', price: 15000, emoji: '🚗' },
      house: { name: 'House', price: 50000, emoji: '🏠' },
      crown: { name: 'Crown', price: 100000, emoji: '👑' },
      charm: { name: 'Lucky Charm', price: 1000, emoji: '🍀' }
    };

    const itemName = args[0].toLowerCase();
    const item = items[itemName];

    if (!item) {
      return message.reply('❌ That item doesn\'t exist! Use `!shop` to see available items.');
    }

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('✅ Purchase Successful!')
      .setDescription(`You bought a **${item.emoji} ${item.name}** for **${item.price}** coins!`)
      .addFields(
        { name: 'Item', value: `${item.emoji} ${item.name}`, inline: true },
        { name: 'Cost', value: `${item.price} coins`, inline: true },
        { name: 'Remaining Balance', value: '∞ coins', inline: true }
      )
      .setFooter({ text: 'Check your inventory with !inventory' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
