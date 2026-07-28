import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingBag, Check, ShieldCheck, Truck, ArrowLeft, Plus, Minus, Tag, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { productsApi } from '../../../shared/api';
import { formatPrice, calculateDiscount } from '../../../shared/lib/utils';
import { useCartStore } from '../../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../../entities/wishlist/model/wishlistStore';
import { useToast } from '../../../shared/ui/Toast';
import { ProductCard } from '../../../entities/product/ui/ProductCard';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { ErrorState } from '../../../shared/ui/ErrorState';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success } = useToast();

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id || ''),
    enabled: !!id,
  });

  const { data: similarProductsData } = useQuery({
    queryKey: ['similar-products', product?.categoryId],
    queryFn: () => productsApi.getProducts({ category: product?.categoryId, size: 4 }),
    enabled: !!product?.categoryId,
  });

  const isFavorite = product ? isInWishlist(product.id) : false;

  const handleNextImage = () => {
    if (!product) return;
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (!product) return;
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    setIsAdded(true);
    success('Sepete Eklendi', `${quantity} adet ${product.name} sepetinize eklendi.`);
    setTimeout(() => setIsAdded(false), 2000);
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
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-12">
        <ErrorState
          title="Ürün Bulunamadı"
          message={(error as Error)?.message || 'Aradığınız ürün mevcut değil veya kaldırılmış olabilir.'}
          onRetry={() => refetch()}
        />
        <div className="text-center mt-4">
          <Link to="/search">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Tüm Ürünlere Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = calculateDiscount(product.price, product.originalPrice);
  const similarProducts = similarProductsData?.content.filter((p) => p.id !== product.id) || [];

  return (
    <div className="space-y-12 pb-12">
      <nav className="flex items-center gap-2 text-xs text-[#CBD5E1]">
        <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link to={`/search?category=${product.categoryId}`} className="hover:text-white transition-colors">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-white font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-[24px] overflow-hidden border border-[#1F2937] bg-[#111827] shadow-xl group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.isNew && <Badge className="absolute top-4 left-4 z-10 bg-[#3B82F6]">Yeni</Badge>}
            {discountPercent && (
              <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                %{discountPercent} İndirim
              </Badge>
            )}

            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-all shadow-lg backdrop-blur-md opacity-80 hover:opacity-100"
                  aria-label="Önceki Fotoğraf"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-all shadow-lg backdrop-blur-md opacity-80 hover:opacity-100"
                  aria-label="Sonraki Fotoğraf"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-[#3B82F6] shadow-lg scale-95' : 'border-[#1F2937] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#3B82F6]/15 text-[#3B82F6]">
                  {product.categoryName}
                </span>
                <span className="text-xs text-[#22C55E] font-medium">
                  Stokta Var ({product.stock} Adet)
                </span>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 rounded-full border transition-all ${
                  isFavorite ? 'bg-rose-500/15 border-rose-500/30 text-rose-500' : 'border-[#1F2937] text-[#CBD5E1] hover:text-white'
                }`}
                title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating}</span>
              <span className="text-xs text-[#CBD5E1]">({product.reviewCount} Değerlendirme)</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-white">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-[#CBD5E1] line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            <p className="text-sm text-[#CBD5E1] leading-relaxed pt-2 border-t border-[#1F2937]">
              {product.description}
            </p>

            {product.specs && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Teknik Özellikler</h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#111827] p-3 rounded-2xl border border-[#1F2937]">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[#CBD5E1] text-[11px]">{key}</span>
                      <span className="font-semibold text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-[#1F2937]">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#1F2937] rounded-2xl bg-[#111827]">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="h-11 w-11 rounded-l-2xl"
                >
                  <Minus className="w-4 h-4 text-white" />
                </Button>
                <span className="w-12 text-center text-sm font-bold text-white">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-11 w-11 rounded-r-2xl"
                >
                  <Plus className="w-4 h-4 text-white" />
                </Button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                variant={isAdded ? 'secondary' : 'primary'}
                className="flex-1 rounded-2xl font-bold gap-2 text-base shadow-lg"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-[#22C55E]" /> Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Sepete Ekle
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>24 Saatte Kargoda</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>2 Yıl Orijinal Garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-[#1F2937]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#3B82F6]" /> Benzer Ürünler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
