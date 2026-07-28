import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center mx-auto shadow-md">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white">404 - Sayfa Bulunamadı</h1>
        <p className="text-xs text-[#CBD5E1]">
          Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.
        </p>
      </div>

      <Link to="/">
        <Button className="rounded-xl font-bold text-xs px-6">Ana Sayfaya Dön</Button>
      </Link>
    </div>
  );
};
