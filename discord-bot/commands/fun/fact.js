
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'fact',
  description: 'Get a random fact',
  usage: '',
  category: 'fun',
  cooldown: 3,
  async execute(message, args, client) {
    const facts = [
      "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
      "A group of flamingos is called a 'flamboyance'.",
      "Octopuses have three hearts and blue blood.",
      "The shortest war in history was between Britain and Zanzibar in 1896. It lasted only 38 minutes.",
      "A shrimp's heart is in its head.",
      "It's impossible to hum while holding your nose closed.",
      "The unicorn is Scotland's national animal.",
      "Bananas are berries, but strawberries aren't.",
      "A group of pandas is called an 'embarrassment'.",
      "The Great Wall of China isn't visible from space with the naked eye."
    ];

    const fact = facts[Math.floor(Math.random() * facts.length)];

    const embed = new EmbedBuilder()
      .setColor('#00ffff')
      .setTitle('🧠 Random Fact')
      .setDescription(fact)
      .setFooter({ text: 'Did you know that?' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
