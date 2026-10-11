import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Mic,
  Wifi,
  WifiOff,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';
import { socketService } from '@/services/websocket/socketService';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubConnect = socketService.on('status:connected', () => setIsConnected(true));
    const unsubDisconnect = socketService.on('status:disconnected', () => setIsConnected(false));
    return () => {
      unsubConnect();
      unsubDisconnect();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between backdrop-blur-md sticky top-8 z-30">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets, customers, articles, or AI tools... (Ctrl + K)"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Right: Socket status, Voice Agent Quick Call, Theme toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Socket Indicator */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400"
          title={isConnected ? 'Socket.IO duplex connected' : 'Connecting to real-time cluster...'}
        >
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-300">Live WS</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span className="text-slate-400">Syncing</span>
            </>
          )}
        </div>

        {/* Voice AI Instant Launch Button */}
        <button
          onClick={() => navigate('/app/voice')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium shadow-sm shadow-indigo-600/30 hover:opacity-90 transition-opacity"
        >
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Voice Agent</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Logout Quick Action */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
