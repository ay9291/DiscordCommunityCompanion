const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows all available commands and bot information',
  aliases: ['h', 'commands', 'cmds'],
  usage: '!help [command]',
  cooldown: 3,
  async execute(message, args, client) {
    if (args[0]) {
      // Show specific command help
      const commandName = args[0].toLowerCase();
      const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
      
      if (!command) {
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('❌ Command Not Found')
          .setDescription(`No command found with name \`${commandName}\``)
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
      
      const embed = new EmbedBuilder()
        .setColor(client.config.defaultEmbedColor)
        .setTitle(`📖 Command: ${command.name}`)
        .setDescription(command.description || 'No description available')
        .addFields([
          { name: '📝 Usage', value: `\`${command.usage || `${client.config.prefix}${command.name}`}\``, inline: true },
          { name: '⏰ Cooldown', value: `${command.cooldown || 3} seconds`, inline: true },
          { name: '🔄 Aliases', value: command.aliases ? command.aliases.map(a => `\`${a}\``).join(', ') : 'None', inline: false },
        ])
        .setTimestamp();
      
      if (command.permissions) {
        embed.addFields({ name: '🔒 Required Permissions', value: command.permissions.join(', '), inline: false });
      }
      
      return message.reply({ embeds: [embed] });
    }
    
    // Main help menu with categories
    const categories = {
      'General': ['help', 'info', 'ping', 'uptime', 'stats', 'invite', 'support'],
      'Moderation': ['ban', 'kick', 'mute', 'unmute', 'warn', 'timeout', 'purge', 'lock', 'unlock', 'slowmode'],
      'Music': ['play', 'stop', 'skip', 'queue', 'volume', 'pause', 'resume', 'loop', 'shuffle', 'nowplaying'],
      'Economy': ['balance', 'daily', 'weekly', 'work', 'crime', 'rob', 'pay', 'shop', 'buy', 'inventory'],
      'Leveling': ['rank', 'leaderboard', 'setlevel', 'addxp', 'resetlevel'],
      'Tickets': ['ticket', 'vticket', 'close', 'add', 'remove', 'claim'],
      'Reaction Roles': ['reactionrole', 'rr', 'addreaction', 'removereaction'],
      'Giveaways': ['giveaway', 'gstart', 'gend', 'greroll', 'glist'],
      'Fun': ['meme', '8ball', 'joke', 'fact', 'quote', 'coinflip', 'dice', 'rps'],
      'Utility': ['avatar', 'userinfo', 'serverinfo', 'channelinfo', 'roleinfo', 'weather', 'translate'],
      'NSFW': ['nsfw commands available in NSFW channels'],
      'Games': ['trivia', 'wordle', 'hangman', 'tictactoe', 'blackjack', 'slots'],
      'AI & Chat': ['ai', 'chat', 'imagine', 'analyze'],
      'Custom Commands': ['addcommand', 'removecommand', 'editcommand', 'listcommands'],
      'Auto-Moderation': ['automod', 'whitelist', 'blacklist', 'filters'],
      'Verification': ['verify', 'unverify', 'verifysetup'],
      'Configuration': ['config', 'prefix', 'welcome', 'goodbye', 'autorole', 'logging']
    };
    
    const embed = new EmbedBuilder()
      .setColor(client.config.defaultEmbedColor)
      .setTitle('🤖 BotMaster Pro - Command Center')
      .setDescription(`**The Ultimate All-in-One Discord Bot**
      
Welcome to BotMaster Pro! I'm packed with every feature you could ever need for your Discord server.

**🔧 Quick Start:**
• Use \`${client.config.prefix}help [command]\` for detailed command info
• Use the dropdown below to explore categories
• Default prefix: \`${client.config.prefix}\`

**📊 Bot Stats:**
• **Servers:** ${client.guilds.cache.size}
• **Users:** ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}
• **Commands:** ${client.commands.size}
• **Uptime:** ${formatUptime(client.uptime)}`)
      .addFields([
        { 
          name: '🌟 Featured Commands', 
          value: '`!ticket` - Support tickets\n`!vticket @user` - Voice tickets\n`!play [song]` - Music player\n`!giveaway` - Host giveaways\n`!verify` - Verification system', 
          inline: true 
        },
        { 
          name: '🎯 Categories', 
          value: Object.keys(categories).length + ' command categories available\nUse the dropdown below to explore!', 
          inline: true 
        }
      ])
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'BotMaster Pro • The most comprehensive Discord bot' })
      .setTimestamp();
    
    // Create dropdown menu for categories
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_category')
      .setPlaceholder('🔍 Select a category to explore commands')
      .addOptions(
        Object.keys(categories).map(category => ({
          label: category,
          value: category.toLowerCase(),
          description: `View all ${category.toLowerCase()} commands`,
          emoji: getCategoryEmoji(category)
        }))
      );
    
    const row = new ActionRowBuilder().addComponents(selectMenu);
    
    await message.reply({ embeds: [embed], components: [row] });
  }
};

function formatUptime(uptime) {
  const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
  const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${days}d ${hours}h ${minutes}m`;
}

function getCategoryEmoji(category) {
  const emojis = {
    'General': '📋',
    'Moderation': '🛡️',
    'Music': '🎵',
    'Economy': '💰',
    'Leveling': '📈',
    'Tickets': '🎫',
    'Reaction Roles': '⚡',
    'Giveaways': '🎉',
    'Fun': '🎪',
    'Utility': '🔧',
    'NSFW': '🔞',
    'Games': '🎮',
    'AI & Chat': '🤖',
    'Custom Commands': '⚙️',
    'Auto-Moderation': '🚫',
    'Verification': '✅',
    'Configuration': '⚙️'
  };
  
  return emojis[category] || '📁';
}