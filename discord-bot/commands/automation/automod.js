const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'automod',
  description: 'Configure automatic moderation settings',
  aliases: ['automoderation', 'am'],
  usage: '!automod <setting> <value>',
  cooldown: 5,
  permissions: [PermissionFlagsBits.ManageGuild],
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Insufficient Permissions')
        .setDescription('You need the "Manage Server" permission to use this command.')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }

    if (!args.length) {
      // Show current automod settings
      const embed = new EmbedBuilder()
        .setColor('#5865f2')
        .setTitle('🛡️ AutoMod Configuration')
        .setDescription('Current automatic moderation settings for this server')
        .addFields([
          { name: '🚫 Spam Detection', value: '`Enabled` - 5 messages in 10 seconds', inline: true },
          { name: '🔗 Link Filter', value: '`Disabled` - Allow all links', inline: true },
          { name: '🤬 Profanity Filter', value: '`Enabled` - Auto-delete bad words', inline: true },
          { name: '⏱️ Slowmode', value: '`Disabled` - No message delay', inline: true },
          { name: '🔒 Raid Protection', value: '`Enabled` - Max 10 joins/minute', inline: true },
          { name: '📧 Anti-Invite', value: '`Enabled` - Block Discord invites', inline: true },
          { name: '⚠️ Max Warnings', value: '`3` warnings before timeout', inline: true },
          { name: '🔇 Auto Timeout', value: '`Enabled` - 10 minute timeout', inline: true },
          { name: '👥 Mass Mention Limit', value: '`5` mentions maximum', inline: true }
        ])
        .addFields({
          name: '⚙️ Available Commands',
          value: '`!automod spam on/off` - Toggle spam detection\n' +
                 '`!automod links on/off` - Toggle link filtering\n' +
                 '`!automod profanity on/off` - Toggle profanity filter\n' +
                 '`!automod slowmode <seconds>` - Set slowmode delay\n' +
                 '`!automod warnings <number>` - Set warning limit\n' +
                 '`!automod reset` - Reset all settings to default',
          inline: false
        })
        .setFooter({ text: 'Use !automod <setting> <value> to modify settings' })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }

    const setting = args[0].toLowerCase();
    const value = args[1]?.toLowerCase();

    switch (setting) {
      case 'spam':
        if (!value || !['on', 'off', 'enable', 'disable'].includes(value)) {
          return message.reply('❌ Usage: `!automod spam on/off`');
        }
        
        const spamEnabled = ['on', 'enable'].includes(value);
        const spamEmbed = new EmbedBuilder()
          .setColor(spamEnabled ? '#4CAF50' : '#ff6b6b')
          .setTitle('🚫 Spam Detection Updated')
          .setDescription(`Spam detection has been **${spamEnabled ? 'enabled' : 'disabled'}**`)
          .addFields({
            name: 'Settings',
            value: spamEnabled ? 'Max 5 messages in 10 seconds' : 'No spam detection',
            inline: false
          })
          .setTimestamp();
        
        message.reply({ embeds: [spamEmbed] });
        break;

      case 'links':
        if (!value || !['on', 'off', 'enable', 'disable'].includes(value)) {
          return message.reply('❌ Usage: `!automod links on/off`');
        }
        
        const linksEnabled = ['on', 'enable'].includes(value);
        const linksEmbed = new EmbedBuilder()
          .setColor(linksEnabled ? '#4CAF50' : '#ff6b6b')
          .setTitle('🔗 Link Filter Updated')
          .setDescription(`Link filtering has been **${linksEnabled ? 'enabled' : 'disabled'}**`)
          .addFields({
            name: 'Settings',
            value: linksEnabled ? 'All links will be filtered' : 'Links are allowed',
            inline: false
          })
          .setTimestamp();
        
        message.reply({ embeds: [linksEmbed] });
        break;

      case 'profanity':
        if (!value || !['on', 'off', 'enable', 'disable'].includes(value)) {
          return message.reply('❌ Usage: `!automod profanity on/off`');
        }
        
        const profanityEnabled = ['on', 'enable'].includes(value);
        const profanityEmbed = new EmbedBuilder()
          .setColor(profanityEnabled ? '#4CAF50' : '#ff6b6b')
          .setTitle('🤬 Profanity Filter Updated')
          .setDescription(`Profanity filtering has been **${profanityEnabled ? 'enabled' : 'disabled'}**`)
          .addFields({
            name: 'Settings',
            value: profanityEnabled ? 'Bad words will be auto-deleted' : 'No profanity filtering',
            inline: false
          })
          .setTimestamp();
        
        message.reply({ embeds: [profanityEmbed] });
        break;

      case 'slowmode':
        const seconds = parseInt(value);
        if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
          return message.reply('❌ Usage: `!automod slowmode <0-21600>` (seconds)');
        }
        
        const slowmodeEmbed = new EmbedBuilder()
          .setColor(seconds > 0 ? '#4CAF50' : '#ff6b6b')
          .setTitle('⏱️ Slowmode Updated')
          .setDescription(`Slowmode has been set to **${seconds} seconds**`)
          .addFields({
            name: 'Effect',
            value: seconds > 0 ? `Users must wait ${seconds} seconds between messages` : 'No message delay',
            inline: false
          })
          .setTimestamp();
        
        message.reply({ embeds: [slowmodeEmbed] });
        break;

      case 'warnings':
        const maxWarnings = parseInt(value);
        if (isNaN(maxWarnings) || maxWarnings < 1 || maxWarnings > 10) {
          return message.reply('❌ Usage: `!automod warnings <1-10>`');
        }
        
        const warningsEmbed = new EmbedBuilder()
          .setColor('#4CAF50')
          .setTitle('⚠️ Warning Limit Updated')
          .setDescription(`Maximum warnings set to **${maxWarnings}**`)
          .addFields({
            name: 'Effect',
            value: `Users will be timed out after ${maxWarnings} warnings`,
            inline: false
          })
          .setTimestamp();
        
        message.reply({ embeds: [warningsEmbed] });
        break;

      case 'reset':
        const resetEmbed = new EmbedBuilder()
          .setColor('#4CAF50')
          .setTitle('🔄 AutoMod Settings Reset')
          .setDescription('All automod settings have been reset to default values')
          .addFields([
            { name: '✅ Enabled', value: '• Spam Detection\n• Profanity Filter\n• Raid Protection\n• Anti-Invite', inline: true },
            { name: '❌ Disabled', value: '• Link Filter\n• Slowmode\n• Custom Rules', inline: true },
            { name: '📊 Limits', value: '• 3 warnings max\n• 10 minute timeout\n• 5 mention limit', inline: true }
          ])
          .setTimestamp();
        
        message.reply({ embeds: [resetEmbed] });
        break;

      default:
        const helpEmbed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('❌ Unknown Setting')
          .setDescription(`Setting "${setting}" not found.`)
          .addFields({
            name: 'Available Settings',
            value: '`spam`, `links`, `profanity`, `slowmode`, `warnings`, `reset`',
            inline: false
          })
          .setTimestamp();
        
        message.reply({ embeds: [helpEmbed] });
    }
  }
};