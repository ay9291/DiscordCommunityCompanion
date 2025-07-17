import { Card } from "@/components/ui/card";
import type { BotStats } from "@shared/schema";

interface BotStatusProps {
  stats?: BotStats;
}

export default function BotStatus({ stats }: BotStatusProps) {
  const statusItems = [
    {
      label: "Uptime",
      value: stats?.uptime || "7d 12h 34m",
    },
    {
      label: "Memory Usage",
      value: stats?.memoryUsage || "234 MB",
    },
    {
      label: "Avg Response",
      value: stats?.responseTime || "89ms",
      valueClass: "text-discord-success",
    },
    {
      label: "Connected Servers",
      value: "1",
    },
    {
      label: "Commands Today",
      value: stats?.commandsUsed?.toLocaleString() || "1,247",
    },
  ];

  return (
    <Card className="bg-discord-medium border-discord-dark">
      <div className="p-6 border-b border-discord-dark">
        <h3 className="text-lg font-semibold text-white">Bot Status</h3>
      </div>
      <div className="p-6 space-y-4">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-discord-muted">{item.label}</span>
            <span className={`font-medium ${item.valueClass || "text-white"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
