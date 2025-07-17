import { Shield, Gavel, FileText, Tags, UserCheck, Heart, Music, Coins, TrendingUp, Ticket, Terminal, BarChart3, Settings, LogOut } from "lucide-react";
import type { Server } from "@shared/schema";

interface SidebarProps {
  server?: Server;
}

export default function Sidebar({ server }: SidebarProps) {
  const navigationItems = [
    {
      title: "Moderation",
      items: [
        { icon: Shield, label: "Auto-Moderation", href: "#" },
        { icon: Gavel, label: "Moderation Tools", href: "#" },
        { icon: FileText, label: "Mod Logs", href: "#" },
      ],
    },
    {
      title: "Roles & Access",
      items: [
        { icon: Tags, label: "Role Management", href: "#" },
        { icon: UserCheck, label: "Verification System", href: "#" },
        { icon: Heart, label: "Reaction Roles", href: "#" },
      ],
    },
    {
      title: "Features",
      items: [
        { icon: Music, label: "Music System", href: "#" },
        { icon: Coins, label: "Economy System", href: "#" },
        { icon: TrendingUp, label: "Leveling & XP", href: "#" },
        { icon: Ticket, label: "Support Tickets", href: "#" },
        { icon: Terminal, label: "Giveaways", href: "#" },
      ],
    },
    {
      title: "Utilities",
      items: [
        { icon: Terminal, label: "Custom Commands", href: "#" },
        { icon: BarChart3, label: "Analytics", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
      ],
    },
  ];

  return (
    <div className="w-64 bg-discord-medium flex flex-col border-r border-discord-dark">
      {/* Server Info Header */}
      <div className="p-4 border-b border-discord-dark">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center text-xl font-bold">
            {server?.name?.substring(0, 2).toUpperCase() || "GM"}
          </div>
          <div>
            <h3 className="font-semibold text-white">{server?.name || "Gaming Masters"}</h3>
            <p className="text-sm text-discord-muted">
              {server?.memberCount?.toLocaleString() || "1,247"} members
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Dashboard */}
          <a 
            href="#" 
            className="flex items-center px-3 py-2 rounded-md bg-discord-blurple text-white font-medium"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </a>

          {/* Navigation Sections */}
          {navigationItems.map((section) => (
            <div key={section.title} className="mt-4">
              <h4 className="px-3 py-2 text-xs font-semibold text-discord-muted uppercase tracking-wider">
                {section.title}
              </h4>
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-discord-light hover:bg-discord-dark transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-discord-dark">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-discord-cyan rounded-full flex items-center justify-center text-sm font-bold text-discord-darker">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">john_doe</p>
            <p className="text-xs text-discord-muted">Administrator</p>
          </div>
          <button className="text-discord-muted hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
