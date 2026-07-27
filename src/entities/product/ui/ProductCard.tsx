import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../../shared/types';
import { formatPrice, calculateDiscount } from '../../../shared/lib/utils';
import { useCartStore } from '../../cart/model/cartStore';
import { useWishlistStore } from '../../wishlist/model/wishlistStore';
import { useToast } from '../../../shared/ui/Toast';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success } = useToast();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.price, product.originalPrice);

  const handleNextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
    setIsAdded(true);
    success('Sepete Eklendi', `${product.name} sepetinize eklendi.`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-[20px] border border-[#1F2937] bg-[#111827] text-[#F8FAFC] shadow-lg hover:shadow-2xl hover:border-[#3B82F6]/40 transition-all duration-300 overflow-hidden"
    >
      {/* Image Gallery Slider Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/40">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImgIndex}
              src={product.images[currentImgIndex] || product.images[0]}
              alt={product.name}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </AnimatePresence>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && <Badge className="bg-[#3B82F6] text-white">Yeni</Badge>}
          {discountPercent && <Badge variant="destructive">%{discountPercent} İndirim</Badge>}
        </div>

        {/* Floating Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/40 text-[#CBD5E1] hover:bg-black/70 hover:text-white border border-white/10'
          }`}
          title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Left & Right Slider Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm"
              aria-label="Önceki Fotoğraf"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm"
              aria-label="Sonraki Fotoğraf"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImgIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentImgIndex === idx ? 'bg-[#3B82F6] w-3' : 'bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Button Overlay */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 gap-1.5 rounded-xl text-xs font-semibold shadow-xl"
            >
              <Eye className="w-3.5 h-3.5" /> Hızlı Bakış
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 space-y-2.5">
        {/* Category & Stock */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#3B82F6] uppercase tracking-wider">
            {product.categoryName}
          </span>
          <span className="text-[#22C55E] font-medium flex items-center gap-1">
            Stokta ({product.stock})
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`} className="flex-1">
          <h3 className="text-sm font-semibold text-[#F8FAFC] line-clamp-2 hover:text-[#3B82F6] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-bold text-white">{product.rating}</span>
          </div>
          <span className="text-[#CBD5E1]">({product.reviewCount})</span>
        </div>

        {/* Price & Action */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-[#1F2937]">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-[#F8FAFC]">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#CBD5E1] line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            variant={isAdded ? 'secondary' : 'primary'}
            className="gap-1.5 rounded-xl shrink-0 text-xs font-semibold shadow-md"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Eklendi
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Sepete Ekle
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
