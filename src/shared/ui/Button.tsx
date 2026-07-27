import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#3B82F6] text-white hover:bg-[#60A5FA] focus:ring-[#3B82F6] shadow-lg shadow-blue-500/20 border border-blue-400/20',
      secondary:
        'bg-[#111827] text-white hover:bg-[#1F2937] border border-[#1F2937] focus:ring-[#1F2937]',
      outline:
        'border border-[#1F2937] bg-transparent text-[#F8FAFC] hover:bg-white/5 focus:ring-[#3B82F6]',
      ghost:
        'bg-transparent text-[#CBD5E1] hover:text-white hover:bg-white/5 focus:ring-[#3B82F6]',
      destructive:
        'bg-[#EF4444] text-white hover:bg-red-600 focus:ring-[#EF4444] shadow-lg shadow-red-500/20',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs rounded-xl',
      md: 'h-11 px-5 text-xs sm:text-sm rounded-xl',
      lg: 'h-13 px-7 text-sm sm:text-base rounded-2xl',
      icon: 'h-10 w-10 p-0 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
