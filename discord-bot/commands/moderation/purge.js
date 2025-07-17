
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Delete multiple messages',
  usage: '<amount> [user]',
  category: 'moderation',
  aliases: ['clear', 'clean'],
  permissions: ['ManageMessages'],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('❌ You need **Manage Messages** permission to use this command.');
    }

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply('❌ Please provide a number between 1 and 100.');
    }

    const user = message.mentions.users.first();

    try {
      const messages = await message.channel.messages.fetch({ limit: amount + 1 });
      
      let messagesToDelete = messages;
      if (user) {
        messagesToDelete = messages.filter(msg => msg.author.id === user.id);
      }

      const deleted = await message.channel.bulkDelete(messagesToDelete, true);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🧹 Messages Purged')
        .setDescription(`Successfully deleted ${deleted.size} messages${user ? ` from ${user.tag}` : ''}.`)
        .setTimestamp();

      const reply = await message.channel.send({ embeds: [embed] });
      setTimeout(() => reply.delete().catch(() => {}), 5000);
    } catch (error) {
      message.reply('❌ Failed to purge messages: ' + error.message);
    }
  }
};
