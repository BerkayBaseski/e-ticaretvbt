import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingCart, Check, ShieldCheck, Truck, ArrowLeft, Plus, Minus, Tag } from 'lucide-react';
import { productsApi } from '../../api';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';
import { useToast } from '../../components/ui/Toast';
import { ProductCard } from './components/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCartStore();
  const { success } = useToast();

  // Fetch Main Product Detail
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

  // Fetch Similar Products in same category
  const { data: similarProductsData } = useQuery({
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
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link to={`/search?category=${product.categoryId}`} className="hover:text-foreground transition-colors">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* GALLERY SECTION */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isNew && <Badge className="absolute top-4 left-4 z-10">Yeni</Badge>}
            {discountPercent && (
              <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                %{discountPercent} İndirim
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-primary shadow-md scale-95' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS & PURCHASE SECTION */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                {product.categoryName}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Stokta Var ({product.stock} Adet)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount} Değerlendirme)</span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-foreground">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">
              {product.description}
            </p>

            {/* Specs Table */}
            {product.specs && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Öne Çıkan Özellikler</h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-xl">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-semibold text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Sepete Eklendi
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
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span>24 Saatte Kargoda</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>2 Yıl Orijinal Garanti</span>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
};
