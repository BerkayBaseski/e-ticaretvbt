import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-6">
      <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
        <Compass className="w-12 h-12 animate-pulse" />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-extrabold text-primary uppercase tracking-widest">Hata 404</span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Aradığınız Sayfa Bulunamadı</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Aradığınız sayfa silinmiş, ismi değiştirilmiş veya geçici olarak erişilemiyor olabilir.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link to="/">
          <Button size="lg" className="w-full sm:w-auto gap-2">
            <Home className="w-4 h-4" /> Ana Sayfaya Dön
          </Button>
        </Link>
        <Link to="/search">
          <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
            <Search className="w-4 h-4" /> Ürün Kataloğunu İncele
          </Button>
        </Link>
      </div>
    </div>
  );
};
