import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Flame,
  Star,
  ChevronRight,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { productsApi } from '../../api';
import type { Product } from '../../api/types';
import { ProductCard } from './components/ProductCard';
import { QuickViewModal } from '../../components/ui/QuickViewModal';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { HeroSlider } from '../../pages/home/ui/HeroSlider';
import { CategoryRow } from '../../pages/home/ui/CategoryRow';
import { useCartStore } from '../../stores/cartStore';
import { useRecentlyViewedStore } from '../../stores/recentlyViewedStore';

export const HomePage: React.FC = () => {
  const { success } = useToast();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Live Flash Sale Countdown Timer (Ticking every second)
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

  // Fetch All Products
  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useQuery({
    queryKey: ['home-all-products'],
    queryFn: () => productsApi.getProducts({ size: 20 }),
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      success('Bültene Katıldınız', 'Özel fırsatlar ve indirimler e-posta adresinize gönderilecektir.');
    }
  };

  const { cart } = useCartStore();
  const { items: recentlyViewedItems } = useRecentlyViewedStore();

  const allProducts = productsData?.content || [];
  const flashSaleProducts = allProducts.slice(0, 4);
  const bestSellers = allProducts.filter((p) => p.rating >= 4.7).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNew).slice(0, 4);

  // Dynamic recommendations based on cart contents or recently viewed categories
  const cartCategoryIds = (cart?.items || []).map((ci: any) => ci.product?.categoryId).filter(Boolean);
  const recentlyViewedCategoryIds = recentlyViewedItems.map((p) => p?.categoryId).filter(Boolean);
  const preferredCategoryIds = Array.from(new Set([...cartCategoryIds, ...recentlyViewedCategoryIds]));

  const recommendedProducts = preferredCategoryIds.length > 0
    ? allProducts.filter((p) => preferredCategoryIds.includes(p.categoryId)).slice(0, 4)
    : allProducts.filter((p) => p.rating >= 4.5).slice(4, 8);

  const featuredBrands = [
    { name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&auto=format&fit=crop&q=80' },
    { name: 'Sony', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' },
    { name: 'Bose', logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80' },
    { name: 'Logitech', logo: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80' },
    { name: 'Bang & Olufsen', logo: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80' },
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
      {/* 2. HERO SLIDER SECTION */}
      <div className="pt-2">
        <HeroSlider />
      </div>

      {/* 3. CATEGORY ROW */}
      <div className="max-w-6xl mx-auto px-4">
        <CategoryRow />
      </div>

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

          {/* Countdown Timer & Tümünü Gör */}
          <div className="flex items-center gap-4">
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

            <Link to="/search" className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </Link>
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

      {/* 6. RECOMMENDED FOR YOU (PERSONALIZED) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Sizin İçin Seçtiklerimiz
            </h2>
            <p className="text-xs text-[#CBD5E1]">Sepetinize ve ilgi alanlarınıza özel akıllı öneriler</p>
          </div>
          <Link to="/search" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
            Tümünü Gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isProductsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
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

      {/* 9. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewedItems.length > 0 && (
        <section className="space-y-6 rounded-3xl border border-[#1F2937] bg-[#111827] p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Son İncelediğiniz Ürünler</h2>
              <p className="text-xs text-[#CBD5E1]">En son göz attığınız ürünlere göz atın</p>
            </div>
            <Link to="/search" className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewedItems.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

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
