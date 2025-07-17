
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rob',
  description: 'Attempt to rob another user',
  usage: '<@user>',
  category: 'economy',
  cooldown: 3600,
  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
    
    if (!target) {
      return message.reply('❌ Please mention a user to rob!');
    }
    
    if (target.id === message.author.id) {
      return message.reply('❌ You cannot rob yourself!');
    }
    
    if (target.bot) {
      return message.reply('❌ You cannot rob bots!');
    }

    const success = Math.random() < 0.4; // 40% success rate
    const amount = Math.floor(Math.random() * 100) + 25; // 25-125 coins
    
    let embed;
    
    if (success) {
      embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('💰 Robbery Successful!')
        .setDescription(`You successfully robbed **${amount}** coins from ${target.tag}!`)
        .addFields(
          { name: 'Victim', value: target.tag, inline: true },
          { name: 'Stolen', value: `${amount} coins`, inline: true }
        );
    } else {
      const fine = Math.floor(Math.random() * 75) + 25; // 25-100 coins fine
      embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🚨 Robbery Failed!')
        .setDescription(`You were caught trying to rob ${target.tag}! You paid a fine of **${fine}** coins.`)
        .addFields(
          { name: 'Target', value: target.tag, inline: true },
          { name: 'Fine', value: `${fine} coins`, inline: true }
        );
    }

    embed.addFields({ name: 'Next Rob', value: '<t:' + Math.floor((Date.now() + 3600000) / 1000) + ':R>', inline: true })
         .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
