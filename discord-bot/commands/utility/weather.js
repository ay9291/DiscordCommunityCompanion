const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'weather',
  description: 'Get weather information for any location',
  aliases: ['w', 'temp', 'forecast'],
  usage: '!weather <location>',
  cooldown: 5,
  async execute(message, args, client) {
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Location Required')
        .setDescription('Please provide a location to get weather information!')
        .addFields({ name: 'Usage', value: '`!weather New York` or `!weather Tokyo, Japan`' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const location = args.join(' ');
    
    // Mock weather data (in real implementation, use weather API)
    const weatherData = {
      location: location,
      temperature: Math.floor(Math.random() * 40) - 10, // -10 to 30°C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Partly Cloudy', 'Thunderstorm'][Math.floor(Math.random() * 6)],
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      pressure: Math.floor(Math.random() * 100) + 1000,
      visibility: Math.floor(Math.random() * 20) + 5,
      uvIndex: Math.floor(Math.random() * 11),
      feelsLike: Math.floor(Math.random() * 40) - 10
    };
    
    // Get weather emoji
    const weatherEmojis = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Snowy': '❄️',
      'Partly Cloudy': '⛅',
      'Thunderstorm': '⛈️'
    };
    
    const weatherEmoji = weatherEmojis[weatherData.condition] || '🌤️';
    
    // Determine color based on temperature
    let color = '#2196F3';
    if (weatherData.temperature >= 25) color = '#FF5722';
    else if (weatherData.temperature >= 15) color = '#FF9800';
    else if (weatherData.temperature >= 5) color = '#2196F3';
    else color = '#9C27B0';
    
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${weatherEmoji} Weather in ${weatherData.location}`)
      .setDescription(`Current weather conditions and forecast`)
      .addFields([
        {
          name: '🌡️ Temperature',
          value: `${weatherData.temperature}°C (${Math.round(weatherData.temperature * 9/5 + 32)}°F)\nFeels like: ${weatherData.feelsLike}°C`,
          inline: true
        },
        {
          name: '🌤️ Condition',
          value: `${weatherEmoji} ${weatherData.condition}`,
          inline: true
        },
        {
          name: '💨 Wind',
          value: `${weatherData.windSpeed} km/h`,
          inline: true
        },
        {
          name: '💧 Humidity',
          value: `${weatherData.humidity}%`,
          inline: true
        },
        {
          name: '🔍 Visibility',
          value: `${weatherData.visibility} km`,
          inline: true
        },
        {
          name: '📊 Pressure',
          value: `${weatherData.pressure} hPa`,
          inline: true
        }
      ])
      .setFooter({ text: `Weather data • Requested by ${message.author.username}` })
      .setTimestamp();
    
    // Add UV Index if sunny
    if (weatherData.condition === 'Sunny' || weatherData.condition === 'Partly Cloudy') {
      let uvLevel = 'Low';
      if (weatherData.uvIndex >= 8) uvLevel = 'Very High';
      else if (weatherData.uvIndex >= 6) uvLevel = 'High';
      else if (weatherData.uvIndex >= 3) uvLevel = 'Moderate';
      
      embed.addFields({
        name: '☀️ UV Index',
        value: `${weatherData.uvIndex}/10 (${uvLevel})`,
        inline: true
      });
    }
    
    message.reply({ embeds: [embed] });
  }
};