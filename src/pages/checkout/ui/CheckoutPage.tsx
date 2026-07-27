import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../../entities/cart/model/cartStore';
import { useAuthStore } from '../../../entities/auth/model/authStore';
import { ordersApi } from '../../../shared/api';
import { formatPrice } from '../../../shared/lib/utils';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/ui/Toast';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    addressLine1: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  const [card, setCard] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user ? `${user.firstName} ${user.lastName}`.toUpperCase() : '',
    expiry: '12/28',
    cvv: '•••',
  });

  const shippingCost = cart.totalAmount > 1000 ? 0 : 49;
  const grandTotal = cart.totalAmount + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderPayload = {
        items: cart.items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.images[0],
          quantity: i.quantity,
          unitPrice: i.product.price,
          totalPrice: i.product.price * i.quantity,
        })),
        shippingAddress: {
          ...address,
          country: 'Türkiye',
        },
        paymentDetails: {
          method: 'credit_card',
          cardLastFour: '4242',
          cardHolderName: card.cardHolder,
        },
        subtotal: cart.totalAmount,
        shippingFee: shippingCost,
        discount: 0,
        totalAmount: grandTotal,
      };

      const newOrder = await ordersApi.createOrder(orderPayload);
      clearCart();
      success('Sipariş Alındı!', `Sipariş Numaranız: ${newOrder.orderNumber}`);
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (err: any) {
      toastError('Sipariş Oluşturulamadı', err.message || 'Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-[#1F2937] pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Güvenli Ödeme & Adres</h1>
        <p className="text-xs text-[#CBD5E1] mt-0.5">Teslimat adresinizi ve kart bilgilerinizi giriniz.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-[#1F2937] pb-3">
              1. Teslimat Adresi Bilgileri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ad Soyad"
                required
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              />
              <Input
                label="Telefon"
                required
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Adres Satırı"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                />
              </div>
              <Input
                label="İl"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <Input
                label="İlçe"
                required
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-[#1F2937] pb-3">
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#3B82F6]" /> 2. Ödeme Bilgileri</span>
              <span className="text-[11px] text-[#22C55E] flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit Korumalı</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Kart Numarası"
                  required
                  value={card.cardNumber}
                  onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                />
              </div>
              <Input
                label="Kart Üzerindeki İsim"
                required
                value={card.cardHolder}
                onChange={(e) => setCard({ ...card, cardHolder: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Son Kullanma"
                  required
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                />
                <Input
                  label="CVV"
                  required
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">Sipariş Özeti</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {cart.items.map(({ id, product, quantity }) => (
                <div key={id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 font-medium text-white">{product.name} (x{quantity})</span>
                  <span className="font-bold text-[#3B82F6] shrink-0 ml-2">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1F2937] pt-3 space-y-2 text-xs text-[#CBD5E1]">
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
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#1F2937]">
                <span>Toplam Tutar</span>
                <span className="text-[#3B82F6]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full rounded-xl font-bold gap-2 text-sm shadow-xl"
            >
              <CheckCircle2 className="w-4 h-4" /> Siparişi Onayla ve Öde
            </Button>
            <div className="text-center text-[10px] text-[#CBD5E1] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" /> Güvenli Ödeme Garantisi
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
