
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'quote',
  description: 'Get an inspirational quote',
  usage: '',
  category: 'fun',
  cooldown: 5,
  async execute(message, args, client) {
    const quotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
      { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" }
    ];

    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('💡 Inspirational Quote')
      .setDescription(`*"${quote.text}"*`)
      .setFooter({ text: `— ${quote.author}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
