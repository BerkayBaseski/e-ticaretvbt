import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  Truck, 
  CheckCircle2, 
  Ticket 
} from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/utils';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState('');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const FREE_SHIPPING_THRESHOLD = 1000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.subtotal);
  const freeShippingProgress = Math.min(100, (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NOVA100' || code === 'TREND100') {
      setAppliedDiscount(100);
      setAppliedCouponName(code);
      success('Kupon Uygulandı', '100 TL indirim kuponunuz sepete eklendi!');
    } else if (code === 'HEPSI200') {
      setAppliedDiscount(200);
      setAppliedCouponName(code);
      success('Kupon Uygulandı', '200 TL süper indirim kuponunuz sepete eklendi!');
    } else {
      toastError('Geçersiz Kupon', 'Girdiğiniz kupon kodu geçersiz veya süresi dolmuş.');
    }
  };

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

  const finalTotal = Math.max(0, cart.total - appliedDiscount);

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

      {/* FREE SHIPPING PROGRESS BAR */}
      <div className="rounded-2xl border border-primary/30 bg-[#111827] p-4 md:p-5 space-y-2 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-foreground">
            <Truck className="w-4 h-4 text-primary" /> Ücretsiz Kargo Durumu
          </span>
          {remainingForFreeShipping > 0 ? (
            <span className="text-amber-400">
              Sepete <span className="font-extrabold text-white">{formatPrice(remainingForFreeShipping)}</span> daha ekleyin, kargo BEDAVA olsun!
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Tebrikler! Kargo Ücretsiz
            </span>
          )}
        </div>
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const fallbackImg = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border bg-[#111827] shadow-sm transition-all hover:border-primary/40"
              >
                {/* Product Thumbnail */}
                <Link to={`/products/${item.productId}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                  <img src={fallbackImg} alt={item.product?.name || 'Ürün'} className="w-full h-full object-cover" />
                </Link>

                {/* Item Info */}
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                    {item.product?.categoryName || 'Kategori'}
                  </span>
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 hover:underline">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Birim Fiyat: {formatPrice(item.unitPrice, item.product?.currency)}
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
                    <span className="text-sm font-black text-foreground">
                      {formatPrice(item.totalPrice, item.product?.currency)}
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
            );
          })}
        </div>

        {/* SUMMARY & COUPON & CHECKOUT BUTTON */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-[#111827] p-6 space-y-6 shadow-xl">
            <h3 className="font-bold text-lg text-foreground border-b border-border pb-4">Sipariş Özeti</h3>

            {/* COUPON CODE FORM */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-primary" /> İndirim Kuponu
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Örn: NOVA100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-black/50 border border-border rounded-xl text-foreground uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" size="sm" variant="secondary" className="rounded-xl text-xs font-bold">
                  Uygula
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground italic">İpucu: "NOVA100" veya "HEPSI200" kodunu deneyin</p>
            </form>

            <div className="space-y-3 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Ara Toplam</span>
                <span className="font-medium text-foreground">{formatPrice(cart.subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Kargo Ücreti</span>
                <span className="font-medium text-foreground">
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-400 font-bold">Ücretsiz</span>
                  ) : (
                    formatPrice(cart.shipping || 49)
                  )}
                </span>
              </div>

              {(cart.discount > 0 || appliedDiscount > 0) && (
                <div className="flex justify-between text-emerald-400 font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Kupon İndirimi ({appliedCouponName || 'Özel'})
                  </span>
                  <span>-{formatPrice((cart.discount || 0) + appliedDiscount)}</span>
                </div>
              )}

              <div className="border-t border-border pt-4 flex justify-between items-baseline">
                <span className="font-bold text-base text-foreground">Genel Toplam</span>
                <span className="font-black text-2xl text-primary">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full rounded-xl font-bold gap-2 text-base shadow-lg"
            >
              Ödemeye Geç <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Güvenli 256-bit SSL Altyapısı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
