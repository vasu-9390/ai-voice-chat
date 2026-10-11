import React from 'react';
import { cn } from '@/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  const dots = {
    default: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500 animate-pulse',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    outline: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />}
      {children}
    </span>
  );
};
