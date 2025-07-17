const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`🚀 ${client.user.tag} is online and ready!`);
    console.log(`📊 Connected to ${client.guilds.cache.size} servers`);
    console.log(`👥 Serving ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`);
    console.log(`📂 Loaded ${client.commands.size} commands`);
    
    // Set bot status and activity
    const activities = [
      { name: `${client.config.prefix}help | BotMaster Pro`, type: ActivityType.Playing },
      { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
      { name: 'Discord Servers', type: ActivityType.Listening },
      { name: 'with slash commands', type: ActivityType.Playing },
      { name: 'server moderation', type: ActivityType.Watching },
      { name: 'music for everyone', type: ActivityType.Listening },
      { name: 'economy systems', type: ActivityType.Playing },
      { name: 'for new members', type: ActivityType.Watching },
    ];
    
    let activityIndex = 0;
    
    const updateActivity = () => {
      client.user.setActivity(activities[activityIndex]);
      activityIndex = (activityIndex + 1) % activities.length;
    };
    
    // Initial activity
    updateActivity();
    
    // Change activity every 30 seconds
    setInterval(updateActivity, 30000);
    
    // Log some stats
    console.log('\n📈 Bot Statistics:');
    console.log(`   Servers: ${client.guilds.cache.size}`);
    console.log(`   Users: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`);
    console.log(`   Channels: ${client.channels.cache.size}`);
    console.log(`   Commands: ${client.commands.size}`);
    console.log(`   Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Node.js Version: ${process.version}`);
    console.log(`   Discord.js Version: ${require('discord.js').version}`);
    
    console.log('\n✅ All systems operational!\n');
  }
};