import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../entities/cart/model/cartStore';
import { formatPrice } from '../../../shared/lib/utils';
import { Button } from '../../../shared/ui/Button';
import { EmptyState } from '../../../shared/ui/EmptyState';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();

  if (cart.items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="Alışveriş Sepetiniz Boş"
          description="Henüz sepetinize bir ürün eklemediniz. Katalogdan dilediğiniz ürünleri keşfedebilirsiniz."
          actionText="Ürünleri İncele"
          onAction={() => navigate('/search')}
        />
      </div>
    );
  }

  const shippingCost = cart.totalAmount > 1000 ? 0 : 49;
  const grandTotal = cart.totalAmount + shippingCost;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Alışveriş Sepetim</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Sepetinizde <span className="font-semibold text-white">{cart.totalItems} adet ürün</span> bulunmaktadır.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={clearCart} className="gap-1.5 text-xs">
          <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Sepeti Temizle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(({ id, product, quantity }) => (
            <div
              key={id}
              className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-black/40 shrink-0"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#3B82F6] uppercase">
                    {product.categoryName}
                  </span>
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="text-xs font-bold text-white hover:text-[#3B82F6] transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-extrabold text-[#3B82F6]">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1F2937]">
                <div className="flex items-center border border-[#1F2937] rounded-xl bg-[#050816]">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-2 text-[#CBD5E1] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-2 text-[#CBD5E1] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#CBD5E1]">Toplam</p>
                  <p className="text-sm font-black text-white">
                    {formatPrice(product.price * quantity, product.currency)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-[#CBD5E1] hover:text-rose-500 transition-colors"
                  title="Ürünü Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link to="/search" className="text-xs font-semibold text-[#3B82F6] hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Alışverişe Devam Et
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">Sipariş Özeti</h3>

            <div className="space-y-2 text-xs text-[#CBD5E1]">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="font-semibold text-white">{formatPrice(cart.totalAmount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Kargo Ücreti</span>
                <span className="font-semibold text-white">
                  {shippingCost === 0 ? <span className="text-[#22C55E]">Ücretsiz</span> : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#1F2937] pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Genel Toplam</span>
              <span className="text-xl font-black text-[#3B82F6]">{formatPrice(grandTotal)}</span>
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full rounded-xl font-bold gap-2 text-sm shadow-xl"
            >
              Ödemeye Geç <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
