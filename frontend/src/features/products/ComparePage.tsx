import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Check, ShoppingBag } from 'lucide-react';
import { useCompareStore } from '../../stores/compareStore';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart } = useCartStore();
  const { success } = useToast();

  if (compareItems.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="Karşılaştırma Listeniz Boş"
          description="Karşılaştırmak istediğiniz ürünleri ürün kartlarındaki buton ile listenize ekleyebilirsiniz."
          actionText="Ürünleri İncele"
          onAction={() => navigate('/search')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#CBD5E1] mb-1">
            <Link to="/search" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Ürün Kataloğu
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Ürün Karşılaştırma</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Seçilen <span className="font-semibold text-white">{compareItems.length} ürünü</span> teknik özellikleri ve fiyatlarıyla karşılaştırın.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={clearCompare} className="gap-1.5 self-start sm:self-auto">
          <Trash2 className="w-4 h-4 text-rose-500" /> Listeyi Temizle
        </Button>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-5 gap-4">
          {/* First column: Attribute labels */}
          <div className="space-y-6 pt-24 text-xs font-semibold text-[#CBD5E1]">
            <div className="h-12 flex items-center border-b border-[#1F2937]">Fiyat</div>
            <div className="h-12 flex items-center border-b border-[#1F2937]">Kategori</div>
            <div className="h-12 flex items-center border-b border-[#1F2937]">Müşteri Puanı</div>
            <div className="h-12 flex items-center border-b border-[#1F2937]">Stok Durumu</div>
            <div className="h-12 flex items-center border-b border-[#1F2937]">Garanti & Kargo</div>
            <div className="h-16 flex items-center">İşlemler</div>
          </div>

          {/* Product Columns */}
          {compareItems.map((prod) => (
            <div key={prod.id} className="rounded-[20px] border border-[#1F2937] bg-[#111827] p-4 space-y-6 relative shadow-lg">
              <button
                onClick={() => removeFromCompare(prod.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-[#CBD5E1] hover:text-rose-400"
                title="Kaldır"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Product Header */}
              <div className="space-y-2 text-center">
                <img src={prod.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover mx-auto bg-black/40" />
                <h3 className="text-xs font-bold text-white line-clamp-2">{prod.name}</h3>
              </div>

              {/* Price */}
              <div className="h-12 flex items-center justify-center font-black text-sm text-[#3B82F6] border-b border-[#1F2937]">
                {formatPrice(prod.price, prod.currency)}
              </div>

              {/* Category */}
              <div className="h-12 flex items-center justify-center text-xs text-[#CBD5E1] border-b border-[#1F2937]">
                {prod.categoryName}
              </div>

              {/* Rating */}
              <div className="h-12 flex items-center justify-center text-xs font-bold text-amber-400 border-b border-[#1F2937]">
                ★ {prod.rating} ({prod.reviewCount})
              </div>

              {/* Stock */}
              <div className="h-12 flex items-center justify-center text-xs text-[#22C55E] border-b border-[#1F2937]">
                <Check className="w-3.5 h-3.5 mr-1" /> Stokta Var
              </div>

              {/* Shipping */}
              <div className="h-12 flex items-center justify-center text-xs text-[#CBD5E1] border-b border-[#1F2937]">
                Ücretsiz Kargo
              </div>

              {/* Add to Cart */}
              <div className="h-16 flex items-center justify-center">
                <Button
                  size="sm"
                  onClick={() => {
                    addToCart(prod, 1);
                    success('Sepete Eklendi', `${prod.name} sepetinize eklendi.`);
                  }}
                  className="w-full rounded-xl gap-1 text-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Sepete Ekle
                </Button>
              </div>
            </div>
          ))}

          {/* Fill remaining slots if less than 4 */}
          {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-dashed border-[#1F2937] p-4 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
              <Plus className="w-6 h-6 text-[#CBD5E1]" />
              <span className="text-xs text-[#CBD5E1]">Ürün Ekle</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
