import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TicketPriority, TicketStatus, UserRole } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

export function formatDeadline(isoString: string): { text: string; isUrgent: boolean; isOverdue: boolean } {
  try {
    const deadline = new Date(isoString).getTime();
    const now = Date.now();
    const diff = (deadline - now) / 1000;

    if (diff < 0) {
      const overdueMins = Math.abs(Math.floor(diff / 60));
      return {
        text: `Overdue by ${overdueMins > 60 ? `${Math.floor(overdueMins / 60)}h` : `${overdueMins}m`}`,
        isUrgent: true,
        isOverdue: true,
      };
    }

    const hours = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);

    if (hours < 1) {
      return { text: `${mins}m left`, isUrgent: true, isOverdue: false };
    }
    if (hours < 4) {
      return { text: `${hours}h ${mins}m left`, isUrgent: true, isOverdue: false };
    }
    return { text: `${hours}h left`, isUrgent: false, isOverdue: false };
  } catch {
    return { text: '2h left', isUrgent: false, isOverdue: false };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPriorityColor(priority: TicketPriority) {
  switch (priority) {
    case 'URGENT':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500 animate-pulse',
      };
    case 'HIGH':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
        dot: 'bg-blue-500',
      };
    case 'LOW':
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case 'NEW':
      return { label: 'New', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
    case 'OPEN':
      return { label: 'Open', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
    case 'WAITING_FOR_CUSTOMER':
      return { label: 'Waiting on Customer', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
    case 'ESCALATED':
      return { label: 'Escalated', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
    case 'RESOLVED':
      return { label: 'Resolved', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    case 'CLOSED':
      return { label: 'Closed', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' };
  }
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'CUSTOMER':
      return 'Customer';
    case 'SUPPORT_AGENT':
      return 'Support Agent';
    case 'TEAM_MANAGER':
      return 'Team Manager';
    case 'ORG_ADMIN':
      return 'Organization Admin';
    case 'SUPER_ADMIN':
      return 'Super Admin';
  }
}
