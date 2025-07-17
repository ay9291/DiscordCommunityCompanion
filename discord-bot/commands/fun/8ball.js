const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8ball a question',
  aliases: ['eightball', 'magic8ball', '8b'],
  usage: '!8ball <question>',
  cooldown: 3,
  async execute(message, args, client) {
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ No Question')
        .setDescription('Please ask the magic 8ball a question!')
        .addFields({ name: 'Usage', value: '`!8ball Will I win the lottery?`' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const question = args.join(' ');
    
    const responses = [
      // Positive
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      
      // Neutral
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      
      // Negative
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Determine color based on response type
    let color = '#7289da';
    if (response.includes('yes') || response.includes('certain') || response.includes('definitely') || response.includes('good')) {
      color = '#4CAF50'; // Green for positive
    } else if (response.includes('no') || response.includes('doubtful') || response.includes("Don't")) {
      color = '#ff6b6b'; // Red for negative
    } else {
      color = '#FFC107'; // Yellow for neutral
    }
    
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('🎱 Magic 8-Ball')
      .addFields([
        { name: '❓ Question', value: question, inline: false },
        { name: '🔮 Answer', value: `**${response}**`, inline: false }
      ])
      .setThumbnail('https://cdn.discordapp.com/attachments/123456789/8ball.png')
      .setFooter({ text: `Asked by ${message.author.username}` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};