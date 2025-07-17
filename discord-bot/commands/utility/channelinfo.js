
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  name: 'channelinfo',
  description: 'Get information about a channel',
  usage: '[channel]',
  category: 'utility',
  aliases: ['ci', 'channel'],
  cooldown: 3,
  async execute(message, args, client) {
    const channel = message.mentions.channels.first() || 
                   message.guild.channels.cache.get(args[0]) || 
                   message.channel;

    const channelTypes = {
      [ChannelType.GuildText]: 'Text Channel',
      [ChannelType.GuildVoice]: 'Voice Channel',
      [ChannelType.GuildCategory]: 'Category',
      [ChannelType.GuildNews]: 'News Channel',
      [ChannelType.GuildStageVoice]: 'Stage Channel',
      [ChannelType.GuildForum]: 'Forum Channel'
    };

    const embed = new EmbedBuilder()
      .setColor('#7289da')
      .setTitle(`Channel Information - ${channel.name}`)
      .addFields(
        { name: 'Channel ID', value: channel.id, inline: true },
        { name: 'Type', value: channelTypes[channel.type] || 'Unknown', inline: true },
        { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Position', value: channel.position?.toString() || 'N/A', inline: true },
        { name: 'NSFW', value: channel.nsfw ? 'Yes' : 'No', inline: true }
      )
      .setTimestamp();

    if (channel.topic) {
      embed.addFields({ name: 'Topic', value: channel.topic, inline: false });
    }

    if (channel.parent) {
      embed.addFields({ name: 'Category', value: channel.parent.name, inline: true });
    }

    message.reply({ embeds: [embed] });
  }
};
