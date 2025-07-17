const { PermissionsBitField } = require('discord.js');

module.exports = {
  // Check if user has required permissions
  hasPermission(member, permission) {
    return member.permissions.has(permission);
  },
  
  // Check if user has any of the required roles
  hasRole(member, roles) {
    return member.roles.cache.some(role => roles.includes(role.name));
  },
  
  // Check if user is server owner
  isOwner(member) {
    return member.id === member.guild.ownerId;
  },
  
  // Check if user is bot owner
  isBotOwner(member, ownerId) {
    return member.id === ownerId;
  },
  
  // Check if user can moderate target
  canModerate(moderator, target) {
    if (moderator.id === target.id) return false;
    if (target.id === moderator.guild.ownerId) return false;
    return moderator.roles.highest.position > target.roles.highest.position;
  },
  
  // Format permissions for display
  formatPermissions(permissions) {
    const permissionNames = {
      [PermissionsBitField.Flags.Administrator]: 'Administrator',
      [PermissionsBitField.Flags.ManageGuild]: 'Manage Server',
      [PermissionsBitField.Flags.ManageRoles]: 'Manage Roles',
      [PermissionsBitField.Flags.ManageChannels]: 'Manage Channels',
      [PermissionsBitField.Flags.ManageMessages]: 'Manage Messages',
      [PermissionsBitField.Flags.BanMembers]: 'Ban Members',
      [PermissionsBitField.Flags.KickMembers]: 'Kick Members',
      [PermissionsBitField.Flags.ModerateMembers]: 'Timeout Members',
      [PermissionsBitField.Flags.ViewChannel]: 'View Channels',
      [PermissionsBitField.Flags.SendMessages]: 'Send Messages',
      [PermissionsBitField.Flags.ReadMessageHistory]: 'Read Message History',
      [PermissionsBitField.Flags.Connect]: 'Connect to Voice',
      [PermissionsBitField.Flags.Speak]: 'Speak in Voice',
    };
    
    return permissions.map(perm => permissionNames[perm] || perm).join(', ');
  }
};