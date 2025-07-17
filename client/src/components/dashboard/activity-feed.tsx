import { Card } from "@/components/ui/card";
import { UserPlus, AlertTriangle, Music, Ban } from "lucide-react";
import type { Activity } from "@shared/schema";

interface ActivityFeedProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "verification":
      return { icon: UserPlus, bg: "bg-discord-success" };
    case "moderation":
      return { icon: AlertTriangle, bg: "bg-discord-warning" };
    case "music":
      return { icon: Music, bg: "bg-discord-blurple" };
    case "ban":
      return { icon: Ban, bg: "bg-discord-error" };
    default:
      return { icon: UserPlus, bg: "bg-discord-success" };
  }
};

const formatTimestamp = (timestamp: Date | string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  return (
    <Card className="bg-discord-medium border-discord-dark">
      <div className="p-6 border-b border-discord-dark">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <p className="text-discord-muted text-sm">Latest bot actions and events</p>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-discord-dark rounded-full animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-discord-dark rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-discord-dark rounded animate-pulse w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => {
              const { icon: Icon, bg } = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-white w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.username}</span>{" "}
                      <span className="text-discord-muted">{activity.description}</span>
                    </p>
                    <p className="text-discord-muted text-xs">
                      {formatTimestamp(activity.timestamp!)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-6 text-center">
          <button className="text-discord-blurple hover:text-discord-dark-blurple font-medium text-sm transition-colors">
            View All Activity →
          </button>
        </div>
      </div>
    </Card>
  );
}
