const { EmbedBuilder, PermissionsBitField, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'ticket',
  description: 'Create a support ticket',
  aliases: ['support', 'help-ticket'],
  usage: '!ticket [reason]',
  cooldown: 30,
  async execute(message, args, client) {
    const guild = message.guild;
    const member = message.member;
    
    // Check if user already has an open ticket
    const existingTicket = guild.channels.cache.find(c => 
      c.name === `ticket-${member.user.username.toLowerCase()}` && 
      c.type === ChannelType.GuildText
    );
    
    if (existingTicket) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Ticket Already Exists')
        .setDescription(`You already have an open ticket: ${existingTicket}`)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    try {
      // Get or create tickets category
      let category = guild.channels.cache.find(c => c.name === 'Tickets' && c.type === ChannelType.GuildCategory);
      
      if (!category) {
        category = await guild.channels.create({
          name: 'Tickets',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        });
      }
      
      // Create ticket channel
      const ticketChannel = await guild.channels.create({
        name: `ticket-${member.user.username.toLowerCase()}`,
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
      
      // Add staff permissions
      const staffRoles = ['Administrator', 'Moderator', 'Staff', 'Support'];
      for (const roleName of staffRoles) {
        const role = guild.roles.cache.find(r => r.name === roleName);
        if (role) {
          await ticketChannel.permissionOverwrites.create(role, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
          });
        }
      }
      
      // Create ticket embed and buttons
      const reason = args.join(' ') || 'No reason provided';
      
      const ticketEmbed = new EmbedBuilder()
        .setColor(client.config.defaultEmbedColor)
        .setTitle('🎫 Support Ticket Created')
        .setDescription(`Hello ${member}! Your ticket has been created.`)
        .addFields([
          { name: '📝 Reason', value: reason, inline: false },
          { name: '👤 User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: '📅 Created', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        ])
        .setFooter({ text: 'Please wait for staff to respond. You can close this ticket using the button below.' })
        .setTimestamp();
      
      const closeButton = new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close Ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger);
      
      const claimButton = new ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('Claim Ticket')
        .setEmoji('✋')
        .setStyle(ButtonStyle.Primary);
      
      const row = new ActionRowBuilder().addComponents(claimButton, closeButton);
      
      await ticketChannel.send({ 
        content: `${member} | Staff will be with you shortly!`,
        embeds: [ticketEmbed], 
        components: [row] 
      });
      
      // Send confirmation to user
      const confirmEmbed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('✅ Ticket Created')
        .setDescription(`Your ticket has been created: ${ticketChannel}`)
        .setTimestamp();
      
      message.reply({ embeds: [confirmEmbed] });
      
      // Log to staff channel
      const logChannel = guild.channels.cache.find(c => c.name === 'ticket-logs' || c.name === 'mod-logs');
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#2196F3')
          .setTitle('🎫 New Ticket Created')
          .addFields([
            { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
            { name: 'Channel', value: ticketChannel.toString(), inline: true },
            { name: 'Reason', value: reason, inline: false },
          ])
          .setTimestamp();
        
        logChannel.send({ embeds: [logEmbed] });
      }
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Error')
        .setDescription('Failed to create ticket. Please contact an administrator.')
        .setTimestamp();
      
      message.reply({ embeds: [errorEmbed] });
    }
  }
};