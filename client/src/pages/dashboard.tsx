import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import ActivityFeed from "@/components/dashboard/activity-feed";
import QuickActions from "@/components/dashboard/quick-actions";
import BotStatus from "@/components/dashboard/bot-status";
import RecentTickets from "@/components/dashboard/recent-tickets";

const DEMO_SERVER_ID = "gaming-masters";

export default function Dashboard() {
  const { data: server, isLoading: serverLoading } = useQuery({
    queryKey: ["/api/server", DEMO_SERVER_ID],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/server", DEMO_SERVER_ID, "stats"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/server", DEMO_SERVER_ID, "activities"],
  });

  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/server", DEMO_SERVER_ID, "tickets"],
  });

  const { data: ticketCount } = useQuery({
    queryKey: ["/api/server", DEMO_SERVER_ID, "tickets", "count"],
  });

  if (serverLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-discord-darker flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-discord-darker text-white">
      <Sidebar server={server} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <StatsCards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <ActivityFeed 
                activities={activities} 
                isLoading={activitiesLoading} 
              />
            </div>
            
            <div className="space-y-6">
              <QuickActions serverId={DEMO_SERVER_ID} />
              <BotStatus stats={stats} />
              <RecentTickets 
                tickets={tickets} 
                ticketCount={ticketCount?.count || 0}
                isLoading={ticketsLoading} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
