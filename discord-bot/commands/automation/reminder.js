const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'reminder',
  description: 'Set a reminder for yourself or someone else',
  aliases: ['remind', 'remindme'],
  usage: '!reminder <time> <message>',
  cooldown: 5,
  async execute(message, args, client) {
    if (args.length < 2) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Usage')
        .setDescription('Please provide time and reminder message!')
        .addFields([
          { name: 'Usage Examples', value: '`!reminder 30m Take a break`\n`!reminder 2h Check the server`\n`!reminder 1d Meeting tomorrow`', inline: false },
          { name: 'Time Formats', value: 's = seconds, m = minutes, h = hours, d = days', inline: false }
        ])
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const timeInput = args[0].toLowerCase();
    const reminderText = args.slice(1).join(' ');
    
    // Parse time
    const timeRegex = /^(\d+)([smhd])$/;
    const match = timeInput.match(timeRegex);
    
    if (!match) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Time Format')
        .setDescription('Please use format like: 30s, 15m, 2h, 1d')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const [, amount, unit] = match;
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const delay = parseInt(amount) * multipliers[unit];
    
    // Maximum 7 days
    if (delay > 7 * 24 * 60 * 60 * 1000) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Time Limit Exceeded')
        .setDescription('Maximum reminder time is 7 days!')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // Calculate reminder time
    const reminderTime = new Date(Date.now() + delay);
    
    // Confirmation embed
    const confirmEmbed = new EmbedBuilder()
      .setColor('#4CAF50')
      .setTitle('⏰ Reminder Set!')
      .setDescription(`I'll remind you in **${amount}${unit}**`)
      .addFields([
        { name: '📝 Reminder', value: reminderText, inline: false },
        { name: '🕐 Time', value: `<t:${Math.floor(reminderTime.getTime() / 1000)}:F>`, inline: true },
        { name: '👤 User', value: message.author.toString(), inline: true }
      ])
      .setFooter({ text: `Reminder ID: ${Date.now()}` })
      .setTimestamp();
    
    await message.reply({ embeds: [confirmEmbed] });
    
    // Set the reminder
    setTimeout(async () => {
      const reminderEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🔔 Reminder!')
        .setDescription(reminderText)
        .addFields([
          { name: '⏰ Set', value: `<t:${Math.floor((Date.now() - delay) / 1000)}:R>`, inline: true },
          { name: '📍 Channel', value: message.channel.toString(), inline: true }
        ])
        .setFooter({ text: 'BotMaster Reminder Service' })
        .setTimestamp();
      
      try {
        await message.author.send({ embeds: [reminderEmbed] });
      } catch (error) {
        // If DM fails, send in the original channel
        await message.channel.send({ 
          content: `${message.author}, here's your reminder:`,
          embeds: [reminderEmbed] 
        });
      }
    }, delay);
  }
};