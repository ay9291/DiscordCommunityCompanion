import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBotStatsSchema, insertActivitySchema, insertTicketSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Server routes
  app.get("/api/server/:id", async (req, res) => {
    const server = await storage.getServer(req.params.id);
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    res.json(server);
  });

  // Bot stats routes
  app.get("/api/server/:id/stats", async (req, res) => {
    const stats = await storage.getBotStats(req.params.id);
    if (!stats) {
      return res.status(404).json({ message: "Stats not found" });
    }
    res.json(stats);
  });

  app.post("/api/server/:id/stats", async (req, res) => {
    try {
      const validatedData = insertBotStatsSchema.parse({
        ...req.body,
        serverId: req.params.id,
      });
      const stats = await storage.createBotStats(validatedData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Activity routes
  app.get("/api/server/:id/activities", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const activities = await storage.getActivities(req.params.id, limit);
    res.json(activities);
  });

  app.post("/api/server/:id/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse({
        ...req.body,
        serverId: req.params.id,
      });
      const activity = await storage.createActivity(validatedData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Ticket routes
  app.get("/api/server/:id/tickets", async (req, res) => {
    const tickets = await storage.getTickets(req.params.id);
    res.json(tickets);
  });

  app.get("/api/server/:id/tickets/count", async (req, res) => {
    const count = await storage.getOpenTicketsCount(req.params.id);
    res.json({ count });
  });

  app.post("/api/server/:id/tickets", async (req, res) => {
    try {
      const validatedData = insertTicketSchema.parse({
        ...req.body,
        serverId: req.params.id,
      });
      const ticket = await storage.createTicket(validatedData);
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Moderation settings routes
  app.get("/api/server/:id/moderation", async (req, res) => {
    const settings = await storage.getModerationSettings(req.params.id);
    res.json(settings);
  });

  // Bot config routes
  app.get("/api/server/:id/config", async (req, res) => {
    const config = await storage.getBotConfig(req.params.id);
    res.json(config);
  });

  // Quick actions
  app.post("/api/server/:id/actions/broadcast", async (req, res) => {
    // This would integrate with Discord API to send announcement
    await storage.createActivity({
      serverId: req.params.id,
      type: "announcement",
      username: "BotMaster Pro",
      description: "Announcement sent to all channels",
    });
    res.json({ success: true, message: "Announcement sent successfully!" });
  });

  app.post("/api/server/:id/actions/backup", async (req, res) => {
    // This would create a backup of server settings
    await storage.createActivity({
      serverId: req.params.id,
      type: "backup",
      username: "BotMaster Pro",
      description: "Server settings backup created",
    });
    res.json({ success: true, message: "Settings backup completed!" });
  });

  app.post("/api/server/:id/actions/slowmode", async (req, res) => {
    // This would enable slowmode via Discord API
    await storage.createActivity({
      serverId: req.params.id,
      type: "moderation",
      username: "BotMaster Pro",
      description: "Slowmode enabled for 30 seconds",
    });
    res.json({ success: true, message: "Slowmode enabled for 30 seconds!" });
  });

  app.post("/api/server/:id/actions/lockdown", async (req, res) => {
    // This would lockdown the server via Discord API
    await storage.createActivity({
      serverId: req.params.id,
      type: "moderation",
      username: "BotMaster Pro",
      description: "Server lockdown activated",
    });
    res.json({ success: true, message: "Server lockdown activated!" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
