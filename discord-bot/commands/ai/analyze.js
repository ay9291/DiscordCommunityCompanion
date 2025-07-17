
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'analyze',
  description: 'Analyze text sentiment and content',
  usage: '<text>',
  category: 'ai',
  cooldown: 5,
  async execute(message, args, client) {
    const text = args.join(' ');
    
    if (!text) {
      return message.reply('❌ Please provide text to analyze!');
    }

    if (text.length > 1000) {
      return message.reply('❌ Text too long! Please keep it under 1000 characters.');
    }

    // Simulate text analysis
    const sentiments = ['Very Positive 😄', 'Positive 😊', 'Neutral 😐', 'Negative 😞', 'Very Negative 😢'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    const wordCount = text.split(' ').length;
    const charCount = text.length;
    const complexity = wordCount > 50 ? 'Complex' : wordCount > 20 ? 'Moderate' : 'Simple';

    const embed = new EmbedBuilder()
      .setColor('#ff6b9d')
      .setTitle('📊 Text Analysis')
      .addFields(
        { name: 'Sentiment', value: sentiment, inline: true },
        { name: 'Complexity', value: complexity, inline: true },
        { name: 'Word Count', value: wordCount.toString(), inline: true },
        { name: 'Character Count', value: charCount.toString(), inline: true },
        { name: 'Reading Time', value: `~${Math.ceil(wordCount / 200)} min`, inline: true },
        { name: 'Language', value: 'English (detected)', inline: true }
      )
      .setFooter({ text: 'Analysis is simulated for demo purposes' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
