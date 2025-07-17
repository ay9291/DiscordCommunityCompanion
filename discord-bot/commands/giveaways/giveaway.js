const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'giveaway',
  description: 'Start a giveaway in the current channel',
  aliases: ['gstart', 'giveawaystart'],
  usage: '!giveaway <duration> <winners> <prize>',
  cooldown: 10,
  permissions: ['ManageGuild'],
  async execute(message, args, client) {
    if (args.length < 3) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Usage')
        .setDescription('Please provide all required arguments for the giveaway!')
        .addFields([
          { name: 'Usage', value: '`!giveaway <duration> <winners> <prize>`', inline: false },
          { name: 'Examples', value: '`!giveaway 1h 1 Discord Nitro`\n`!giveaway 30m 3 $50 Gift Card`\n`!giveaway 1d 5 VIP Role`', inline: false },
          { name: 'Duration Format', value: '• `s` = seconds\n• `m` = minutes\n• `h` = hours\n• `d` = days', inline: true },
        ])
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const duration = args[0];
    const winners = parseInt(args[1]);
    const prize = args.slice(2).join(' ');
    
    // Parse duration
    const durationMs = parseDuration(duration);
    if (!durationMs) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Duration')
        .setDescription('Please provide a valid duration format!')
        .addFields({ name: 'Valid Formats', value: '`30s`, `5m`, `2h`, `1d`' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // Validate winners count
    if (isNaN(winners) || winners < 1 || winners > 20) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Winners Count')
        .setDescription('Winners count must be a number between 1 and 20!')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    try {
      const endTime = Date.now() + durationMs;
      const endTimestamp = Math.floor(endTime / 1000);
      
      const giveawayEmbed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('🎉 GIVEAWAY 🎉')
        .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** <t:${endTimestamp}:R> (<t:${endTimestamp}:F>)\n**Hosted by:** ${message.author}`)
        .addFields([
          { name: '🎯 How to Enter', value: 'Click the 🎉 button below to enter!', inline: true },
          { name: '⏰ Time Remaining', value: `<t:${endTimestamp}:R>`, inline: true },
          { name: '👥 Participants', value: '0', inline: true },
        ])
        .setFooter({ text: 'Good luck to everyone! 🍀' })
        .setTimestamp();
      
      const enterButton = new ButtonBuilder()
        .setCustomId('giveaway_enter')
        .setLabel('🎉 Enter Giveaway')
        .setStyle(ButtonStyle.Primary);
      
      const infoButton = new ButtonBuilder()
        .setCustomId('giveaway_info')
        .setLabel('ℹ️ Info')
        .setStyle(ButtonStyle.Secondary);
      
      const row = new ActionRowBuilder().addComponents(enterButton, infoButton);
      
      const giveawayMessage = await message.channel.send({ 
        embeds: [giveawayEmbed], 
        components: [row] 
      });
      
      // Store giveaway data (in a real bot, this would go to a database)
      if (!client.giveaways) {
        client.giveaways = new Map();
      }
      
      client.giveaways.set(giveawayMessage.id, {
        messageId: giveawayMessage.id,
        channelId: message.channel.id,
        guildId: message.guild.id,
        hostId: message.author.id,
        prize: prize,
        winners: winners,
        endTime: endTime,
        participants: new Set(),
        ended: false
      });
      
      // Confirmation message
      const confirmEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('✅ Giveaway Started!')
        .setDescription(`Giveaway has been started in ${message.channel}`)
        .addFields([
          { name: 'Prize', value: prize, inline: true },
          { name: 'Duration', value: duration, inline: true },
          { name: 'Winners', value: winners.toString(), inline: true },
        ])
        .setTimestamp();
      
      message.reply({ embeds: [confirmEmbed] });
      
      // Set timeout to end giveaway
      setTimeout(async () => {
        await endGiveaway(client, giveawayMessage.id);
      }, durationMs);
      
      // Log giveaway start
      const logChannel = message.guild.channels.cache.find(c => c.name === 'giveaway-logs' || c.name === 'mod-logs');
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#FF6B35')
          .setTitle('🎉 Giveaway Started')
          .addFields([
            { name: 'Host', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: 'Channel', value: message.channel.toString(), inline: true },
            { name: 'Prize', value: prize, inline: true },
            { name: 'Winners', value: winners.toString(), inline: true },
            { name: 'Duration', value: duration, inline: true },
            { name: 'Message ID', value: giveawayMessage.id, inline: true },
          ])
          .setTimestamp();
        
        logChannel.send({ embeds: [logEmbed] });
      }
      
    } catch (error) {
      console.error('Error starting giveaway:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Giveaway Error')
        .setDescription('Failed to start the giveaway. Please try again!')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};

// Helper function to parse duration
function parseDuration(duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  
  return value * multipliers[unit];
}

// Helper function to end giveaway
async function endGiveaway(client, messageId) {
  const giveaway = client.giveaways.get(messageId);
  if (!giveaway || giveaway.ended) return;
  
  try {
    const channel = client.channels.cache.get(giveaway.channelId);
    if (!channel) return;
    
    const message = await channel.messages.fetch(messageId);
    if (!message) return;
    
    giveaway.ended = true;
    
    const participants = Array.from(giveaway.participants);
    let winners = [];
    
    if (participants.length === 0) {
      // No participants
      const noWinnersEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('🎉 Giveaway Ended')
        .setDescription(`**Prize:** ${giveaway.prize}\n**Winners:** No valid entries`)
        .addFields({ name: '😔 Result', value: 'No one entered the giveaway!', inline: false })
        .setFooter({ text: 'Better luck next time!' })
        .setTimestamp();
      
      await message.edit({ embeds: [noWinnersEmbed], components: [] });
      
    } else {
      // Select random winners
      const winnerCount = Math.min(giveaway.winners, participants.length);
      
      for (let i = 0; i < winnerCount; i++) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants.splice(randomIndex, 1)[0];
        winners.push(winner);
      }
      
      const winnerMentions = winners.map(id => `<@${id}>`).join(', ');
      
      const winnersEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('🎉 Giveaway Ended')
        .setDescription(`**Prize:** ${giveaway.prize}\n**Winners:** ${winnerMentions}`)
        .addFields([
          { name: '🏆 Congratulations!', value: `${winners.length} winner${winners.length > 1 ? 's' : ''} selected!`, inline: false },
          { name: '👥 Total Participants', value: (participants.length + winners.length).toString(), inline: true },
        ])
        .setFooter({ text: 'Thanks to everyone who participated!' })
        .setTimestamp();
      
      await message.edit({ embeds: [winnersEmbed], components: [] });
      
      // Send winner announcement
      await channel.send(`🎉 **Giveaway Winners** 🎉\n\nCongratulations ${winnerMentions}! You won **${giveaway.prize}**!\n\nPlease contact <@${giveaway.hostId}> to claim your prize.`);
    }
    
    // Clean up
    client.giveaways.delete(messageId);
    
  } catch (error) {
    console.error('Error ending giveaway:', error);
  }
}