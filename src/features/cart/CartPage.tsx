import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/utils';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (cart.items.length === 0 && !isLoading) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Sepetiniz Henüz Boş"
          description="Alışveriş sepetinizde henüz hiç ürün bulunmamaktadır. Harika fırsatları keşfetmek için ürünlerimize göz atın."
          actionText="Alışverişe Başla"
          onAction={() => navigate('/search')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Alışveriş Sepetim</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sepetinizde <span className="font-semibold text-foreground">{cart.totalItems} ürün</span> bulunuyor
          </p>
        </div>
        <Link to="/search" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Alışverişe Devam Et
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm transition-all"
            >
              {/* Product Thumbnail */}
              <Link to={`/products/${item.productId}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-muted">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>

              {/* Item Info */}
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
                  {item.product.categoryName}
                </span>
                <Link to={`/products/${item.productId}`}>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1 hover:underline">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Birim Fiyat: {formatPrice(item.unitPrice, item.product.currency)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-input rounded-xl bg-background">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 hover:bg-accent text-muted-foreground rounded-l-xl"
                  aria-label="Adet Azalt"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-accent text-muted-foreground rounded-r-xl"
                  aria-label="Adet Arttır"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total Price & Delete Action */}
              <div className="flex items-center gap-4 shrink-0 sm:ml-2">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-foreground">
                    {formatPrice(item.totalPrice, item.product.currency)}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Ürünü Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY & CHECKOUT BUTTON */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg text-foreground border-b border-border pb-4">Sipariş Özeti</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Ara Toplam</span>
                <span className="font-medium text-foreground">{formatPrice(cart.subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Kargo Ücreti</span>
                <span className="font-medium text-foreground">
                  {cart.shipping === 0 ? <span className="text-emerald-600 font-bold">Ücretsiz</span> : formatPrice(cart.shipping)}
                </span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Özel İndirim
                  </span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}

              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-bold text-base text-foreground">Genel Toplam</span>
                <span className="font-black text-xl text-primary">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full rounded-xl font-bold gap-2 text-base shadow-lg"
            >
              Checkout'a Geç <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Güvenli 256-bit SSL Ödeme Altyapısı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
