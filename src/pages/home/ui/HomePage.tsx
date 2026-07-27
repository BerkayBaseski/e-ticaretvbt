import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Zap,
  Flame,
  Star,
  Sparkles,
  ChevronRight,
  Mail,
  CheckCircle2,
  Cpu,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  Watch
} from 'lucide-react';
import { productsApi } from '../../../shared/api';
import type { Product } from '../../../shared/types';
import { ProductCard } from '../../../entities/product/ui/ProductCard';
import { QuickViewModal } from '../../../shared/ui/QuickViewModal';
import { ProductGridSkeleton } from '../../../shared/ui/Skeleton';
import { Button } from '../../../shared/ui/Button';
import { useToast } from '../../../shared/ui/Toast';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['home-all-products'],
    queryFn: () => productsApi.getProducts({ size: 20 }),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      success('Bültene Katıldınız', 'Özel fırsatlar ve indirimler e-posta adresinize gönderilecektir.');
    }
  };

  const allProducts = productsData?.content || [];
  const flashSaleProducts = allProducts.slice(0, 4);
  const bestSellers = allProducts.filter((p) => p.rating >= 4.7).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNew).slice(0, 4);

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case 'elektronik':
      case 'cat-1':
        return <Cpu className="w-6 h-6" />;
      case 'giyim-moda':
      case 'cat-2':
        return <Shirt className="w-6 h-6" />;
      case 'ev-yasam':
      case 'cat-3':
        return <HomeIcon className="w-6 h-6" />;
      case 'spor-outdoor':
      case 'cat-4':
        return <Dumbbell className="w-6 h-6" />;
      case 'aksesuar-saat':
      case 'cat-5':
        return <Watch className="w-6 h-6" />;
      default:
        return <Cpu className="w-6 h-6" />;
    }
  };

  const featuredBrands = [
    { name: 'Apple' },
    { name: 'Sony' },
    { name: 'Bose' },
    { name: 'Logitech' },
    { name: 'Bang & Olufsen' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Merve Kaya',
      role: 'Grafik Tasarımcı',
      comment: 'AuraSound Pro kulaklık 1 günde teslim edildi. Paketleme kusursuz ve gürültü engelleme performansı inanılmaz.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Caner Şahin',
      role: 'Yazılım Mühendisi',
      comment: 'Mekanik oyuncu klavyesini aldım. Tuş hissi ve malzeme kalitesi harika. Müşteri desteği de oldukça ilgili.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Selin Arslan',
      role: 'İç Mimarlık',
      comment: 'İskandinav vazo seti salonuma tam uydu. Görsellerde ne görünüyorsa birebir aynı kalitede ulaştı.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1F2937] bg-gradient-to-br from-[#0B1329] via-[#030712] to-[#111827] p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-xs font-semibold text-[#3B82F6]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Geleceğin Akıllı Ekipmanları</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#F8FAFC]"
            >
              Mükemmel Tasarım. Üstün Performans.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-[#CBD5E1] leading-relaxed max-w-lg"
            >
              Minimalist detaylar, gelişmiş teknolojik özellikler ve yüksek kaliteli malzemelerle üretilmiş premium ürün koleksiyonumuzu keşfedin.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 pt-2 max-w-md"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Örn: Gürültü önleyici kulaklık..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-12 bg-white/5 backdrop-blur-md border border-white/15 rounded-full text-xs sm:text-sm text-white placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white/10 transition-all"
                />
                <Search className="absolute left-4 top-4 w-4 h-4 text-[#CBD5E1]" />
                <button
                  type="submit"
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#3B82F6] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
                  title="Ara"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </motion.form>

            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-[#CBD5E1]">
              <Link to="/search" className="hover:text-white transition-colors flex items-center gap-1">
                Tüm Kataloğu İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[#1F2937]">|</span>
              <span className="text-[#22C55E]">Ücretsiz 24 Saat Kargo</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative aspect-square w-full max-w-md rounded-3xl overflow-hidden border border-[#1F2937] shadow-2xl bg-black/40">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Featured Hero Product"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-6 right-6 glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">4.9 / 5.0 Puan</p>
                  <p className="text-[10px] text-[#CBD5E1]">120+ Müşteri Değerlendirmesi</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute bottom-6 left-6 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 text-[#3B82F6] flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white">AuraSound Pro ANC</p>
                  <p className="text-xs font-black text-[#3B82F6]">3,499 ₺</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. TRUST SECTION */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl border border-[#1F2937] bg-[#111827] flex items-center gap-4 shadow-sm hover:border-[#2563EB]/40 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ücretsiz Kargo</h4>
            <p className="text-xs text-[#CBD5E1]">1000 TL üzeri tüm siparişlerde</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[#1F2937] bg-[#111827] flex items-center gap-4 shadow-sm hover:border-[#2563EB]/40 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Güvenli Ödeme</h4>
            <p className="text-xs text-[#CBD5E1]">256-bit SSL korumalı altyapı</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[#1F2937] bg-[#111827] flex items-center gap-4 shadow-sm hover:border-[#2563EB]/40 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Kolay İade</h4>
            <p className="text-xs text-[#CBD5E1]">30 gün koşulsuz iade hakkı</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-[#1F2937] bg-[#111827] flex items-center gap-4 shadow-sm hover:border-[#2563EB]/40 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">7/24 Canlı Destek</h4>
            <p className="text-xs text-[#CBD5E1]">Kesintisiz müşteri hizmetleri</p>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Öne Çıkan Kategoriler</h2>
            <p className="text-xs text-[#CBD5E1]">İhtiyacınız olan ürün grubunu seçin</p>
          </div>
          <Link to="/search" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
            Tümünü İncele <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isCategoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-[#111827] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories?.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/search?category=${cat.id}`)}
                className="group cursor-pointer rounded-2xl border border-[#1F2937] bg-[#111827] p-5 flex flex-col items-center text-center space-y-3 shadow-md hover:border-[#2563EB] hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-black/40 text-[#3B82F6] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors">
                  {getCategoryIcon(cat.slug || cat.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5">{cat.itemCount} Ürün</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. FLASH SALE SECTION */}
      <section className="rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-[#111827] to-[#111827] p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                Fırsat Ürünleri (Flash Sale)
              </h2>
              <p className="text-xs text-[#CBD5E1]">Sınırlı süre için süper indirimler</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-4 py-2 rounded-2xl">
            <span className="text-xs text-[#CBD5E1] font-semibold">Kalan Süre:</span>
            <div className="flex items-center gap-1 font-mono font-extrabold text-sm text-rose-400">
              <span className="bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/30">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/30">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/30">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {isProductsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </section>

      {/* 7. BEST SELLERS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Çok Satan Ürünler</h2>
            <p className="text-xs text-[#CBD5E1]">Müşterilerimizin en çok tercih ettiği ürünler</p>
          </div>
          <Link to="/search?sort=rating" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isProductsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </section>

      {/* 8. NEW ARRIVALS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Yeni Gelenler</h2>
            <p className="text-xs text-[#CBD5E1]">Stoklarımıza yeni katılan en son modeller</p>
          </div>
          <Link to="/search?sort=newest" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
            Tüm Yeni Ürünler <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isProductsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </section>

      {/* 9. FEATURED BRANDS */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#3B82F6]">Markalar</h3>
          <h2 className="text-xl font-bold text-white">Dünyanın En Seçkin Markaları</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {featuredBrands.map((brand, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 flex items-center justify-center opacity-70 hover:opacity-100 hover:border-[#2563EB] transition-all cursor-pointer h-20"
            >
              <span className="font-extrabold text-lg text-white tracking-widest uppercase">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#3B82F6]">Müşteri Deneyimleri</h3>
          <h2 className="text-2xl font-bold text-white">Müşterilerimiz Ne Diyor?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="border-t border-[#1F2937] pt-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-[#CBD5E1]">{t.role}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section className="rounded-3xl border border-[#2563EB]/40 bg-gradient-to-r from-[#0B1329] to-[#111827] p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 text-[#3B82F6] flex items-center justify-center mx-auto shadow-md">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Özel Fırsatlardan İlk Siz Haberdar Olun
          </h2>
          <p className="text-xs md:text-sm text-[#CBD5E1]">
            E-posta bültenimize abone olarak haftalık yeni indirim kuponları ve özel ürün duyurularını kaçırmayın.
          </p>
        </div>

        {isSubscribed ? (
          <div className="p-4 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold max-w-md mx-auto">
            Teşekkürler! Bülten aboneliğiniz başarıyla oluşturuldu.
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 h-11 px-4 bg-black/50 border border-[#1F2937] rounded-xl text-xs text-white placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <Button type="submit" size="md" className="rounded-xl font-bold text-xs shrink-0 shadow-lg">
              Abone Ol
            </Button>
          </form>
        )}
      </section>

      {/* QUICK VIEW MODAL OVERLAY */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
