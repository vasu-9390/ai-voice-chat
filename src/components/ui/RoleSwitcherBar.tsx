import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Headphones, Users, Building, Sparkles } from 'lucide-react';
import { cn } from '@/utils';

const roles: { role: UserRole; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
  { role: 'CUSTOMER', label: 'Customer', icon: UserCheck, desc: 'Self-service chat, voice agent & my tickets' },
  { role: 'SUPPORT_AGENT', label: 'Support Agent', icon: Headphones, desc: 'Omnichannel inbox, tickets & AI Copilot' },
  { role: 'TEAM_MANAGER', label: 'Team Manager', icon: Users, desc: 'Team queues, SLAs & agent performance' },
  { role: 'ORG_ADMIN', label: 'Org Admin', icon: Building, desc: 'Full platform, AI Agent config & billing' },
  { role: 'SUPER_ADMIN', label: 'Super Admin', icon: ShieldCheck, desc: 'Platform-wide security & multi-tenant access' },
];

export const RoleSwitcherBar: React.FC = () => {
  const { user, switchRole } = useAuthStore();
  const currentRole = user?.role || 'ORG_ADMIN';

  return (
    <div className="bg-slate-900/90 border-b border-indigo-500/20 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Enterprise RBAC Simulation:
        </span>
        <span className="hidden md:inline text-slate-400">Switch role to test dynamic permissions & UI adaptation:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {roles.map(({ role, label, icon: Icon }) => {
          const isActive = currentRole === role;
          return (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 ring-1 ring-indigo-400'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )}
              title={`Switch UI to ${label}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
