import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
  title: text("title").notNull(),
  description: text("description"),
  username: text("username").notNull(),
  status: text("status").notNull().default("open"), // 'open', 'urgent', 'new', 'closed'
  createdAt: timestamp("created_at").defaultNow(),
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
});

export const botConfig = pgTable("bot_config", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").references(() => servers.id),
  prefix: text("prefix").default("!"),
  welcomeMessage: text("welcome_message"),
  welcomeChannelId: text("welcome_channel_id"),
  modLogChannelId: text("mod_log_channel_id"),
  musicEnabled: boolean("music_enabled").default(true),
  economyEnabled: boolean("economy_enabled").default(true),
  levelingEnabled: boolean("leveling_enabled").default(true),
  ticketsEnabled: boolean("tickets_enabled").default(true),
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
});

export const insertModerationSettingsSchema = createInsertSchema(moderationSettings).omit({
  id: true,
});

export const insertBotConfigSchema = createInsertSchema(botConfig).omit({
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
