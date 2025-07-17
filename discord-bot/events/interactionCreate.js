
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle button interactions
    if (interaction.isButton()) {
      const customId = interaction.customId;
      
      try {
        // Verification button interactions
        if (customId === 'verify_basic') {
          await handleBasicVerification(interaction);
        } else if (customId === 'verify_id') {
          await handleIDVerification(interaction);
        } else if (customId === 'verify_rules') {
          await handleRulesAcceptance(interaction);
        }
        // Voice ticket buttons
        else if (customId === 'join_voice_ticket') {
          await handleJoinVoiceTicket(interaction);
        } else if (customId === 'add_user_ticket') {
          await handleAddUserTicket(interaction);
        } else if (customId === 'close_voice_ticket') {
          await handleCloseVoiceTicket(interaction);
        }
        // Ticket buttons
        else if (customId === 'create_ticket') {
          await handleCreateTicket(interaction);
        } else if (customId === 'close_ticket') {
          await handleCloseTicket(interaction);
        }
        // Music buttons
        else if (customId === 'music_play_pause') {
          await handleMusicPlayPause(interaction);
        } else if (customId === 'music_skip') {
          await handleMusicSkip(interaction);
        } else if (customId === 'music_stop') {
          await handleMusicStop(interaction);
        }
        // Giveaway buttons
        else if (customId === 'join_giveaway') {
          await handleGiveawayJoin(interaction);
        }
        // General buttons
        else if (customId.startsWith('confirm_')) {
          await handleConfirmAction(interaction);
        } else if (customId.startsWith('cancel_')) {
          await handleCancelAction(interaction);
        }
        
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
    
    // Handle select menu interactions
    if (interaction.isStringSelectMenu()) {
      const customId = interaction.customId;
      
      try {
        if (customId === 'help_category') {
          await handleHelpCategory(interaction, client);
        } else if (customId === 'role_select') {
          await handleRoleSelect(interaction);
        } else if (customId === 'music_queue') {
          await handleMusicQueueSelect(interaction);
        }
        
      } catch (error) {
        console.error('Select menu interaction error:', error);
        
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: '❌ An error occurred while processing this selection.', 
            ephemeral: true 
          });
        }
      }
    }
    
    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      const customId = interaction.customId;
      
      try {
        if (customId === 'verification_modal') {
          await handleVerificationModal(interaction);
        } else if (customId === 'ticket_modal') {
          await handleTicketModal(interaction);
        } else if (customId === 'report_modal') {
          await handleReportModal(interaction);
        }
        
      } catch (error) {
        console.error('Modal interaction error:', error);
        
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: '❌ An error occurred while processing your submission.', 
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

// Verification handlers
async function handleBasicVerification(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('verification_modal')
    .setTitle('📋 Basic Verification');

  const nameInput = new TextInputBuilder()
    .setCustomId('user_name')
    .setLabel('Your Name')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(50);

  const ageInput = new TextInputBuilder()
    .setCustomId('user_age')
    .setLabel('Your Age')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(3);

  const reasonInput = new TextInputBuilder()
    .setCustomId('join_reason')
    .setLabel('Why do you want to join this server?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
  const secondActionRow = new ActionRowBuilder().addComponents(ageInput);
  const thirdActionRow = new ActionRowBuilder().addComponents(reasonInput);

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

  await interaction.showModal(modal);
}

async function handleIDVerification(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('🆔 ID Verification Process')
    .setDescription('For enhanced security, ID verification requires manual approval from our staff team.')
    .addFields([
      {
        name: '📤 How to Submit',
        value: '1. Take a clear photo of your government-issued ID\n2. Send it via DM to any online staff member\n3. Include your Discord username in the message\n4. Wait for manual verification (usually within 24 hours)',
        inline: false
      },
      {
        name: '🔒 Privacy & Security',
        value: '• Your ID will only be viewed by trusted staff\n• Images are deleted after verification\n• We only verify age and authenticity\n• Personal details remain private',
        inline: false
      },
      {
        name: '✅ After Verification',
        value: 'Once approved, you\'ll receive the "Verified" role and full server access.',
        inline: false
      }
    ])
    .setFooter({ text: 'ID verification provides the highest level of server access' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });

  // Log ID verification request
  const logChannel = interaction.guild.channels.cache.find(c => 
    c.name === 'verification-logs' || c.name === 'mod-logs'
  );
  
  if (logChannel) {
    const logEmbed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('🆔 ID Verification Requested')
      .addFields([
        { name: 'User', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
        { name: 'Status', value: 'Awaiting Manual Review', inline: true },
        { name: 'Requested', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
      ])
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    
    logChannel.send({ embeds: [logEmbed] });
  }
}

async function handleRulesAcceptance(interaction) {
  const member = interaction.member;
  
  // Check if user already has verified role
  const verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Verified' || r.name === 'Member');
  if (verifiedRole && member.roles.cache.has(verifiedRole.id)) {
    return interaction.reply({ 
      content: '✅ You are already verified!', 
      ephemeral: true 
    });
  }

  // Add verified role
  if (verifiedRole) {
    try {
      await member.roles.add(verifiedRole);
      
      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('✅ Verification Complete!')
        .setDescription(`Welcome to **${interaction.guild.name}**! You have successfully accepted the rules and are now verified.`)
        .addFields([
          {
            name: '🎉 What\'s Next?',
            value: '• Explore all channels\n• Join conversations\n• Use all bot commands\n• Participate in events',
            inline: true
          },
          {
            name: '📚 Resources',
            value: '• Check <#rules> anytime\n• Use `!help` for commands\n• Contact staff if needed',
            inline: true
          }
        ])
        .setFooter({ text: 'Enjoy your stay in our community!' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      
      // Log successful verification
      const logChannel = interaction.guild.channels.cache.find(c => 
        c.name === 'verification-logs' || c.name === 'mod-logs'
      );
      
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#4CAF50')
          .setTitle('✅ User Verified')
          .addFields([
            { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
            { name: 'Method', value: 'Rules Acceptance', inline: true },
            { name: 'Role Added', value: verifiedRole.name, inline: true }
          ])
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();
        
        logChannel.send({ embeds: [logEmbed] });
      }
      
    } catch (error) {
      console.error('Error adding verified role:', error);
      await interaction.reply({ 
        content: '❌ There was an error verifying you. Please contact a staff member.', 
        ephemeral: true 
      });
    }
  } else {
    await interaction.reply({ 
      content: '❌ Verified role not found. Please contact a staff member.', 
      ephemeral: true 
    });
  }
}

// Help category handler
async function handleHelpCategory(interaction, client) {
  const selectedCategory = interaction.values[0];
  
  const categories = {
    'general': {
      title: '📋 General Commands',
      commands: [
        '`!help` - Show this help menu',
        '`!info` - Bot information',
        '`!ping` - Check bot latency',
        '`!uptime` - Bot uptime',
        '`!stats` - Server statistics',
        '`!invite` - Invite bot to your server',
        '`!support` - Get support server link'
      ]
    },
    'moderation': {
      title: '🛡️ Moderation Commands',
      commands: [
        '`!ban @user [reason]` - Ban a user',
        '`!kick @user [reason]` - Kick a user',
        '`!mute @user [time] [reason]` - Mute a user',
        '`!unmute @user` - Unmute a user',
        '`!warn @user [reason]` - Warn a user',
        '`!timeout @user [time]` - Timeout a user',
        '`!purge [amount]` - Delete messages',
        '`!lock [channel]` - Lock a channel',
        '`!unlock [channel]` - Unlock a channel',
        '`!slowmode [seconds]` - Set channel slowmode'
      ]
    },
    'music': {
      title: '🎵 Music Commands',
      commands: [
        '`!play [song/url]` - Play music',
        '`!stop` - Stop music and clear queue',
        '`!skip` - Skip current song',
        '`!queue` - Show music queue',
        '`!volume [1-100]` - Set volume',
        '`!pause` - Pause current song',
        '`!resume` - Resume paused song',
        '`!loop [off/song/queue]` - Set loop mode',
        '`!shuffle` - Shuffle the queue',
        '`!nowplaying` - Show current song'
      ]
    },
    'economy': {
      title: '💰 Economy Commands',
      commands: [
        '`!balance` - Check your balance',
        '`!daily` - Claim daily reward',
        '`!weekly` - Claim weekly reward',
        '`!work` - Work to earn money',
        '`!crime` - Commit a crime (risky)',
        '`!rob @user` - Rob another user',
        '`!pay @user [amount]` - Pay another user',
        '`!shop` - View the shop',
        '`!buy [item]` - Buy an item',
        '`!inventory` - View your inventory'
      ]
    },
    'fun': {
      title: '🎪 Fun Commands',
      commands: [
        '`!meme` - Get a random meme',
        '`!8ball [question]` - Ask the magic 8-ball',
        '`!joke` - Get a random joke',
        '`!fact` - Get a random fact',
        '`!quote` - Get an inspirational quote',
        '`!coinflip` - Flip a coin',
        '`!dice [sides]` - Roll dice',
        '`!rps [choice]` - Rock paper scissors'
      ]
    },
    'games': {
      title: '🎮 Game Commands',
      commands: [
        '`!trivia` - Start a trivia game',
        '`!wordle` - Play Wordle',
        '`!hangman` - Play Hangman',
        '`!tictactoe @user` - Play Tic-Tac-Toe',
        '`!blackjack` - Play Blackjack',
        '`!slots` - Play slot machine',
        '`!connect4 @user` - Play Connect 4',
        '`!chess @user` - Play Chess'
      ]
    },
    'utility': {
      title: '🔧 Utility Commands',
      commands: [
        '`!avatar [@user]` - Get user avatar',
        '`!userinfo [@user]` - Get user information',
        '`!serverinfo` - Get server information',
        '`!channelinfo [#channel]` - Get channel info',
        '`!roleinfo [@role]` - Get role information',
        '`!weather [location]` - Get weather info',
        '`!translate [lang] [text]` - Translate text'
      ]
    },
    'tickets': {
      title: '🎫 Ticket Commands',
      commands: [
        '`!ticket` - Create a support ticket',
        '`!vticket @user` - Create voice ticket',
        '`!close` - Close current ticket',
        '`!add @user` - Add user to ticket',
        '`!remove @user` - Remove user from ticket',
        '`!claim` - Claim a ticket',
        '`!unclaim` - Unclaim a ticket'
      ]
    },
    'leveling': {
      title: '📈 Leveling Commands',
      commands: [
        '`!rank [@user]` - Check user rank',
        '`!leaderboard` - View server leaderboard',
        '`!setlevel @user [level]` - Set user level (Admin)',
        '`!addxp @user [amount]` - Add XP to user (Admin)',
        '`!resetlevel @user` - Reset user level (Admin)'
      ]
    },
    'ai & chat': {
      title: '🤖 AI & Chat Commands',
      commands: [
        '`!ai [prompt]` - Chat with AI',
        '`!chat [message]` - Advanced AI chat',
        '`!imagine [prompt]` - Generate AI image',
        '`!analyze [text/image]` - Analyze content with AI'
      ]
    },
    'giveaways': {
      title: '🎉 Giveaway Commands',
      commands: [
        '`!giveaway` - Start an interactive giveaway',
        '`!gstart [time] [winners] [prize]` - Quick giveaway',
        '`!gend [messageId]` - End giveaway early',
        '`!greroll [messageId]` - Reroll giveaway',
        '`!glist` - List active giveaways'
      ]
    },
    'verification': {
      title: '✅ Verification Commands',
      commands: [
        '`!verify` - Start verification process',
        '`!unverify @user` - Remove verification (Admin)',
        '`!verifysetup` - Setup verification system (Admin)'
      ]
    },
    'auto-moderation': {
      title: '🚫 Auto-Moderation Commands',
      commands: [
        '`!automod enable/disable` - Toggle automod',
        '`!whitelist add/remove [word]` - Manage whitelist',
        '`!blacklist add/remove [word]` - Manage blacklist',
        '`!filters view/edit` - Manage content filters'
      ]
    },
    'configuration': {
      title: '⚙️ Configuration Commands',
      commands: [
        '`!config` - View bot configuration',
        '`!prefix [new_prefix]` - Change bot prefix',
        '`!welcome setup` - Setup welcome messages',
        '`!goodbye setup` - Setup goodbye messages',
        '`!autorole @role` - Set auto role for new members',
        '`!logging setup` - Setup logging channels'
      ]
    }
  };

  const category = categories[selectedCategory];
  if (!category) {
    return interaction.reply({ 
      content: '❌ Category not found!', 
      ephemeral: true 
    });
  }

  const embed = new EmbedBuilder()
    .setColor(client.config?.defaultEmbedColor || '#5865F2')
    .setTitle(category.title)
    .setDescription(category.commands.join('\n'))
    .addFields([
      {
        name: '💡 Tips',
        value: `• Use \`${client.config?.prefix || '!'}help [command]\` for detailed info about a specific command\n• Arguments in [brackets] are required, (parentheses) are optional\n• Most commands require appropriate permissions`,
        inline: false
      }
    ])
    .setFooter({ text: 'BotMaster Pro • Select another category from the dropdown above' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

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
  
  await interaction.reply({ 
    content: '✅ You have joined the voice ticket! Please wait for staff assistance.', 
    ephemeral: true 
  });
}

async function handleAddUserTicket(interaction) {
  await interaction.reply({ 
    content: '⚠️ Add user functionality is coming soon!', 
    ephemeral: true 
  });
}

async function handleCloseVoiceTicket(interaction) {
  if (!interaction.member.permissions.has('ManageChannels')) {
    return interaction.reply({ 
      content: '❌ You don\'t have permission to close tickets!', 
      ephemeral: true 
    });
  }
  
  await interaction.reply({ 
    content: '🔒 Voice ticket has been closed!', 
    ephemeral: true 
  });
}

// Other handlers (placeholder implementations)
async function handleCreateTicket(interaction) {
  await interaction.reply({ content: '🎫 Creating your ticket...', ephemeral: true });
}

async function handleCloseTicket(interaction) {
  await interaction.reply({ content: '🔒 Closing ticket...', ephemeral: true });
}

async function handleMusicPlayPause(interaction) {
  await interaction.reply({ content: '⏯️ Music toggled!', ephemeral: true });
}

async function handleMusicSkip(interaction) {
  await interaction.reply({ content: '⏭️ Song skipped!', ephemeral: true });
}

async function handleMusicStop(interaction) {
  await interaction.reply({ content: '⏹️ Music stopped!', ephemeral: true });
}

async function handleGiveawayJoin(interaction) {
  await interaction.reply({ content: '🎉 You joined the giveaway!', ephemeral: true });
}

async function handleConfirmAction(interaction) {
  await interaction.reply({ content: '✅ Action confirmed!', ephemeral: true });
}

async function handleCancelAction(interaction) {
  await interaction.reply({ content: '❌ Action cancelled!', ephemeral: true });
}

async function handleRoleSelect(interaction) {
  await interaction.reply({ content: '🎭 Role updated!', ephemeral: true });
}

async function handleMusicQueueSelect(interaction) {
  await interaction.reply({ content: '🎵 Queue updated!', ephemeral: true });
}

async function handleVerificationModal(interaction) {
  const name = interaction.fields.getTextInputValue('user_name');
  const age = interaction.fields.getTextInputValue('user_age');
  const reason = interaction.fields.getTextInputValue('join_reason');
  
  const embed = new EmbedBuilder()
    .setColor('#4CAF50')
    .setTitle('✅ Verification Submitted!')
    .setDescription('Your verification has been submitted and is being reviewed by our staff team.')
    .addFields([
      { name: 'Name', value: name, inline: true },
      { name: 'Age', value: age, inline: true },
      { name: 'Status', value: 'Under Review', inline: true }
    ])
    .setFooter({ text: 'You will be notified once your verification is approved' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed], ephemeral: true });
  
  // Log verification submission
  const logChannel = interaction.guild.channels.cache.find(c => 
    c.name === 'verification-logs' || c.name === 'mod-logs'
  );
  
  if (logChannel) {
    const logEmbed = new EmbedBuilder()
      .setColor('#2196F3')
      .setTitle('📋 Basic Verification Submitted')
      .addFields([
        { name: 'User', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
        { name: 'Name', value: name, inline: true },
        { name: 'Age', value: age, inline: true },
        { name: 'Reason', value: reason.length > 100 ? reason.substring(0, 100) + '...' : reason, inline: false }
      ])
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    
    logChannel.send({ embeds: [logEmbed] });
  }
}

async function handleTicketModal(interaction) {
  await interaction.reply({ content: '🎫 Ticket created successfully!', ephemeral: true });
}

async function handleReportModal(interaction) {
  await interaction.reply({ content: '📝 Report submitted successfully!', ephemeral: true });
}
