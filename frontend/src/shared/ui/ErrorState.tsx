import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Bir Hata Oluştu',
  message = 'İçerik yüklenirken bir sorun meydana geldi. Lütfen tekrar deneyin.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-[24px] border border-rose-500/30 bg-[#111827] space-y-4 max-w-md mx-auto shadow-xl">
      <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-md">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-[#CBD5E1] leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 text-xs rounded-xl">
          <RotateCcw className="w-3.5 h-3.5" /> Tekrar Dene
        </Button>
      )}
    </div>
  );
};
