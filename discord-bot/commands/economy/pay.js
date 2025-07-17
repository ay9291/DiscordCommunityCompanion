
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'pay',
  description: 'Transfer coins to another user',
  usage: '<@user> <amount>',
  category: 'economy',
  cooldown: 5,
  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
    const amount = parseInt(args[1]);
    
    if (!target) {
      return message.reply('❌ Please mention a user to pay!');
    }
    
    if (!amount || amount < 1) {
      return message.reply('❌ Please specify a valid amount to pay!');
    }
    
    if (target.id === message.author.id) {
      return message.reply('❌ You cannot pay yourself!');
    }
    
    if (target.bot) {
      return message.reply('❌ You cannot pay bots!');
    }

    if (amount > 10000) {
      return message.reply('❌ You cannot transfer more than 10,000 coins at once!');
    }

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('💸 Payment Successful!')
      .setDescription(`You paid **${amount}** coins to ${target.tag}!`)
      .addFields(
        { name: 'From', value: message.author.tag, inline: true },
        { name: 'To', value: target.tag, inline: true },
        { name: 'Amount', value: `${amount} coins`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
