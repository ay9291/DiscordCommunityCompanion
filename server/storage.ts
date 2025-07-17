import { 
  servers, 
  botStats, 
  activities, 
  tickets, 
  moderationSettings, 
  botConfig,
  type Server, 
  type InsertServer,
  type BotStats,
  type InsertBotStats,
  type Activity,
  type InsertActivity,
  type Ticket,
  type InsertTicket,
  type ModerationSettings,
  type InsertModerationSettings,
  type BotConfig,
  type InsertBotConfig
} from "@shared/schema";

export interface IStorage {
  // Server operations
  getServer(id: string): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: string, server: Partial<InsertServer>): Promise<Server | undefined>;
  
  // Bot stats operations
  getBotStats(serverId: string): Promise<BotStats | undefined>;
  createBotStats(stats: InsertBotStats): Promise<BotStats>;
  updateBotStats(serverId: string, stats: Partial<InsertBotStats>): Promise<BotStats | undefined>;
  
  // Activity operations
  getActivities(serverId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Ticket operations
  getTickets(serverId: string): Promise<Ticket[]>;
  getOpenTicketsCount(serverId: string): Promise<number>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  
  // Moderation settings operations
  getModerationSettings(serverId: string): Promise<ModerationSettings | undefined>;
  updateModerationSettings(serverId: string, settings: InsertModerationSettings): Promise<ModerationSettings>;
  
  // Bot config operations
  getBotConfig(serverId: string): Promise<BotConfig | undefined>;
  updateBotConfig(serverId: string, config: InsertBotConfig): Promise<BotConfig>;
}

export class MemStorage implements IStorage {
  private servers: Map<string, Server>;
  private botStats: Map<string, BotStats>;
  private activities: Map<string, Activity[]>;
  private tickets: Map<string, Ticket[]>;
  private moderationSettings: Map<string, ModerationSettings>;
  private botConfigs: Map<string, BotConfig>;
  private currentActivityId: number;
  private currentTicketId: number;
  private currentStatsId: number;
  private currentModSettingsId: number;
  private currentConfigId: number;

