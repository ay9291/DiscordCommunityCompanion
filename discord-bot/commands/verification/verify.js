const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  name: 'verify',
  description: 'Start the verification process',
  aliases: ['verification'],
  usage: '!verify',
  cooldown: 30,
  async execute(message, args, client) {
    const member = message.member;
    
    // Check if user is already verified
    const verifiedRole = message.guild.roles.cache.find(r => r.name === 'Verified' || r.name === 'Member');
    if (verifiedRole && member.roles.cache.has(verifiedRole.id)) {
      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('✅ Already Verified')
        .setDescription('You are already verified in this server!')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const embed = new EmbedBuilder()
      .setColor('#2196F3')
      .setTitle('🔐 Server Verification')
      .setDescription('Welcome to the verification process! Please choose your verification method below.')
      .addFields([
        {
          name: '📋 Basic Verification',
          value: 'Quick verification with basic information',
          inline: true
        },
        {
          name: '🆔 ID Verification',
          value: 'Enhanced verification with ID proof (Manual approval required)',
          inline: true
        },
        {
          name: '🎭 Role Selection',
          value: 'Choose your server role after verification',
          inline: true
        }
      ])
      .addFields({
        name: '📜 Server Rules Reminder',
        value: '• Be respectful to all members\n• No spam or self-promotion\n• Keep content appropriate\n• Follow Discord ToS\n• Use channels for their intended purpose',
        inline: false
      })
      .setFooter({ text: 'Verification helps keep our server safe and secure' })
      .setTimestamp();
    
    const basicButton = new ButtonBuilder()
      .setCustomId('verify_basic')
      .setLabel('📋 Basic Verification')
      .setStyle(ButtonStyle.Primary);
    
    const idButton = new ButtonBuilder()
      .setCustomId('verify_id')
      .setLabel('🆔 ID Verification')
      .setStyle(ButtonStyle.Secondary);
    
    const rulesButton = new ButtonBuilder()
      .setCustomId('verify_rules')
      .setLabel('📜 Accept Rules')
      .setStyle(ButtonStyle.Success);
    
    const row = new ActionRowBuilder().addComponents(basicButton, idButton, rulesButton);
    
    await message.reply({ embeds: [embed], components: [row] });
    
    // Try to DM user with verification info
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor('#2196F3')
        .setTitle('🔐 Verification Started')
        .setDescription(`You've started the verification process in **${message.guild.name}**`)
        .addFields([
          {
            name: '🚀 Next Steps',
            value: '1. Choose your verification method\n2. Complete the required information\n3. Wait for approval (if needed)\n4. Enjoy full server access!',
            inline: false
          },
          {
            name: '❓ Need Help?',
            value: 'Contact server staff if you encounter any issues during verification.',
            inline: false
          }
        ])
        .setTimestamp();
      
      await member.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.log(`Could not DM ${member.user.tag} about verification.`);
    }
    
    // Log verification attempt
    const logChannel = message.guild.channels.cache.find(c => 
      c.name === 'verification-logs' || c.name === 'mod-logs'
    );
    
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#2196F3')
        .setTitle('🔐 Verification Started')
        .addFields([
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Channel', value: message.channel.toString(), inline: true },
          { name: 'Account Age', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        ])
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      
      logChannel.send({ embeds: [logEmbed] });
    }
  }
};