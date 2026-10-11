import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  Inbox,
  Bot,
  Mic,
  Ticket,
  Sparkles,
  Sliders,
  BookOpen,
  BarChart3,
  CreditCard,
  Settings,
  Headphones,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { cn, getRoleDisplayName } from '@/utils';
import { Badge } from '@/components/ui/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'ORG_ADMIN';

  // Role-based navigation matrix
  const navSections = [
    {
      title: 'Operations',
      items: [
        {
          label: 'Executive Dashboard',
          to: '/app/dashboard',
          icon: LayoutDashboard,
          roles: ['ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_MANAGER', 'SUPPORT_AGENT'],
        },
        {
          label: 'AI Support Inbox',
          to: '/app/inbox',
          icon: Inbox,
          badge: '3',
          roles: ['SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
        {
          label: 'Agent Workspace & Copilot',
          to: '/app/workspace',
          icon: Headphones,
          roles: ['SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN'],
        },
        {
          label: 'Customer Chat Assistant',
          to: '/app/chat',
          icon: Bot,
          badge: 'Live',
          roles: ['CUSTOMER', 'SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
        {
          label: 'Voice AI Studio',
          to: '/app/voice',
          icon: Mic,
          badge: 'Duplex',
          roles: ['CUSTOMER', 'SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
        {
          label: 'Ticket Management',
          to: '/app/tickets',
          icon: Ticket,
          roles: ['CUSTOMER', 'SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
      ],
    },
    {
      title: 'AI Intelligence & Knowledge',
      items: [
        {
          label: 'AI Agent Control Panel',
          to: '/app/agent-control',
          icon: Sliders,
          roles: ['TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
        {
          label: 'Knowledge Base (RAG)',
          to: '/app/knowledge',
          icon: BookOpen,
          roles: ['CUSTOMER', 'SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
        {
          label: 'Analytics & Insights',
          to: '/app/analytics',
          icon: BarChart3,
          roles: ['TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'Billing & Usage',
          to: '/app/billing',
          icon: CreditCard,
          roles: ['ORG_ADMIN', 'SUPER_ADMIN'],
        },
        {
          label: 'Platform Settings',
          to: '/app/settings',
          icon: Settings,
          roles: ['CUSTOMER', 'SUPPORT_AGENT', 'TEAM_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                CogniVoice <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1 rounded font-mono">AI</span>
              </span>
              <p className="text-[10px] text-slate-400">Enterprise Voice & Support</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((sec) => {
            const filteredItems = sec.items.filter((item) => item.roles.includes(role));
            if (filteredItems.length === 0) return null;

            return (
              <div key={sec.title}>
                <h5 className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {sec.title}
                </h5>
                <nav className="space-y-1">
                  {filteredItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group',
                          isActive
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        )
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-indigo-500/20 text-indigo-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            );
          })}
        </div>

        {/* User Card & Role at bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate">{user?.name || 'Guest User'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant="purple" className="text-[9px] px-1.5 py-0">
                  {getRoleDisplayName(role)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
