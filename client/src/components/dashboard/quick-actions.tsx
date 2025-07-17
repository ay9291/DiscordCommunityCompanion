import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Download, Clock, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  serverId: string;
}

export default function QuickActions({ serverId }: QuickActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const broadcastMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/server/${serverId}/actions/broadcast`),
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/server", serverId, "activities"] });
    },
  });

  const backupMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/server/${serverId}/actions/backup`),
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/server", serverId, "activities"] });
    },
  });

  const slowmodeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/server/${serverId}/actions/slowmode`),
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/server", serverId, "activities"] });
    },
  });

  const lockdownMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/server/${serverId}/actions/lockdown`),
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/server", serverId, "activities"] });
    },
  });

  const actions = [
    {
      label: "Send Announcement",
      icon: Megaphone,
      className: "bg-discord-blurple hover:bg-discord-dark-blurple text-white",
      mutation: broadcastMutation,
    },
    {
      label: "Backup Settings",
      icon: Download,
      className: "bg-discord-success hover:bg-green-600 text-white",
      mutation: backupMutation,
    },
    {
      label: "Enable Slowmode",
      icon: Clock,
      className: "bg-discord-warning hover:bg-yellow-500 text-discord-darker",
      mutation: slowmodeMutation,
    },
    {
      label: "Server Lockdown",
      icon: Lock,
      className: "bg-discord-error hover:bg-red-600 text-white",
      mutation: lockdownMutation,
    },
  ];

  return (
    <Card className="bg-discord-medium border-discord-dark">
      <div className="p-6 border-b border-discord-dark">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
      </div>
      <div className="p-6 space-y-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={() => action.mutation.mutate()}
            disabled={action.mutation.isPending}
            className={`w-full justify-center ${action.className}`}
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.mutation.isPending ? "Processing..." : action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
