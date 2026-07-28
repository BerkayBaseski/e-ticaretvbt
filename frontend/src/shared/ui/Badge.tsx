import React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-[#3B82F6] text-white border-transparent shadow-sm',
    secondary: 'bg-[#1F2937] text-[#F8FAFC] border-transparent',
    success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    destructive: 'bg-[#EF4444] text-white border-transparent',
    outline: 'bg-transparent text-[#CBD5E1] border-[#1F2937]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
