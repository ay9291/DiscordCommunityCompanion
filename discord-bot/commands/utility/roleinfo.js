
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'roleinfo',
  description: 'Get information about a role',
  usage: '<role>',
  category: 'utility',
  aliases: ['ri', 'role'],
  cooldown: 3,
  async execute(message, args, client) {
    if (!args[0]) {
      return message.reply('❌ Please specify a role!');
    }

    const role = message.mentions.roles.first() || 
                 message.guild.roles.cache.get(args[0]) ||
                 message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(' ').toLowerCase()));

    if (!role) {
      return message.reply('❌ Role not found!');
    }

    const permissions = role.permissions.toArray().map(perm => 
      perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    );

    const embed = new EmbedBuilder()
      .setColor(role.hexColor || '#000000')
      .setTitle(`Role Information - ${role.name}`)
      .addFields(
        { name: 'Role ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor || 'Default', inline: true },
        { name: 'Position', value: role.position.toString(), inline: true },
        { name: 'Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Members', value: role.members.size.toString(), inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true }
      )
      .setTimestamp();

    if (permissions.length > 0 && permissions.length < 10) {
      embed.addFields({ name: 'Key Permissions', value: permissions.slice(0, 10).join(', '), inline: false });
    }

    message.reply({ embeds: [embed] });
  }
};
