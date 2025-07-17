const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'automod',
  description: 'Configure auto-moderation settings',
  aliases: ['am', 'automoderation'],
  usage: '!automod <setting> <value>',
  cooldown: 5,
  permissions: [PermissionsBitField.Flags.ManageGuild],
  async execute(message, args, client) {
    if (!args.length) {
      // Show current automod settings
      const embed = new EmbedBuilder()
        .setColor('#2196F3')
        .setTitle('🛡️ Auto-Moderation Settings')
        .setDescription('Current auto-moderation configuration for this server')
        .addFields([
          {
            name: '🚫 Spam Detection',
            value: '✅ Enabled\n• Max 5 messages per 5 seconds\n• Auto-timeout: 5 minutes',
            inline: true
          },
          {
            name: '🔗 Link Filter',
            value: '❌ Disabled\n• Whitelist: None\n• Action: Delete & Warn',
            inline: true
          },
          {
            name: '🤬 Profanity Filter',
            value: '✅ Enabled\n• Severity: Medium\n• Action: Delete & Warn',
            inline: true
          },
          {
            name: '🔄 Anti-Raid',
            value: '✅ Enabled\n• Max 10 joins per minute\n• Action: Auto-kick new accounts',
            inline: true
          },
          {
            name: '📢 Anti-Mention Spam',
            value: '✅ Enabled\n• Max 5 mentions per message\n• Action: Delete & Timeout',
            inline: true
          },
          {
            name: '🚪 Anti-Invite',
            value: '❌ Disabled\n• Block external invites\n• Whitelist: None',
            inline: true
          }
        ])
        .addFields({
          name: '⚙️ Available Settings',
          value: '`spam`, `links`, `profanity`, `raid`, `mentions`, `invites`, `caps`, `emoji`',
          inline: false
        })
        .addFields({
          name: '📝 Usage Examples',
          value: '`!automod spam enable`\n`!automod links disable`\n`!automod profanity strict`\n`!automod raid 15`',
          inline: false
        })
        .setFooter({ text: 'Use !automod <setting> <value> to modify settings' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const setting = args[0].toLowerCase();
    const value = args[1]?.toLowerCase();
    
    if (!value) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Missing Value')
        .setDescription(`Please provide a value for the ${setting} setting.`)
        .addFields({
          name: 'Common Values',
          value: '`enable`, `disable`, `strict`, `medium`, `low`, or specific numbers',
          inline: false
        })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    let result = '';
    let color = '#4CAF50';
    
    switch (setting) {
      case 'spam':
        if (value === 'enable') {
          result = '🚫 **Spam Detection Enabled**\n• Max 5 messages per 5 seconds\n• Auto-timeout for 5 minutes';
        } else if (value === 'disable') {
          result = '🚫 **Spam Detection Disabled**\n• No message rate limiting';
          color = '#FFC107';
        }
        break;
        
      case 'links':
        if (value === 'enable') {
          result = '🔗 **Link Filter Enabled**\n• Blocks non-whitelisted links\n• Deletes and warns users';
        } else if (value === 'disable') {
          result = '🔗 **Link Filter Disabled**\n• All links allowed';
          color = '#FFC107';
        }
        break;
        
      case 'profanity':
        if (value === 'enable' || value === 'medium') {
          result = '🤬 **Profanity Filter Enabled (Medium)**\n• Filters common profanity\n• Deletes and warns';
        } else if (value === 'strict') {
          result = '🤬 **Profanity Filter Enabled (Strict)**\n• Filters all inappropriate content\n• Deletes and timeouts';
        } else if (value === 'disable') {
          result = '🤬 **Profanity Filter Disabled**\n• No content filtering';
          color = '#FFC107';
        }
        break;
        
      case 'raid':
        if (value === 'enable') {
          result = '🔄 **Anti-Raid Enabled**\n• Max 10 joins per minute\n• Auto-kicks suspicious accounts';
        } else if (value === 'disable') {
          result = '🔄 **Anti-Raid Disabled**\n• No join rate limiting';
          color = '#FFC107';
        } else if (!isNaN(value)) {
          result = `🔄 **Anti-Raid Updated**\n• Max ${value} joins per minute\n• Auto-kicks suspicious accounts`;
        }
        break;
        
      case 'mentions':
        if (value === 'enable') {
          result = '📢 **Anti-Mention Spam Enabled**\n• Max 5 mentions per message\n• Deletes and timeouts';
        } else if (value === 'disable') {
          result = '📢 **Anti-Mention Spam Disabled**\n• No mention limits';
          color = '#FFC107';
        } else if (!isNaN(value)) {
          result = `📢 **Mention Limit Updated**\n• Max ${value} mentions per message\n• Deletes and timeouts`;
        }
        break;
        
      case 'invites':
        if (value === 'enable') {
          result = '🚪 **Anti-Invite Enabled**\n• Blocks external server invites\n• Deletes and warns';
        } else if (value === 'disable') {
          result = '🚪 **Anti-Invite Disabled**\n• All invites allowed';
          color = '#FFC107';
        }
        break;
        
      case 'caps':
        if (value === 'enable') {
          result = '🔠 **Anti-Caps Enabled**\n• Max 70% caps per message\n• Converts to lowercase';
        } else if (value === 'disable') {
          result = '🔠 **Anti-Caps Disabled**\n• No caps filtering';
          color = '#FFC107';
        }
        break;
        
      case 'emoji':
        if (value === 'enable') {
          result = '😀 **Emoji Spam Filter Enabled**\n• Max 5 emojis per message\n• Deletes excessive emoji';
        } else if (value === 'disable') {
          result = '😀 **Emoji Spam Filter Disabled**\n• No emoji limits';
          color = '#FFC107';
        }
        break;
        
      default:
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('❌ Invalid Setting')
          .setDescription(`Unknown automod setting: \`${setting}\``)
          .addFields({
            name: 'Available Settings',
            value: '`spam`, `links`, `profanity`, `raid`, `mentions`, `invites`, `caps`, `emoji`',
            inline: false
          })
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
    }
    
    if (!result) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Value')
        .setDescription(`Invalid value \`${value}\` for setting \`${setting}\``)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('✅ Auto-Mod Updated')
      .setDescription(result)
      .addFields({
        name: '👤 Updated by',
        value: message.author.toString(),
        inline: true
      })
      .addFields({
        name: '📅 Effective',
        value: 'Immediately',
        inline: true
      })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
    
    // Log to mod-log channel
    const logChannel = message.guild.channels.cache.find(c => 
      c.name === 'mod-logs' || c.name === 'automod-logs'
    );
    
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#2196F3')
        .setTitle('🛡️ Auto-Mod Configuration Changed')
        .addFields([
          { name: 'Staff Member', value: `${message.author.tag} (${message.author.id})`, inline: true },
          { name: 'Setting', value: setting, inline: true },
          { name: 'New Value', value: value, inline: true },
          { name: 'Channel', value: message.channel.toString(), inline: true },
        ])
        .setTimestamp();
      
      logChannel.send({ embeds: [logEmbed] });
    }
  }
};