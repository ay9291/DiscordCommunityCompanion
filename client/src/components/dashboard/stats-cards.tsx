import { Users, Terminal, UserCheck, Shield, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { BotStats } from "@shared/schema";

interface StatsCardsProps {
  stats?: BotStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: "Total Members",
      value: "1,247",
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
      iconBg: "bg-discord-blurple",
      iconColor: "text-white",
    },
    {
      title: "Commands Used",
      value: stats?.commandsUsed?.toLocaleString() || "8,392",
      change: "+23%",
      changeType: "increase" as const,
      icon: Terminal,
      iconBg: "bg-discord-cyan",
      iconColor: "text-discord-darker",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers?.toLocaleString() || "432",
      change: "-3%",
      changeType: "decrease" as const,
      icon: UserCheck,
      iconBg: "bg-discord-pink",
      iconColor: "text-white",
    },
    {
      title: "Mod Actions",
      value: stats?.modActions?.toString() || "17",
      change: "+8",
      changeType: "increase" as const,
      icon: Shield,
      iconBg: "bg-discord-error",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="bg-discord-medium border-discord-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-discord-muted text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className={`text-sm flex items-center ${
                stat.changeType === "increase" 
                  ? "text-discord-success" 
                  : "text-discord-warning"
              }`}>
                {stat.changeType === "increase" ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span>{stat.change}</span> from last month
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`${stat.iconColor} w-6 h-6`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
