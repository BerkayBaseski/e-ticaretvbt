import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border rounded-2xl bg-card/50 space-y-4 my-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};
