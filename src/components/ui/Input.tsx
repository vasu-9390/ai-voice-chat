import React from 'react';
import { cn } from '@/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && <label className="block text-xs font-medium text-slate-300">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors',
              'disabled:bg-slate-800 disabled:text-slate-500',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-rose-500 focus:ring-rose-500/50 focus:border-rose-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
