import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Globe, Share2, MessageCircle, Store } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1F2937] bg-[#0B1220] text-[#CBD5E1] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-base shadow-md">
                N
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#F8FAFC]">
                Nova<span className="text-[#3B82F6]">Store</span>
              </span>
            </Link>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Lüks, yüksek kaliteli ve minimalist e-ticaret pazaryeri deneyimi. Seçkin teknoloji ve yaşam tarzı ürünleri.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:text-white transition-colors" title="Web"><Globe className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:text-white transition-colors" title="Sosyal Medya"><Share2 className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-xl bg-white/5 hover:text-white transition-colors" title="Topluluk"><MessageCircle className="w-4 h-4" /></a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Tüm Ürün Kataloğu</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Ürün Karşılaştırma</Link></li>
              <li><Link to="/seller" className="hover:text-[#22C55E] transition-colors font-bold flex items-center gap-1"><Store className="w-3.5 h-3.5 text-[#22C55E]" /> Satıcı Paneli (Seller Center)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Müşteri İlişkileri</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/faq" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">İletişim & Canlı Destek</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Kargo ve Sipariş Takibi</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Hesabım & Profil</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Güvenlik & Garanti</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6]" /> 256-bit SSL Güvenli Ödeme
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#3B82F6]" /> 24 Saat Hızlı Kargo
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#3B82F6]" /> 30 Gün Ücretsiz İade
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#3B82F6]" /> 7/24 Kesintisiz Destek
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1F2937] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© 2026 NovaStore Multi-Vendor Marketplace Inc. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:underline">Gizlilik Politikası</Link>
            <Link to="/faq" className="hover:underline">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
