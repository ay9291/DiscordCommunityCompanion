import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "@shared/schema";

interface RecentTicketsProps {
  tickets?: Ticket[];
  ticketCount: number;
  isLoading?: boolean;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "urgent":
      return "destructive";
    case "open":
      return "secondary";
    case "new":
      return "default";
    default:
      return "secondary";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "urgent":
      return "bg-discord-error text-white";
    case "open":
      return "bg-discord-warning text-discord-darker";
    case "new":
      return "bg-discord-blurple text-white";
    default:
      return "bg-discord-warning text-discord-darker";
  }
};

export default function RecentTickets({ tickets, ticketCount, isLoading }: RecentTicketsProps) {
  return (
    <Card className="bg-discord-medium border-discord-dark">
      <div className="p-6 border-b border-discord-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Tickets</h3>
          <span className="bg-discord-error text-white text-xs px-2 py-1 rounded-full">
            {ticketCount} Open
          </span>
        </div>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-discord-dark rounded-md">
                <div className="flex-1">
                  <div className="h-4 bg-discord-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-discord-muted rounded animate-pulse w-24"></div>
                </div>
                <div className="h-6 w-16 bg-discord-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {tickets?.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-discord-dark rounded-md">
                <div>
                  <p className="text-white text-sm font-medium">{ticket.title}</p>
                  <p className="text-discord-muted text-xs">by {ticket.username}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(ticket.status)}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <button className="text-discord-blurple hover:text-discord-dark-blurple font-medium text-sm transition-colors">
            View All Tickets →
          </button>
        </div>
      </div>
    </Card>
  );
}
