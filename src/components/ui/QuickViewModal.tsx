import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '../../api/types';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useToast } from './Toast';
import { Button } from './Button';
import { Badge } from './Badge';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success } = useToast();

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.price, product.originalPrice);

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setIsAdded(true);
    success('Sepete Eklendi', `${quantity} adet ${product.name} sepetinize eklendi.`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#111827] border border-[#1F2937] text-[#F8FAFC] shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-[#CBD5E1] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-[#1F2937]">
                <img
                  src={product.images[selectedImg] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && <Badge className="absolute top-3 left-3 z-10">Yeni</Badge>}
                {discountPercent && (
                  <Badge variant="destructive" className="absolute top-3 right-3 z-10">
                    %{discountPercent} İndirim
                  </Badge>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImg === i ? 'border-[#2563EB]' : 'border-[#1F2937] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#2563EB]/15 text-[#3B82F6]">
                    {product.categoryName}
                  </span>
                  <span className="text-xs text-[#22C55E] font-medium">Stokta Var</span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#F8FAFC]">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-bold text-white">{product.rating}</span>
                  </div>
                  <span className="text-xs text-[#CBD5E1]">({product.reviewCount} inceleme)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-2xl font-black text-[#F8FAFC]">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#CBD5E1] line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Specs */}
                {product.specs && (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-3 rounded-xl border border-[#1F2937]">
                    {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <span className="text-[#CBD5E1] text-[11px]">{k}</span>
                        <span className="font-medium text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4 border-t border-[#1F2937]">
                <div className="flex items-center gap-3">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    variant={isAdded ? 'secondary' : 'primary'}
                    className="flex-1 rounded-xl font-bold gap-2 text-sm shadow-lg"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#22C55E]" /> Eklendi
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Sepete Ekle
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleWishlist(product)}
                    className={`h-12 w-12 rounded-xl border-[#1F2937] ${
                      isFavorite ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'text-[#CBD5E1]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#CBD5E1]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#2563EB]" /> Ücretsiz Hızlı Kargo
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" /> 2 Yıl Orijinal Garanti
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
