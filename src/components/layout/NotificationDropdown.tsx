import React, { useRef, useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Clock, 
  UserPlus, 
  MessageSquare, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';
import { formatTimeAgo, cn } from '@/utils';

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    isOpen,
    setIsOpen,
    filter,
    setFilter,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.read) 
    : notifications;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ESCALATION':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'SLA_WARNING':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'ASSIGNMENT':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default:
        return <Cpu className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
                title={soundEnabled ? 'Disable audio alert' : 'Enable audio alert'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-600" />}
              </button>
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-800/80 px-4 py-2 gap-2 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2 py-0.5 rounded font-medium transition-colors',
                filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-2 py-0.5 rounded font-medium transition-colors',
                filter === 'unread' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications to display
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      navigate(notif.link);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    'p-3 px-4 hover:bg-slate-800/60 cursor-pointer transition-colors flex gap-3 text-left items-start',
                    !notif.read && 'bg-indigo-500/5'
                  )}
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn('text-xs font-semibold truncate', !notif.read ? 'text-slate-100' : 'text-slate-300')}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    {notif.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-medium mt-1">
                        View item <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
