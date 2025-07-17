import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const servers = pgTable("servers", {
  id: text("id").primaryKey(), // Discord server ID
  name: text("name").notNull(),
  memberCount: integer("member_count").default(0),
  botToken: text("bot_token"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const botStats = pgTable("bot_stats", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  commandsUsed: integer("commands_used").default(0),
  activeUsers: integer("active_users").default(0),
  modActions: integer("mod_actions").default(0),
  uptime: text("uptime"),
  memoryUsage: text("memory_usage"),
  responseTime: text("response_time"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  type: text("type").notNull(), // 'verification', 'moderation', 'music', 'ban', etc.
  username: text("username").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  channelId: text("channel_id"),
  voiceChannelId: text("voice_channel_id"),
  categoryId: text("category_id"),
  title: text("title").notNull(),
  description: text("description"),
  username: text("username").notNull(),
  userId: text("user_id").notNull(),
  assignedTo: text("assigned_to"),
  status: text("status").notNull().default("open"), // 'open', 'urgent', 'new', 'closed'
  type: text("type").default("text"), // 'text', 'voice', 'both'
  participants: text("participants").array().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const moderationSettings = pgTable("moderation_settings", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  autoModEnabled: boolean("auto_mod_enabled").default(false),
  spamDetection: boolean("spam_detection").default(true),
  linkFilter: boolean("link_filter").default(false),
  profanityFilter: boolean("profanity_filter").default(false),
  slowmodeEnabled: boolean("slowmode_enabled").default(false),
  slowmodeDuration: integer("slowmode_duration").default(30),
  maxWarnings: integer("max_warnings").default(3),
  autoTimeoutEnabled: boolean("auto_timeout_enabled").default(true),
  raidProtection: boolean("raid_protection").default(false),
  antiInvite: boolean("anti_invite").default(false),
  capsFilter: boolean("caps_filter").default(false),
  massmentionLimit: integer("massmention_limit").default(5),
});

export const botConfig = pgTable("bot_config", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  prefix: text("prefix").default("!"),
  welcomeMessage: text("welcome_message"),
  leaveMessage: text("leave_message"),
  welcomeChannelId: text("welcome_channel_id"),
  leaveChannelId: text("leave_channel_id"),
  modLogChannelId: text("mod_log_channel_id"),
  ticketCategoryId: text("ticket_category_id"),
  musicEnabled: boolean("music_enabled").default(true),
  economyEnabled: boolean("economy_enabled").default(true),
  levelingEnabled: boolean("leveling_enabled").default(true),
  ticketsEnabled: boolean("tickets_enabled").default(true),
  verificationEnabled: boolean("verification_enabled").default(true),
  reactionRolesEnabled: boolean("reaction_roles_enabled").default(true),
  giveawaysEnabled: boolean("giveaways_enabled").default(true),
  aiChatEnabled: boolean("ai_chat_enabled").default(false),
  customCommandsEnabled: boolean("custom_commands_enabled").default(true),
});

// User Management Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  discriminator: text("discriminator"),
  avatar: text("avatar"),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.discordId),
  serverId: text("server_id").references(() => servers.id),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  totalXp: integer("total_xp").default(0),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  reputation: integer("reputation").default(0),
  warnings: integer("warnings").default(0),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  customTitle: text("custom_title"),
  profileColor: text("profile_color").default("#7289da"),
});

