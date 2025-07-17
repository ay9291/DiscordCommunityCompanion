const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Check if message starts with prefix
    const prefix = client.config.prefix;
    if (!message.content.startsWith(prefix)) return;
    
    // Parse command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Get command from collection or aliases
    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
    
    if (!command) return;
    
    // Check permissions
    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('❌ Insufficient Permissions')
          .setDescription(`You need the following permissions to use this command: ${command.permissions.join(', ')}`)
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
    }
    
    // Check cooldowns
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Map());
    }
    
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const embed = new EmbedBuilder()
          .setColor('#ffaa00')
          .setTitle('⏱️ Command Cooldown')
          .setDescription(`Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`)
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    // Execute command
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`Error executing command ${command.name}:`, error);
      
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Command Error')
        .setDescription('There was an error executing this command. Please try again later.')
        .setTimestamp();
      
      message.reply({ embeds: [embed] });
    }
  },
};

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Ignore bot messages and system messages
    if (message.author.bot || !message.guild) return;
    
    // Auto-moderation checks
    await handleAutoModeration(message, client);
    
    // XP and leveling system
    await handleXPGain(message, client);
    
    // Custom commands check
    await handleCustomCommands(message, client);
    
    // Prefix commands
    const prefix = client.config.prefix;
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Get command from collection or aliases
    const command = client.commands.get(commandName) || 
                   client.commands.get(client.aliases.get(commandName));
    
    if (!command) return;
    
    // Cooldown system
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Map());
    }
    
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('⏰ Cooldown Active')
          .setDescription(`Please wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`)
          .setTimestamp();
        
        return message.reply({ embeds: [embed], ephemeral: true });
      }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    // Permission checks
    if (command.permissions) {
      const memberPermissions = message.channel.permissionsFor(message.member);
      
      if (!memberPermissions || !memberPermissions.has(command.permissions)) {
        const embed = new EmbedBuilder()
          .setColor('#ff6b6b')
          .setTitle('❌ Insufficient Permissions')
          .setDescription(`You need the following permissions to use this command: \`${command.permissions.join(', ')}\``)
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      }
    }
    
    // Owner-only commands
    if (command.ownerOnly && message.author.id !== client.config.ownerId) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('👑 Owner Only')
        .setDescription('This command can only be used by the bot owner.')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // NSFW commands
    if (command.nsfw && !message.channel.nsfw) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('🔞 NSFW Command')
        .setDescription('This command can only be used in NSFW channels.')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    try {
      // Execute command
      await command.execute(message, args, client);
      
      // Log command usage
      console.log(`📝 ${message.author.tag} used ${command.name} in ${message.guild.name}`);
      
    } catch (error) {
      console.error(`❌ Error executing ${command.name}:`, error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Command Error')
        .setDescription('An error occurred while executing this command. Please try again later.')
        .setFooter({ text: 'If this persists, contact the bot developer.' })
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};

// Auto-moderation system
async function handleAutoModeration(message, client) {
  const guild = message.guild;
  
  // TODO: Get moderation settings from database
  const settings = {
    autoModEnabled: true,
    spamDetection: true,
    linkFilter: false,
    profanityFilter: true,
    antiInvite: true,
    capsFilter: true,
    massmentionLimit: 5
  };
  
  if (!settings.autoModEnabled) return;
  
  const content = message.content.toLowerCase();
  let violations = [];
  
  // Spam detection
  if (settings.spamDetection) {
    // Check for repeated characters
    if (/(.)\1{10,}/.test(content)) {
      violations.push('spam');
    }
  }
  
  // Link filter
  if (settings.linkFilter) {
    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    if (linkRegex.test(content)) {
      violations.push('links');
    }
  }
  
  // Discord invite filter
  if (settings.antiInvite) {
    const inviteRegex = /(discord\.gg|discordapp\.com\/invite|discord\.com\/invite)/gi;
    if (inviteRegex.test(content)) {
      violations.push('invite');
    }
  }
  
  // Caps filter
  if (settings.capsFilter) {
    const capsPercentage = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsPercentage > 0.7 && content.length > 10) {
      violations.push('caps');
    }
  }
  
  // Mass mention filter
  if (settings.massmentionLimit) {
    const mentions = message.mentions.users.size + message.mentions.roles.size;
    if (mentions > settings.massmentionLimit) {
      violations.push('massmention');
    }
  }
  
  // Profanity filter (basic implementation)
  if (settings.profanityFilter) {
    const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'damn']; // Basic list
    if (badWords.some(word => content.includes(word))) {
      violations.push('profanity');
    }
  }
  
  // Take action if violations found
  if (violations.length > 0) {
    try {
      await message.delete();
      
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('🛡️ Auto-Moderation')
        .setDescription(`Message deleted for: ${violations.join(', ')}`)
        .addFields({
          name: 'User',
          value: message.author.toString(),
          inline: true
        })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
      
    } catch (error) {
      console.error('Auto-moderation error:', error);
    }
  }
}

// XP and leveling system
async function handleXPGain(message, client) {
  // TODO: Implement XP gain system
  // Basic XP gain: 1-3 XP per message
  const xpGain = Math.floor(Math.random() * 3) + 1;
  
  // TODO: Update user profile in database
  console.log(`User ${message.author.tag} gained ${xpGain} XP`);
}

// Custom commands system
async function handleCustomCommands(message, client) {
  // TODO: Check database for custom commands
  // If message starts with trigger, execute custom response
}