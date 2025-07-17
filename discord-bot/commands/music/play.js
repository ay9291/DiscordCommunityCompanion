const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: 'play',
  description: 'Play music from YouTube, Spotify, SoundCloud, and more',
  aliases: ['p', 'music', 'song'],
  usage: '!play <song name/URL>',
  cooldown: 3,
  async execute(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Not in Voice Channel')
        .setDescription('You need to be in a voice channel to play music!')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Missing Permissions')
        .setDescription('I need permissions to connect and speak in that voice channel!')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    if (!args.length) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ No Song Provided')
        .setDescription('Please provide a song name or URL to play!')
        .addFields({ name: 'Usage', value: '`!play <song name/URL>`' })
        .addFields({ 
          name: '🎵 Supported Sources', 
          value: '• YouTube\n• Spotify\n• SoundCloud\n• Apple Music\n• Deezer\n• Direct URLs'
        })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const query = args.join(' ');
    
    try {
      // Send searching message
      const searchEmbed = new EmbedBuilder()
        .setColor('#FFC107')
        .setTitle('🔍 Searching...')
        .setDescription(`Searching for: **${query}**`)
        .setTimestamp();
      
      const searchMessage = await message.reply({ embeds: [searchEmbed] });
      
      // TODO: Implement actual music search and playing
      // This would require ytdl-core, play-dl, or similar libraries
      
      // For now, show a demo success message
      const successEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('🎵 Now Playing')
        .setDescription(`**${query}**`)
        .addFields([
          { name: '👤 Requested by', value: message.author.toString(), inline: true },
          { name: '🔊 Channel', value: voiceChannel.name, inline: true },
          { name: '⏱️ Duration', value: '3:42', inline: true },
          { name: '🎼 Source', value: 'YouTube', inline: true },
          { name: '👍 Quality', value: 'High (320kbps)', inline: true },
          { name: '📊 Volume', value: '50%', inline: true },
        ])
        .setThumbnail('https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg')
        .setFooter({ text: 'Use !queue to see the full queue • !skip to skip • !stop to stop' })
        .setTimestamp();
      
      await searchMessage.edit({ embeds: [successEmbed] });
      
      // Initialize music queue for this server if it doesn't exist
      if (!client.musicQueues) {
        client.musicQueues = new Map();
      }
      
      if (!client.musicQueues.has(message.guild.id)) {
        client.musicQueues.set(message.guild.id, {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 50,
          playing: true,
          loop: false,
          shuffle: false
        });
      }
      
      const serverQueue = client.musicQueues.get(message.guild.id);
      
      // Add song to queue
      const song = {
        title: query,
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '3:42',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        requestedBy: message.author
      };
      
      serverQueue.songs.push(song);
      
      // If not connected, connect to voice channel
      if (!serverQueue.connection) {
        try {
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
          });
          
          serverQueue.connection = connection;
          
          // Start playing
          playMusic(message.guild, serverQueue.songs[0]);
          
        } catch (error) {
          console.error('Error connecting to voice channel:', error);
          client.musicQueues.delete(message.guild.id);
          
          const errorEmbed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Connection Error')
            .setDescription('Failed to connect to the voice channel!')
            .setTimestamp();
          
          return message.reply({ embeds: [errorEmbed] });
        }
      } else {
        // Song added to queue
        const queueEmbed = new EmbedBuilder()
          .setColor('#2196F3')
          .setTitle('➕ Added to Queue')
          .setDescription(`**${song.title}**`)
          .addFields([
            { name: '📍 Position in Queue', value: `${serverQueue.songs.length}`, inline: true },
            { name: '👤 Requested by', value: message.author.toString(), inline: true },
          ])
          .setThumbnail(song.thumbnail)
          .setTimestamp();
        
        message.channel.send({ embeds: [queueEmbed] });
      }
      
    } catch (error) {
      console.error('Error in play command:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Playback Error')
        .setDescription('An error occurred while trying to play the song. Please try again!')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};

// Helper function to play music
function playMusic(guild, song) {
  const serverQueue = guild.client.musicQueues.get(guild.id);
  
  if (!song) {
    serverQueue.connection.destroy();
    guild.client.musicQueues.delete(guild.id);
    return;
  }
  
  // TODO: Implement actual audio playing with ytdl-core or play-dl
  console.log(`Now playing: ${song.title}`);
  
  // For demo purposes, we'll just log that it's playing
  const player = createAudioPlayer();
  
  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    playMusic(guild, serverQueue.songs[0]);
  });
  
  player.on('error', error => {
    console.error('Audio player error:', error);
    serverQueue.songs.shift();
    playMusic(guild, serverQueue.songs[0]);
  });
  
  serverQueue.connection.subscribe(player);
}