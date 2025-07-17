const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Create Discord client with all intents for maximum functionality
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
});

// Initialize command collections
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();

// Bot configuration
client.config = {
  prefix: process.env.PREFIX || '!',
  token: process.env.DISCORD_BOT_TOKEN,
  ownerId: process.env.OWNER_ID || '',
  supportServerId: process.env.SUPPORT_SERVER_ID || '',
  defaultEmbedColor: '#7289da',
  version: '3.0.0',
  features: {
    moderation: true,
    music: true,
    economy: true,
    leveling: true,
    tickets: true,
    verification: true,
    reactionRoles: true,
    giveaways: true,
    customCommands: true,
    aiChat: false, // Enable when OpenAI API key is provided
    autoModeration: true,
    voiceTickets: true,
  }
};

// Database connection (placeholder for actual database)
client.database = {
  // This would be replaced with actual database connection
  connected: false,
  connection: null,
};

// Load command handlers
const loadCommands = () => {
  const loadCommandsFromFolder = (folderPath) => {
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Recursively load commands from subdirectories
        loadCommandsFromFolder(itemPath);
      } else if (item.endsWith('.js')) {
        try {
          const command = require(path.resolve(itemPath));
          
          if (command.name) {
            client.commands.set(command.name, command);
            
            if (command.aliases && Array.isArray(command.aliases)) {
              command.aliases.forEach(alias => {
                client.aliases.set(alias, command.name);
              });
            }
            
            console.log(`✅ Loaded command: ${command.name}`);
          }
        } catch (error) {
          console.error(`❌ Error loading command ${item}:`, error);
        }
      }
    }
  };
  
  loadCommandsFromFolder('./commands');
};

// Load event handlers
const loadEvents = () => {
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    
    console.log(`✅ Loaded event: ${event.name}`);
  }
};

// Load utility functions
const loadUtils = () => {
  const utilFiles = fs.readdirSync('./utils').filter(file => file.endsWith('.js'));
  
  client.utils = {};
  
  for (const file of utilFiles) {
    const utilName = file.replace('.js', '');
    client.utils[utilName] = require(`./utils/${file}`);
    console.log(`✅ Loaded utility: ${utilName}`);
  }
};

// Initialize bot
const init = async () => {
  console.log('🤖 BotMaster Pro - Ultimate Discord Bot');
  console.log('📊 Loading all systems...\n');
  
  try {
    // Load all components
    loadUtils();
    loadCommands();
    loadEvents();
    
    console.log('\n🚀 All systems loaded successfully!');
    console.log('🔑 Logging in to Discord...\n');
    
    // Login to Discord
    await client.login(client.config.token);
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  }
};

// Error handling
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot gracefully...');
  client.destroy();
  process.exit(0);
});

// Start the bot
init();

module.exports = client;