const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'meme',
  description: 'Get a random meme',
  aliases: ['funny', 'joke'],
  usage: '!meme',
  cooldown: 3,
  async execute(message, args, client) {
    // Meme data with image URLs and captions
    const memes = [
      {
        title: "When you fix a bug but create 3 new ones",
        image: "https://i.imgflip.com/2/1bij.jpg",
        description: "The eternal struggle of programming"
      },
      {
        title: "Discord moderators when someone posts in general",
        image: "https://i.imgflip.com/2/30rog.jpg", 
        description: "Always watching, always ready"
      },
      {
        title: "Me explaining why I need another Discord bot",
        image: "https://i.imgflip.com/2/2wifvo.jpg",
        description: "But this one has different features!"
      },
      {
        title: "When someone asks 'Is the bot online?'",
        image: "https://i.imgflip.com/2/1g8my4.jpg",
        description: "While the bot is clearly responding to messages"
      },
      {
        title: "Trying to understand Discord.js documentation",
        image: "https://i.imgflip.com/2/4q29.jpg",
        description: "Why is everything so complicated?"
      },
      {
        title: "When your bot finally works after hours of debugging",
        image: "https://i.imgflip.com/2/26am.jpg",
        description: "Victory never felt so sweet"
      }
    ];
    
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    
    const embed = new EmbedBuilder()
      .setColor('#FF6B35')
      .setTitle(`😂 ${randomMeme.title}`)
      .setDescription(randomMeme.description)
      .setImage(randomMeme.image)
      .addFields([
        { name: '👍 Rating', value: `${Math.floor(Math.random() * 5) + 1}/5 stars`, inline: true },
        { name: '📈 Popularity', value: `${Math.floor(Math.random() * 1000) + 100} likes`, inline: true },
        { name: '🎭 Category', value: 'Discord/Tech Humor', inline: true }
      ])
      .setFooter({ 
        text: `Meme ${Math.floor(Math.random() * 9999) + 1} • Requested by ${message.author.username}` 
      })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
};