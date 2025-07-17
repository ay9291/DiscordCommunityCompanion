const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'trivia',
  description: 'Play a trivia game with multiple categories and difficulties',
  aliases: ['quiz', 'question'],
  usage: '!trivia [category] [difficulty]',
  cooldown: 5,
  async execute(message, args, client) {
    const categories = {
      'general': 'General Knowledge',
      'science': 'Science & Nature',
      'history': 'History',
      'sports': 'Sports',
      'movies': 'Movies & TV',
      'music': 'Music',
      'games': 'Video Games',
      'anime': 'Anime & Manga',
      'geography': 'Geography'
    };
    
    const difficulties = ['easy', 'medium', 'hard'];
    
    const category = args[0]?.toLowerCase() || 'general';
    const difficulty = args[1]?.toLowerCase() || 'medium';
    
    if (!categories[category]) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Category')
        .setDescription('Please choose a valid category!')
        .addFields({
          name: '📚 Available Categories',
          value: Object.keys(categories).map(cat => `\`${cat}\``).join(', '),
          inline: false
        })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    if (!difficulties.includes(difficulty)) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Difficulty')
        .setDescription('Please choose: `easy`, `medium`, or `hard`')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // Sample trivia questions (in a real bot, this would come from an API)
    const questions = {
      general: {
        easy: [
          {
            question: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correct: 0
          },
          {
            question: "How many legs does a spider have?",
            answers: ["6", "8", "10", "12"],
            correct: 1
          }
        ],
        medium: [
          {
            question: "What is the largest planet in our solar system?",
            answers: ["Earth", "Mars", "Jupiter", "Saturn"],
            correct: 2
          },
          {
            question: "Which element has the chemical symbol 'Au'?",
            answers: ["Silver", "Gold", "Aluminum", "Argon"],
            correct: 1
          }
        ],
        hard: [
          {
            question: "What is the smallest country in the world?",
            answers: ["Monaco", "Nauru", "Vatican City", "San Marino"],
            correct: 2
          }
        ]
      },
      science: {
        easy: [
          {
            question: "What gas do plants absorb from the atmosphere?",
            answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            correct: 1
          }
        ],
        medium: [
          {
            question: "What is the hardest natural substance on Earth?",
            answers: ["Gold", "Iron", "Diamond", "Platinum"],
            correct: 2
          }
        ],
        hard: [
          {
            question: "What is the speed of light in a vacuum?",
            answers: ["299,792,458 m/s", "186,282 miles/s", "300,000 km/s", "All of the above"],
            correct: 3
          }
        ]
      }
    };
    
    const categoryQuestions = questions[category] || questions.general;
    const difficultyQuestions = categoryQuestions[difficulty] || categoryQuestions.easy;
    
    if (!difficultyQuestions || difficultyQuestions.length === 0) {
      return message.reply('❌ No questions available for this category and difficulty!');
    }
    
    const question = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    
    // Create answer buttons
    const buttons = question.answers.map((answer, index) => 
      new ButtonBuilder()
        .setCustomId(`trivia_${index}`)
        .setLabel(`${String.fromCharCode(65 + index)}. ${answer}`)
        .setStyle(ButtonStyle.Primary)
    );
    
    const row1 = new ActionRowBuilder().addComponents(buttons.slice(0, 2));
    const row2 = new ActionRowBuilder().addComponents(buttons.slice(2, 4));
    
    const embed = new EmbedBuilder()
      .setColor('#2196F3')
      .setTitle('🧠 Trivia Time!')
      .setDescription(`**Category:** ${categories[category]}\n**Difficulty:** ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`)
      .addFields({
        name: '❓ Question',
        value: question.question,
        inline: false
      })
      .addFields({
        name: '⏰ Time Limit',
        value: '30 seconds',
        inline: true
      })
      .addFields({
        name: '🏆 Points',
        value: difficulty === 'easy' ? '10' : difficulty === 'medium' ? '20' : '30',
        inline: true
      })
      .setFooter({ text: `Asked by ${message.author.username}` })
      .setTimestamp();
    
    const components = buttons.length > 2 ? [row1, row2] : [row1];
    const triviaMessage = await message.reply({ embeds: [embed], components });
    
    // Store trivia data
    if (!client.triviaGames) {
      client.triviaGames = new Map();
    }
    
    client.triviaGames.set(triviaMessage.id, {
      correctAnswer: question.correct,
      difficulty: difficulty,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
      asker: message.author.id,
      answered: false,
      question: question.question,
      answers: question.answers
    });
    
    // Set timeout for the question
    setTimeout(async () => {
      const game = client.triviaGames.get(triviaMessage.id);
      if (game && !game.answered) {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('⏰ Time\'s Up!')
          .setDescription(`The correct answer was: **${question.answers[question.correct]}**`)
          .addFields({
            name: '❓ Question',
            value: question.question,
            inline: false
          })
          .setFooter({ text: 'Better luck next time!' })
          .setTimestamp();
        
        triviaMessage.edit({ embeds: [timeoutEmbed], components: [] });
        client.triviaGames.delete(triviaMessage.id);
      }
    }, 30000);
  }
};