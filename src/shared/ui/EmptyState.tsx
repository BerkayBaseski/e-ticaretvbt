import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-[24px] border border-[#1F2937] bg-[#111827] space-y-4 max-w-md mx-auto shadow-xl">
      <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/20 shadow-md">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-[#F8FAFC]">{title}</h3>
        <p className="text-xs text-[#CBD5E1] leading-relaxed max-w-xs">{description}</p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} className="rounded-xl font-bold text-xs px-6 mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};
