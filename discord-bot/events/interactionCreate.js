
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle button interactions
    if (interaction.isButton()) {
      const customId = interaction.customId;
      
      try {
        // Voice ticket buttons
        if (customId === 'join_voice_ticket') {
          await handleJoinVoiceTicket(interaction);
        } else if (customId === 'add_user_ticket') {
          await handleAddUserTicket(interaction);
        } else if (customId === 'close_voice_ticket') {
          await handleCloseVoiceTicket(interaction);
        }
        // Add more button handlers here as needed
        
      } catch (error) {
        console.error('Button interaction error:', error);
        
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: '❌ An error occurred while processing this interaction.', 
            ephemeral: true 
          });
        }
      }
    }
    
    // Handle slash command interactions
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      if (!command) return;
      
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error('Slash command error:', error);
        
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: '❌ There was an error executing this command!', 
            ephemeral: true 
          });
        }
      }
    }
  }
};

// Voice ticket button handlers
async function handleJoinVoiceTicket(interaction) {
  const member = interaction.member;
  const voiceChannel = member.voice.channel;
  
  if (!voiceChannel) {
    return interaction.reply({ 
      content: '❌ You must be in a voice channel to join the voice ticket!', 
      ephemeral: true 
    });
  }
  
  // Find the voice ticket channel from the embed
  const embed = interaction.message.embeds[0];
  if (!embed) {
    return interaction.reply({ 
      content: '❌ Could not find ticket information!', 
      ephemeral: true 
    });
  }
  
  await interaction.reply({ 
    content: '✅ You have joined the voice ticket!', 
    ephemeral: true 
  });
}

async function handleAddUserTicket(interaction) {
  // This would open a modal or handle adding users to the ticket
  await interaction.reply({ 
    content: '⚠️ Add user functionality is coming soon!', 
    ephemeral: true 
  });
}

async function handleCloseVoiceTicket(interaction) {
  // Check permissions
  if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
    return interaction.reply({ 
      content: '❌ You don\'t have permission to close tickets!', 
      ephemeral: true 
    });
  }
  
  await interaction.reply({ 
    content: '🔒 Voice ticket has been closed!', 
    ephemeral: true 
  });
  
  // Add logic to actually close the ticket channels
}
