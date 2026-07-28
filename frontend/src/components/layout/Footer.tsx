import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground mt-auto transition-colors">
      {/* Value Badges */}
      <div className="border-b border-border bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Ücretsiz & Hızlı Kargo</h4>
                <p className="text-xs text-muted-foreground">1000 TL üzeri tüm siparişlerde</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">%100 Güvenli Ödeme</h4>
                <p className="text-xs text-muted-foreground">256-bit SSL koruması</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Taksit İmkânı</h4>
                <p className="text-xs text-muted-foreground">Tüm kredi kartlarına taksit</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-background/50 border border-border/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Kesintisiz Destek</h4>
                <p className="text-xs text-muted-foreground">7/24 Müşteri hizmetleri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">
                N
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Nova<span className="text-primary">Store</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yenilikçi, güvenilir ve modern e-ticaret platformu. En son teknolojik ürünlerden kaliteli günlük giyim seçeneklerine kadar zengin ürün kataloğu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase mb-4 text-foreground">Hızlı Bağlantılar</h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary transition-colors">Tüm Ürünler & Arama</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">Sepetim</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary transition-colors">Sipariş Takibi</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase mb-4 text-foreground">Popüler Kategoriler</h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link to="/search?category=cat-1" className="hover:text-primary transition-colors">Elektronik</Link>
              </li>
              <li>
                <Link to="/search?category=cat-2" className="hover:text-primary transition-colors">Giyim & Moda</Link>
              </li>
              <li>
                <Link to="/search?category=cat-3" className="hover:text-primary transition-colors">Ev & Yaşam</Link>
              </li>
              <li>
                <Link to="/search?category=cat-4" className="hover:text-primary transition-colors">Spor & Outdoor</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase mb-4 text-foreground">Müşteri Hizmetleri</h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><span>İade & Değişim Politikası</span></li>
              <li><span>Gizlilik & Güvenlik Sözleşmesi</span></li>
              <li><span>Mesafeli Satış Sözleşmesi</span></li>
              <li><span>İletişim: destek@novastore.example.com</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 NovaStore E-Ticaret Platformu. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-pointer">KVKK</span>
            <span className="hover:text-foreground cursor-pointer">Çerez Politikası</span>
            <span className="hover:text-foreground cursor-pointer font-medium text-primary">MSW Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
