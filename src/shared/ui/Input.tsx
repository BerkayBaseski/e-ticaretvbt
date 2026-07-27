import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#F8FAFC]">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#CBD5E1]/60 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full h-11 bg-[#050816] border border-[#1F2937] text-xs text-[#F8FAFC] placeholder:text-[#CBD5E1]/60 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error && 'border-[#EF4444] focus:ring-[#EF4444]',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-[#CBD5E1]/60 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-[11px] text-[#EF4444] font-medium leading-none">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
