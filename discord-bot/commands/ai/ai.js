const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ai',
  description: 'Chat with AI assistant',
  aliases: ['chat', 'ask', 'assistant'],
  usage: '!ai <your question>',
  cooldown: 5,
  async execute(message, args, client) {
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ No Question Provided')
        .setDescription('Please provide a question or statement for the AI!')
        .addFields({ name: 'Usage', value: '`!ai How does photosynthesis work?`' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const query = args.join(' ');
    
    // Show typing indicator
    await message.channel.sendTyping();
    
    try {
      // In a real implementation, this would call an AI API like OpenAI
      const responses = {
        'hello': 'Hello! How can I assist you today?',
        'how are you': 'I\'m doing great! Thanks for asking. How can I help you?',
        'what is discord': 'Discord is a voice, video, and text communication service used by gamers and communities.',
        'explain quantum physics': 'Quantum physics is the branch of physics that studies matter and energy at the smallest scales - typically atoms and subatomic particles.',
        'tell me a joke': 'Why don\'t scientists trust atoms? Because they make up everything!',
        'what is ai': 'AI (Artificial Intelligence) refers to computer systems that can perform tasks that typically require human intelligence.',
        'help': 'I\'m an AI assistant that can answer questions, explain concepts, help with problems, and have conversations!'
      };
      
      // Simple keyword matching for demo
      let response = 'I\'m sorry, but I need an API key to provide intelligent responses. Please ask an administrator to configure the AI service.';
      
      const lowerQuery = query.toLowerCase();
      for (const [key, value] of Object.entries(responses)) {
        if (lowerQuery.includes(key)) {
          response = value;
          break;
        }
      }
      
      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('🤖 AI Assistant')
        .addFields([
          { name: '❓ Your Question', value: query, inline: false },
          { name: '💭 AI Response', value: response, inline: false }
        ])
        .setFooter({ text: `Response time: ${Date.now() - message.createdTimestamp}ms • Powered by BotMaster AI` })
        .setTimestamp();
      
      message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('AI command error:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ AI Service Error')
        .setDescription('Sorry, I\'m having trouble processing your request right now. Please try again later!')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};