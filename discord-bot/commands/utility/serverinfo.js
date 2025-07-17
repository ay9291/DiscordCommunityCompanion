const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Display detailed information about the server',
  aliases: ['guildinfo', 'server', 'guild'],
  usage: '!serverinfo',
  cooldown: 5,
  async execute(message, args, client) {
    const guild = message.guild;
    
    // Calculate various statistics
    const totalMembers = guild.memberCount;
    const humans = guild.members.cache.filter(member => !member.user.bot).size;
    const bots = guild.members.cache.filter(member => member.user.bot).size;
    
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;
    
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
    
    // Get server features
    const features = guild.features.length > 0 ? guild.features.map(feature => {
      return feature.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }).join(', ') : 'None';
    
    // Determine server level based on member count
    let serverLevel = '';
    if (totalMembers >= 100000) serverLevel = '🏆 Massive';
    else if (totalMembers >= 50000) serverLevel = '💎 Huge';
    else if (totalMembers >= 10000) serverLevel = '🌟 Large';
    else if (totalMembers >= 1000) serverLevel = '📈 Growing';
    else if (totalMembers >= 100) serverLevel = '🌱 Medium';
    else serverLevel = '🏠 Small';
    
    const embed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle(`🏰 ${guild.name} Server Information`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .addFields([
        {
          name: '📊 General Info',
          value: `**Name:** ${guild.name}\n**ID:** ${guild.id}\n**Owner:** <@${guild.ownerId}>\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>\n**Level:** ${serverLevel}`,
          inline: true
        },
        {
          name: '👥 Members',
          value: `**Total:** ${totalMembers.toLocaleString()}\n**Humans:** ${humans.toLocaleString()}\n**Bots:** ${bots.toLocaleString()}\n**Online:** ${onlineMembers.toLocaleString()}`,
          inline: true
        },
        {
          name: '📺 Channels',
          value: `**Text:** ${textChannels}\n**Voice:** ${voiceChannels}\n**Categories:** ${categories}\n**Total:** ${textChannels + voiceChannels}`,
          inline: true
        },
        {
          name: '🎭 Roles',
          value: `**Count:** ${guild.roles.cache.size}\n**Highest:** ${guild.roles.highest.name}\n**@everyone:** ${guild.roles.everyone.members.size} members`,
          inline: true
        },
        {
          name: '🎉 Emojis & Stickers',
          value: `**Emojis:** ${guild.emojis.cache.size}\n**Animated:** ${guild.emojis.cache.filter(e => e.animated).size}\n**Stickers:** ${guild.stickers.cache.size}`,
          inline: true
        },
        {
          name: '🔐 Security',
          value: `**Verification:** ${getVerificationLevel(guild.verificationLevel)}\n**Filter:** ${getExplicitFilter(guild.explicitContentFilter)}\n**MFA:** ${guild.mfaLevel === 1 ? 'Required' : 'Not Required'}`,
          inline: true
        }
      ])
      .setFooter({ text: `Server ID: ${guild.id} • Requested by ${message.author.username}` })
      .setTimestamp();
    
    // Add banner if available
    if (guild.bannerURL()) {
      embed.setImage(guild.bannerURL({ dynamic: true, size: 512 }));
    }
    
    // Add features if any
    if (guild.features.length > 0) {
      embed.addFields({
        name: '⭐ Server Features',
        value: features,
        inline: false
      });
    }
    
    // Add boost information
    if (guild.premiumSubscriptionCount > 0) {
      embed.addFields({
        name: '💎 Nitro Boosts',
        value: `**Level:** ${guild.premiumTier}\n**Boosts:** ${guild.premiumSubscriptionCount}\n**Boosters:** ${guild.members.cache.filter(m => m.premiumSince).size}`,
        inline: true
      });
    }
    
    message.reply({ embeds: [embed] });
  }
};

function getVerificationLevel(level) {
  const levels = {
    0: 'None',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Very High'
  };
  return levels[level] || 'Unknown';
}

function getExplicitFilter(level) {
  const levels = {
    0: 'Disabled',
    1: 'No Role',
    2: 'Everyone'
  };
  return levels[level] || 'Unknown';
}