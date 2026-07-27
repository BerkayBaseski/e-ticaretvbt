import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Bir Hata Oluştu',
  message = 'Sunucuyla iletişim kurulurken beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyiniz.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-destructive/20 rounded-2xl bg-destructive/5 space-y-4 my-6">
      <div className="w-14 h-14 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mb-1">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2 mt-2">
          <RefreshCw className="w-4 h-4" />
          Tekrar Dene
        </Button>
      )}
    </div>
  );
};
