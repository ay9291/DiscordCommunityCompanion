import { Bell } from "lucide-react";

export default function TopBar() {
  return (
    <header className="bg-discord-medium border-b border-discord-dark px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-discord-muted">Welcome back! Here's what's happening with your bot.</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-discord-success rounded-full"></div>
            <span className="text-sm text-discord-light">Bot Online</span>
          </div>
          {/* Notification Bell */}
          <button className="relative p-2 text-discord-muted hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-discord-error rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
