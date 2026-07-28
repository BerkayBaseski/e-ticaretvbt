import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';
import { ProductCard } from './components/ProductCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { success } = useToast();

  const validWishlist = (wishlist || []).filter((item) => item && item.id && Array.isArray(item.images));

  const handleAddAllToCart = async () => {
    for (const product of validWishlist) {
      await addToCart(product, 1);
    }
    success('Tümü Sepete Eklendi', `${validWishlist.length} ürün başarıyla sepetinize eklendi.`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    success('Favoriler Temizlendi', 'Favori listeniz sıfırlandı.');
  };

  if (validWishlist.length === 0) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <EmptyState
          icon={<Heart className="w-8 h-8 text-rose-500" />}
          title="Favori Listeniz Henüz Boş"
          description="Beğendiğiniz ürünlerin üzerindeki kalp ikonuna tıklayarak favorilerinize ekleyebilir ve daha sonra kolayca erişebilirsiniz."
          actionText="Ürünleri Keşfet"
          onAction={() => navigate('/search')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Favorilerim & Kaydedilenler
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Kaydettiğiniz <span className="font-bold text-white">{validWishlist.length} adet ürün</span> burada listeleniyor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearWishlist}
            className="text-xs gap-1.5 text-rose-400 hover:text-rose-300 border-rose-500/20 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" /> Tümünü Temizle
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddAllToCart}
            className="text-xs gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25"
          >
            <ShoppingBag className="w-4 h-4" /> Tümünü Sepete Ekle
          </Button>
        </div>
      </div>

      {/* Grid of Wishlist Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {validWishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Back link */}
      <div className="pt-6 border-t border-[#1F2937]">
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Alışverişe Devam Et
        </button>
      </div>
    </div>
  );
};
