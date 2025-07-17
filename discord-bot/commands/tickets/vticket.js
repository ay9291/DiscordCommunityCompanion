const { EmbedBuilder, PermissionsBitField, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'vticket',
  description: 'Create a voice ticket with both voice and text channels',
  aliases: ['voiceticket', 'voice-ticket'],
  usage: '!vticket @user [reason]',
  cooldown: 30,
  permissions: [PermissionsBitField.Flags.ManageChannels],
  async execute(message, args, client) {
    const guild = message.guild;
    const member = message.member;
    
    // Check if user has required roles
    const allowedRoles = ['Staff', 'Moderator', 'Administrator', 'VIP', 'Premium'];
    const hasRole = member.roles.cache.some(role => allowedRoles.includes(role.name));
    
    if (!hasRole && !member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Insufficient Permissions')
        .setDescription(`You need one of these roles to use voice tickets: ${allowedRoles.join(', ')}`)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // Get mentioned user
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ User Required')
        .setDescription('Please mention a user to create a voice ticket with.\n\n**Usage:** `!vticket @user [reason]`')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const targetMember = guild.members.cache.get(targetUser.id);
    if (!targetMember) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ User Not Found')
        .setDescription('The mentioned user is not in this server.')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // Check if voice ticket already exists for these users
    const existingVoiceTicket = guild.channels.cache.find(c => 
      c.name.includes(`voice-ticket-${member.user.username.toLowerCase()}`) ||
      c.name.includes(`voice-ticket-${targetUser.username.toLowerCase()}`)
    );
    
    if (existingVoiceTicket) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Voice Ticket Already Exists')
        .setDescription(`A voice ticket already exists involving one of these users.`)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    try {
      // Get or create voice tickets category
      let category = guild.channels.cache.find(c => c.name === 'Voice Tickets' && c.type === ChannelType.GuildCategory);
      
      if (!category) {
        category = await guild.channels.create({
          name: 'Voice Tickets',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        });
      }
      
      const channelName = `voice-ticket-${member.user.username.toLowerCase()}-${targetUser.username.toLowerCase()}`;
      
      // Create voice channel
      const voiceChannel = await guild.channels.create({
        name: `🔊 ${channelName}`,
        type: ChannelType.GuildVoice,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
          },
          {
            id: member.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.Speak,
              PermissionsBitField.Flags.UseVAD,
            ],
          },
          {
            id: targetUser.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.Speak,
              PermissionsBitField.Flags.UseVAD,
            ],
          },
          {
            id: client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.Connect,
            ],
          },
        ],
      });
      
      // Create text channel
      const textChannel = await guild.channels.create({
        name: `💬-${channelName}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: member.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
              PermissionsBitField.Flags.EmbedLinks,
              PermissionsBitField.Flags.AttachFiles,
            ],
          },
          {
            id: targetUser.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
              PermissionsBitField.Flags.EmbedLinks,
              PermissionsBitField.Flags.AttachFiles,
            ],
          },
          {
            id: client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ManageChannels,
            ],
          },
        ],
      });
      
      // Add staff permissions to both channels
      const staffRoles = ['Administrator', 'Moderator', 'Staff', 'Support'];
      for (const roleName of staffRoles) {
        const role = guild.roles.cache.find(r => r.name === roleName);
        if (role) {
          await voiceChannel.permissionOverwrites.create(role, {
            ViewChannel: true,
            Connect: true,
            Speak: true,
            MuteMembers: true,
            DeafenMembers: true,
          });
          
          await textChannel.permissionOverwrites.create(role, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true,
          });
        }
      }
      
      // Create ticket embed and buttons
      const reason = args.slice(1).join(' ') || 'No reason provided';
      
      const ticketEmbed = new EmbedBuilder()
        .setColor(client.config.defaultEmbedColor)
        .setTitle('🎤 Voice Ticket Created')
        .setDescription(`Voice ticket created between ${member} and ${targetMember}`)
        .addFields([
          { name: '📝 Reason', value: reason, inline: false },
          { name: '🔊 Voice Channel', value: voiceChannel.toString(), inline: true },
          { name: '💬 Text Channel', value: textChannel.toString(), inline: true },
          { name: '👥 Participants', value: `${member.user.tag}\n${targetUser.tag}`, inline: true },
          { name: '📅 Created', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        ])
        .setFooter({ text: 'Use the buttons below to manage this voice ticket.' })
        .setTimestamp();
      
      const joinVoiceButton = new ButtonBuilder()
        .setCustomId('join_voice_ticket')
        .setLabel('Join Voice')
        .setEmoji('🔊')
        .setStyle(ButtonStyle.Success);
      
      const closeTicketButton = new ButtonBuilder()
        .setCustomId('close_voice_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger);
      
      const addUserButton = new ButtonBuilder()
        .setCustomId('add_user_voice_ticket')
        .setLabel('Add User')
        .setEmoji('➕')
        .setStyle(ButtonStyle.Secondary);
      
      const row = new ActionRowBuilder().addComponents(joinVoiceButton, addUserButton, closeTicketButton);
      
      // Send initial message to text channel
      await textChannel.send({ 
        content: `${member} ${targetMember} | Your voice ticket is ready!`,
        embeds: [ticketEmbed], 
        components: [row] 
      });
      
      // Send confirmation to original channel
      const confirmEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('✅ Voice Ticket Created')
        .setDescription(`Voice ticket created successfully!\n\n🔊 **Voice:** ${voiceChannel}\n💬 **Text:** ${textChannel}\n\n👥 **Participants:** ${member} & ${targetMember}`)
        .setTimestamp();
      
      message.reply({ embeds: [confirmEmbed] });
      
      // Log to staff channel
      const logChannel = guild.channels.cache.find(c => c.name === 'ticket-logs' || c.name === 'mod-logs');
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#9C27B0')
          .setTitle('🎤 Voice Ticket Created')
          .addFields([
            { name: 'Created By', value: `${member.user.tag} (${member.user.id})`, inline: true },
            { name: 'With User', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
            { name: 'Voice Channel', value: voiceChannel.toString(), inline: true },
            { name: 'Text Channel', value: textChannel.toString(), inline: true },
            { name: 'Reason', value: reason, inline: false },
          ])
          .setTimestamp();
        
        logChannel.send({ embeds: [logEmbed] });
      }
      
      // Auto-join voice channel notification
      const joinEmbed = new EmbedBuilder()
        .setColor('#2196F3')
        .setTitle('🔊 Ready to Talk!')
        .setDescription(`Both users can now join the voice channel: ${voiceChannel}\n\nThis is your private conversation space with text and voice capabilities.`)
        .addFields([
          { name: '💡 Tips', value: '• Use the text channel for links and files\n• Staff can join if needed\n• Close the ticket when finished', inline: false }
        ])
        .setTimestamp();
      
      setTimeout(() => {
        textChannel.send({ embeds: [joinEmbed] });
      }, 2000);
      
    } catch (error) {
      console.error('Error creating voice ticket:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Error')
        .setDescription('Failed to create voice ticket. Please check my permissions and try again.')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};