// Role and Permission Management
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  roleId: text("role_id").notNull(),
  name: text("name").notNull(),
  color: text("color"),
  permissions: text("permissions").array().default({}),
  isDefault: boolean("is_default").default(false),
  isModerator: boolean("is_moderator").default(false),
  isAdmin: boolean("is_admin").default(false),
  level: integer("level").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reactionRoles = pgTable("reaction_roles", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  messageId: text("message_id").notNull(),
  channelId: text("channel_id").notNull(),
  emoji: text("emoji").notNull(),
  roleId: text("role_id").notNull(),
  roleName: text("role_name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Music System
export const musicQueues = pgTable("music_queues", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  channelId: text("channel_id").notNull(),
  voiceChannelId: text("voice_channel_id").notNull(),
  currentSong: jsonb("current_song"),
  queue: jsonb("queue").default([]),
  volume: integer("volume").default(50),
  repeat: text("repeat").default("off"), // 'off', 'song', 'queue'
  shuffle: boolean("shuffle").default(false),
  isPlaying: boolean("is_playing").default(false),
  isPaused: boolean("is_paused").default(false),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const musicHistory = pgTable("music_history", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist"),
  url: text("url"),
  duration: integer("duration"),
  playedAt: timestamp("played_at").defaultNow(),
});

// Economy System
export const economyTransactions = pgTable("economy_transactions", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'earn', 'spend', 'transfer', 'daily', 'weekly', 'work', 'crime', 'gamble'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  fromUserId: text("from_user_id"),
  toUserId: text("to_user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const economyShop = pgTable("economy_shop", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'role', 'item', 'perk'
  itemId: text("item_id"), // roleId for roles, custom identifier for items
  stock: integer("stock").default(-1), // -1 for unlimited
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Giveaway System
export const giveaways = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id").notNull(),
  hostId: text("host_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  prize: text("prize").notNull(),
  winners: integer("winners").default(1),
  requirements: jsonb("requirements").default({}), // role requirements, level requirements, etc.
  participants: text("participants").array().default({}),
  winnersList: text("winners_list").array().default({}),
  endsAt: timestamp("ends_at").notNull(),
  isActive: boolean("is_active").default(true),
  isEnded: boolean("is_ended").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Custom Commands
export const customCommands = pgTable("custom_commands", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  trigger: text("trigger").notNull(),
  response: text("response").notNull(),
  description: text("description"),
  createdBy: text("created_by").notNull(),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  requiredRole: text("required_role"),
  cooldown: integer("cooldown").default(0),
  isEmbed: boolean("is_embed").default(false),
  embedData: jsonb("embed_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Moderation Actions
export const moderationActions = pgTable("moderation_actions", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  userId: text("user_id").notNull(),
  moderatorId: text("moderator_id").notNull(),
  action: text("action").notNull(), // 'warn', 'mute', 'kick', 'ban', 'timeout'
  reason: text("reason"),
  duration: integer("duration"), // in minutes for temporary actions
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Verification System
export const verificationQueue = pgTable("verification_queue", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  submissionData: jsonb("submission_data"), // files, text, etc.
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  reviewedBy: text("reviewed_by"),
  reviewNotes: text("review_notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// AI Chat System
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  userId: text("user_id").notNull(),
  messages: jsonb("messages").default([]),
  isActive: boolean("is_active").default(true),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics and Logs
export const commandLogs = pgTable("command_logs", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  userId: text("user_id").notNull(),
  command: text("command").notNull(),
  args: text("args").array().default({}),
  channelId: text("channel_id").notNull(),
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  executionTime: integer("execution_time"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const serverAnalytics = pgTable("server_analytics", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  date: timestamp("date").notNull(),
  memberJoins: integer("member_joins").default(0),
  memberLeaves: integer("member_leaves").default(0),
  messagesCount: integer("messages_count").default(0),
  commandsUsed: integer("commands_used").default(0),
  voiceMinutes: integer("voice_minutes").default(0),
  moderationActions: integer("moderation_actions").default(0),
  xpEarned: integer("xp_earned").default(0),
  economyTransactions: integer("economy_transactions").default(0),
});

// Schemas for validation
export const insertServerSchema = createInsertSchema(servers).omit({
  createdAt: true,
});

export const insertBotStatsSchema = createInsertSchema(botStats).omit({
  id: true,
  timestamp: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  closedAt: true,
});

export const insertModerationSettingsSchema = createInsertSchema(moderationSettings).omit({
  id: true,
});

export const insertBotConfigSchema = createInsertSchema(botConfig).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinedAt: true,
  lastSeen: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const insertReactionRoleSchema = createInsertSchema(reactionRoles).omit({
  id: true,
  createdAt: true,
});

export const insertMusicQueueSchema = createInsertSchema(musicQueues).omit({
  id: true,
  lastUpdated: true,
});

export const insertMusicHistorySchema = createInsertSchema(musicHistory).omit({
  id: true,
  playedAt: true,
});

export const insertEconomyTransactionSchema = createInsertSchema(economyTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertEconomyShopSchema = createInsertSchema(economyShop).omit({
  id: true,
  createdAt: true,
});

export const insertGiveawaySchema = createInsertSchema(giveaways).omit({
  id: true,
  createdAt: true,
});

export const insertCustomCommandSchema = createInsertSchema(customCommands).omit({
  id: true,
  createdAt: true,
});

export const insertModerationActionSchema = createInsertSchema(moderationActions).omit({
  id: true,
  createdAt: true,
});

export const insertVerificationQueueSchema = createInsertSchema(verificationQueue).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  lastMessageAt: true,
  createdAt: true,
});

export const insertCommandLogSchema = createInsertSchema(commandLogs).omit({
  id: true,
  createdAt: true,
});

export const insertServerAnalyticsSchema = createInsertSchema(serverAnalytics).omit({
  id: true,
});

// Types
export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;

export type BotStats = typeof botStats.$inferSelect;
export type InsertBotStats = z.infer<typeof insertBotStatsSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type ModerationSettings = typeof moderationSettings.$inferSelect;
export type InsertModerationSettings = z.infer<typeof insertModerationSettingsSchema>;

export type BotConfig = typeof botConfig.$inferSelect;
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type ReactionRole = typeof reactionRoles.$inferSelect;
export type InsertReactionRole = z.infer<typeof insertReactionRoleSchema>;

export type MusicQueue = typeof musicQueues.$inferSelect;
export type InsertMusicQueue = z.infer<typeof insertMusicQueueSchema>;

export type MusicHistory = typeof musicHistory.$inferSelect;
export type InsertMusicHistory = z.infer<typeof insertMusicHistorySchema>;

export type EconomyTransaction = typeof economyTransactions.$inferSelect;
export type InsertEconomyTransaction = z.infer<typeof insertEconomyTransactionSchema>;

export type EconomyShop = typeof economyShop.$inferSelect;
export type InsertEconomyShop = z.infer<typeof insertEconomyShopSchema>;

export type Giveaway = typeof giveaways.$inferSelect;
export type InsertGiveaway = z.infer<typeof insertGiveawaySchema>;

export type CustomCommand = typeof customCommands.$inferSelect;
export type InsertCustomCommand = z.infer<typeof insertCustomCommandSchema>;

export type ModerationAction = typeof moderationActions.$inferSelect;
export type InsertModerationAction = z.infer<typeof insertModerationActionSchema>;

export type VerificationQueue = typeof verificationQueue.$inferSelect;
export type InsertVerificationQueue = z.infer<typeof insertVerificationQueueSchema>;

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;

export type CommandLog = typeof commandLogs.$inferSelect;
export type InsertCommandLog = z.infer<typeof insertCommandLogSchema>;

export type ServerAnalytics = typeof serverAnalytics.$inferSelect;
export type InsertServerAnalytics = z.infer<typeof insertServerAnalyticsSchema>;