  constructor() {
    this.servers = new Map();
    this.botStats = new Map();
    this.activities = new Map();
    this.tickets = new Map();
    this.moderationSettings = new Map();
    this.botConfigs = new Map();
    this.currentActivityId = 1;
    this.currentTicketId = 1;
    this.currentStatsId = 1;
    this.currentModSettingsId = 1;
    this.currentConfigId = 1;

    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoServer: Server = {
      id: "gaming-masters",
      name: "Gaming Masters",
      memberCount: 1247,
      botToken: null,
      isActive: true,
      createdAt: new Date(),
    };
    this.servers.set(demoServer.id, demoServer);

    const demoStats: BotStats = {
      id: 1,
      serverId: "gaming-masters",
      commandsUsed: 8392,
      activeUsers: 432,
      modActions: 17,
      uptime: "7d 12h 34m",
      memoryUsage: "234 MB",
      responseTime: "89ms",
      timestamp: new Date(),
    };
    this.botStats.set(demoServer.id, demoStats);

    const demoActivities: Activity[] = [
      {
        id: 1,
        serverId: "gaming-masters",
        type: "verification",
        username: "@alex_gaming",
        description: "was verified and gained Verified role",
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: 2,
        serverId: "gaming-masters",
        type: "moderation",
        username: "@spam_user",
        description: "was auto-muted for spam (3 messages deleted)",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: 3,
        serverId: "gaming-masters",
        type: "music",
        username: "@music_lover",
        description: "started playing \"Bohemian Rhapsody\" in Voice Chat",
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      },
      {
        id: 4,
        serverId: "gaming-masters",
        type: "ban",
        username: "@troublemaker",
        description: "was banned by @ModeratorBot (Reason: Multiple rule violations)",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    ];
    this.activities.set(demoServer.id, demoActivities);

    const demoTickets: Ticket[] = [
      {
        id: 1,
        serverId: "gaming-masters",
        title: "Report inappropriate content",
        description: "User posting NSFW content in general chat",
        username: "@concerned_user",
        status: "open",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 2,
        serverId: "gaming-masters",
        title: "Bot not responding to commands",
        description: "Music commands are not working",
        username: "@confused_user",
        status: "urgent",
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 3,
        serverId: "gaming-masters",
        title: "Feature request: Custom roles",
        description: "Can we add custom reaction roles?",
        username: "@feature_lover",
        status: "new",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];
    this.tickets.set(demoServer.id, demoTickets);

    const demoModSettings: ModerationSettings = {
      id: 1,
      serverId: "gaming-masters",
      autoModEnabled: true,
      spamDetection: true,
      linkFilter: false,
      profanityFilter: true,
      slowmodeEnabled: false,
      slowmodeDuration: 30,
    };
    this.moderationSettings.set(demoServer.id, demoModSettings);

    const demoConfig: BotConfig = {
      id: 1,
      serverId: "gaming-masters",
      prefix: "!",
      welcomeMessage: "Welcome to Gaming Masters! 🎮",
      welcomeChannelId: "123456789",
      modLogChannelId: "987654321",
      musicEnabled: true,
      economyEnabled: true,
      levelingEnabled: true,
      ticketsEnabled: true,
    };
    this.botConfigs.set(demoServer.id, demoConfig);
  }

  async getServer(id: string): Promise<Server | undefined> {
    return this.servers.get(id);
  }

  async createServer(server: InsertServer): Promise<Server> {
    const newServer: Server = {
      ...server,
      createdAt: new Date(),
    };
    this.servers.set(newServer.id, newServer);
    return newServer;
  }

  async updateServer(id: string, server: Partial<InsertServer>): Promise<Server | undefined> {
    const existing = this.servers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...server };
    this.servers.set(id, updated);
    return updated;
  }

  async getBotStats(serverId: string): Promise<BotStats | undefined> {
    return this.botStats.get(serverId);
  }

  async createBotStats(stats: InsertBotStats): Promise<BotStats> {
    const newStats: BotStats = {
      id: this.currentStatsId++,
      ...stats,
      timestamp: new Date(),
    };
    this.botStats.set(stats.serverId!, newStats);
    return newStats;
  }

  async updateBotStats(serverId: string, stats: Partial<InsertBotStats>): Promise<BotStats | undefined> {
    const existing = this.botStats.get(serverId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...stats, timestamp: new Date() };
    this.botStats.set(serverId, updated);
    return updated;
  }

  async getActivities(serverId: string, limit: number = 10): Promise<Activity[]> {
    const activities = this.activities.get(serverId) || [];
    return activities.slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = {
      id: this.currentActivityId++,
      ...activity,
      timestamp: new Date(),
    };
    
    const activities = this.activities.get(activity.serverId!) || [];
    activities.unshift(newActivity);
    this.activities.set(activity.serverId!, activities);
    
    return newActivity;
  }

  async getTickets(serverId: string): Promise<Ticket[]> {
    return this.tickets.get(serverId) || [];
  }

  async getOpenTicketsCount(serverId: string): Promise<number> {
    const tickets = this.tickets.get(serverId) || [];
    return tickets.filter(ticket => ticket.status !== 'closed').length;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const newTicket: Ticket = {
      id: this.currentTicketId++,
      ...ticket,
      createdAt: new Date(),
    };
    
    const tickets = this.tickets.get(ticket.serverId!) || [];
    tickets.unshift(newTicket);
    this.tickets.set(ticket.serverId!, tickets);
    
    return newTicket;
  }

  async updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined> {
    for (const [serverId, tickets] of this.tickets.entries()) {
      const index = tickets.findIndex(t => t.id === id);
      if (index !== -1) {
        tickets[index] = { ...tickets[index], ...ticket };
        return tickets[index];
      }
    }
    return undefined;
  }

  async getModerationSettings(serverId: string): Promise<ModerationSettings | undefined> {
    return this.moderationSettings.get(serverId);
  }

  async updateModerationSettings(serverId: string, settings: InsertModerationSettings): Promise<ModerationSettings> {
    const newSettings: ModerationSettings = {
      id: this.currentModSettingsId++,
      ...settings,
    };
    this.moderationSettings.set(serverId, newSettings);
    return newSettings;
  }

  async getBotConfig(serverId: string): Promise<BotConfig | undefined> {
    return this.botConfigs.get(serverId);
  }

  async updateBotConfig(serverId: string, config: InsertBotConfig): Promise<BotConfig> {
    const newConfig: BotConfig = {
      id: this.currentConfigId++,
      ...config,
    };
    this.botConfigs.set(serverId, newConfig);
    return newConfig;
  }
}

export const storage = new MemStorage();
