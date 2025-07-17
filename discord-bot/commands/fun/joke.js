
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'joke',
  description: 'Get a random joke',
  usage: '',
  category: 'fun',
  cooldown: 3,
  async execute(message, args, client) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "Why don't eggs tell jokes? They'd crack each other up!",
      "What do you call a fake noodle? An impasta!",
      "Why did the math book look so sad? Because it had too many problems!",
      "What do you call a bear with no teeth? A gummy bear!",
      "Why can't a bicycle stand up by itself? It's two tired!",
      "What do you call a fish wearing a bowtie? Sofishticated!",
      "Why did the coffee file a police report? It got mugged!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
    ];

    const joke = jokes[Math.floor(Math.random() * jokes.length)];

    const embed = new EmbedBuilder()
      .setColor('#ffff00')
      .setTitle('😂 Random Joke')
      .setDescription(joke)
      .setFooter({ text: 'Hope that made you smile!' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
