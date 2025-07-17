
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'inventory',
  description: 'View your items',
  usage: '',
  category: 'economy',
  aliases: ['inv', 'items'],
  cooldown: 3,
  async execute(message, args, client) {
    // Simulated inventory for demonstration
    const inventory = [
      { name: 'Laptop', emoji: '💻', quantity: 1 },
      { name: 'Phone', emoji: '📱', quantity: 2 },
      { name: 'Lucky Charm', emoji: '🍀', quantity: 1 }
    ];

    const embed = new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle(`🎒 ${message.author.username}'s Inventory`)
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    if (inventory.length === 0) {
      embed.setDescription('Your inventory is empty! Visit the shop to buy items.');
    } else {
      const itemList = inventory.map(item => 
        `${item.emoji} **${item.name}** x${item.quantity}`
      ).join('\n');
      
      embed.setDescription(itemList);
      embed.addFields({ name: 'Total Items', value: inventory.length.toString(), inline: true });
    }

    message.reply({ embeds: [embed] });
  }
};
