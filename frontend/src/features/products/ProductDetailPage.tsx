import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { 
  Star, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Tag, 
  MessageSquare, 
  HelpCircle, 
  Sliders, 
  Send, 
  UserCheck,
  CreditCard,
  Store,
  Heart,
  Copy,
  X
} from 'lucide-react';
import { productsApi } from '../../api';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';
import { useToast } from '../../components/ui/Toast';
import { ProductCard } from './components/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useRecentlyViewedStore } from '../../stores/recentlyViewedStore';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'qa'>('specs');
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [isFollowingStore, setIsFollowingStore] = useState(false);

  // Form states
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      user: 'Mehmet Y.',
      rating: 5,
      date: '2 gün önce',
      comment: 'Ürün harika, kargolama çok hızlıydı. Malzeme kalitesi beklediğimden yüksek çıktı.',
      verified: true,
    },
    {
      id: 'rev-2',
      user: 'Elif K.',
      rating: 4,
      date: '1 hafta önce',
      comment: 'Fiyat/performans ürünü. Kutu içeriği eksiksiz ve ambalaj sağlam geldi.',
      verified: true,
    },
  ]);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [qaList, setQaList] = useState([
    {
      id: 'qa-1',
      user: 'Ahmet B.',
      question: 'Ürün 2 yıl Türkiye garantili midir?',
      answer: 'Merhaba, evet ürünümüz 2 yıl distribütör garantilidir.',
      date: '3 gün önce',
    },
    {
      id: 'qa-2',
      user: 'Selin A.',
      question: 'Aynı gün kargoya veriliyor mu?',
      answer: 'Saat 16:00 öncesi verilen siparişler aynı gün kargoya teslim edilmektedir.',
      date: '5 gün önce',
    },
  ]);

  const { addToCart } = useCartStore();
  const { addRecentlyViewed } = useRecentlyViewedStore();
  const { success, info } = useToast();

  // Fetch Main Product Detail
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useReactQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id || ''),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  // Fetch Similar Products in same category
  const { data: similarProductsData } = useReactQuery({
    queryKey: ['similar-products', product?.categoryId],
    queryFn: () => productsApi.getProducts({ category: product?.categoryId, size: 4 }),
    enabled: !!product?.categoryId,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    setIsAdded(true);
    success('Sepete Eklendi', `${quantity} adet ${product.name} sepetinize eklendi.`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      user: 'Siz (Onaylı Alıcı)',
      rating: newReviewRating,
      date: 'Şimdi',
      comment: newReviewComment.trim(),
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewComment('');
    success('Değerlendirmeniz Eklendi', 'Ürün hakkındaki yorumunuz başarıyla yayınlandı.');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQa = {
      id: `qa-${Date.now()}`,
      user: 'Siz',
      question: newQuestionText.trim(),
      answer: 'Sorunuz satıcıya iletildi. En kısa sürede yanıtlanacaktır.',
      date: 'Şimdi',
    };
    setQaList([newQa, ...qaList]);
    setNewQuestionText('');
    success('Sorunuz İletildi', 'Satıcı en kısa sürede sorunuzu yanıtlayacaktır.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    info('Bağlantı Kopyalandı', 'Ürün bağlantısı panoya kopyalandı.');
  };

  if (isLoading) {
    return (
      <div className="space-y-10 py-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Ürün Bulunamadı"
        message={error ? (error as Error).message : 'Aradığınız ürün mevcut değil veya kaldırılmış olabilir.'}
        onRetry={refetch}
      />
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

  const similarProducts = similarProductsData?.content?.filter((p) => p.id !== product.id).slice(0, 4) || [];

  const defaultSpecs = {
    'Garanti Süresi': '24 Ay Distribütör Garantili',
    'Menşei': 'İthal',
    'Durumu': 'Sıfır Orijinal Ambalajında',
    'Kargo Teslimatı': '24 Saat İçinde Kargoda',
    'İade Hakkı': '14 Gün Koşulsuz İade',
    ...(product.specs || {}),
  };

  // Calculate installment monthly amounts
  const price = product.price;
  const installments = [
    { month: 3, total: price, monthly: Math.round(price / 3) },
    { month: 6, total: Math.round(price * 1.04), monthly: Math.round((price * 1.04) / 6) },
    { month: 9, total: Math.round(price * 1.08), monthly: Math.round((price * 1.08) / 9) },
    { month: 12, total: Math.round(price * 1.12), monthly: Math.round((price * 1.12) / 12) },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfa
          </Link>
          <span>/</span>
          <Link to="/search" className="hover:text-foreground transition-colors">
            Ürünler
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Share & Favorites Count */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
            <Heart className="w-3 h-3 fill-current" /> 1.4k Kişi Favoriledi
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
          >
            <Copy className="w-3.5 h-3.5" /> Paylaş
          </button>
        </div>
      </div>

      {/* PRODUCT TOP SECTION: GALLERY + DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* GALLERY */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-border bg-[#111827] shadow-xl">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-primary shadow-md scale-95' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS & SELLER & PURCHASE */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2563EB]/15 text-[#3B82F6] border border-[#2563EB]/30">
                {product.categoryName}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                Stokta Var ({product.stock} Adet)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars with Rounded Value */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground bg-amber-400/10 px-2 py-0.5 rounded text-amber-400">
                {Number(product.rating || 4.8).toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-muted-foreground">({product.reviewCount || 12} Değerlendirme)</span>
            </div>

            {/* Price & Installments Trigger */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsInstallmentModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" /> Taksit Seçenekleri
              </button>
            </div>

            {/* SELLER STORE INFO CARD (TRENDYOL / HEPSİBURADA STYLE) */}
            <div className="p-4 rounded-2xl bg-[#111827] border border-border flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">NovaStore Resmi Mağaza</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                      9.8 Satıcı Puanı
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Sipariş Başarı Oranı: %99 | Hızlı Gönderi</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFollowingStore(!isFollowingStore)}
                className="rounded-xl text-xs font-bold shrink-0"
              >
                {isFollowingStore ? 'Takip Ediliyor ✓' : 'Mağazayı Takip Et'}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* ACTION BUTTONS & QUANTITY */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-input rounded-xl bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="h-10 w-10 rounded-l-xl"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-r-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                variant={isAdded ? 'secondary' : 'primary'}
                className="flex-1 rounded-xl font-bold gap-2 text-base shadow-lg"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" /> Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Sepete Ekle
                  </>
                )}
              </Button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span>Ücretsiz 24 Saatte Kargo</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-xl border border-border">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>2 Yıl Orijinal Garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RICH TABS SECTION: SPECS / REVIEWS / QUESTIONS */}
      <div className="pt-8 border-t border-border space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border ${
              activeTab === 'specs'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Sliders className="w-4 h-4" /> Teknik Özellikler
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border ${
              activeTab === 'reviews'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Değerlendirmeler & Yorumlar ({reviewsList.length})
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border ${
              activeTab === 'qa'
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Soru & Cevap ({qaList.length})
          </button>
        </div>

        {/* TAB 1: TECHNICAL SPECS */}
        {activeTab === 'specs' && (
          <div className="bg-[#111827] border border-border p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-foreground">Ürün Özellikleri & Detaylar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(defaultSpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs md:text-sm">
                  <span className="text-muted-foreground font-medium">{key}</span>
                  <span className="font-bold text-foreground text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="bg-[#111827] border border-border p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-foreground">Değerlendirme Yap</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Puanınız:</span>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current' : 'opacity-30'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                required
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Ürün hakkındaki deneyimlerinizi paylaşın..."
                className="w-full p-4 rounded-xl bg-black/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="md" className="rounded-xl font-bold gap-2">
                <Send className="w-4 h-4" /> Yorumu Gönder
              </Button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-border bg-[#111827] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{rev.user}</span>
                      {rev.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <UserCheck className="w-3 h-3" /> Onaylı Alıcı
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUESTIONS & ANSWERS */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Ask Question Form */}
            <form onSubmit={handleAddQuestion} className="bg-[#111827] border border-border p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-foreground">Satıcıya Soru Sor</h4>
              <textarea
                rows={3}
                required
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Ürünle ilgili merak ettiğiniz soruyu sorun..."
                className="w-full p-4 rounded-xl bg-black/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="md" className="rounded-xl font-bold gap-2">
                <Send className="w-4 h-4" /> Soruyu Gönder
              </Button>
            </form>

            {/* Q&A List */}
            <div className="space-y-4">
              {qaList.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-border bg-[#111827] space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <HelpCircle className="w-4 h-4 text-primary" /> {item.user} sordu:
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <p className="text-sm font-semibold text-foreground pl-5 border-l-2 border-primary">{item.question}</p>

                  {item.answer && (
                    <div className="ml-5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-emerald-400 space-y-1">
                      <span className="font-bold text-white block">NovaStore Yanıtı:</span>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SIMILAR PRODUCTS SECTION */}
      {similarProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-border">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" /> Benzer Ürünler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* INSTALLMENT TABLE MODAL */}
      {isInstallmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsInstallmentModalOpen(false)}>
          <div className="bg-[#111827] border border-[#1F2937] w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Taksit Seçenekleri
              </h3>
              <button onClick={() => setIsInstallmentModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              {product.name} için anlaşmalı banka kartlarına özel taksit simülasyonu:
            </p>

            <div className="space-y-2">
              {installments.map((inst) => (
                <div key={inst.month} className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                  <span className="font-bold text-white">{inst.month} Taksit</span>
                  <span className="text-muted-foreground">{inst.monthly.toLocaleString()} ₺ x {inst.month} ay</span>
                  <span className="font-black text-primary">{inst.total.toLocaleString()} ₺</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
