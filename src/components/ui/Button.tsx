import React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 dark:bg-slate-800/80',
      outline: 'border border-slate-700 bg-transparent hover:bg-slate-800/60 text-slate-200',
      ghost: 'bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30',
      glow: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 font-semibold',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 gap-2 h-10',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
      icon: 'p-2 h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
