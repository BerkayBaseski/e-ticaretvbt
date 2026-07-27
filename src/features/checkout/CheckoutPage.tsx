import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, MapPin, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { ordersApi } from '../../api';
import { formatPrice } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Ad soyad en az 3 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  addressLine1: z.string().min(5, 'Teslimat adresi detaylı girilmelidir'),
  city: z.string().min(2, 'Şehir girilmesi zorunludur'),
  state: z.string().min(2, 'İlçe/Semt girilmesi zorunludur'),
  zipCode: z.string().min(5, 'Posta kodu 5 haneli olmalıdır'),
  cardHolderName: z.string().min(3, 'Kart üzerindeki isim gereklidir'),
  cardNumber: z.string().min(16, 'Kart numarası 16 haneli olmalıdır').max(19),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format MM/YY olmalıdır (ör: 12/28)'),
  cvc: z.string().min(3, 'CVC 3 haneli olmalıdır').max(4),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { error: toastError, success: toastSuccess } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : 'Ahmet Yılmaz',
      phone: user?.phone || '+90 555 123 45 67',
      addressLine1: user?.address?.street || 'Atatürk Cad. No: 42 D: 7',
      city: user?.address?.city || 'İstanbul',
      state: user?.address?.state || 'Kadıköy',
      zipCode: user?.address?.zipCode || '34710',
      cardHolderName: user ? `${user.firstName} ${user.lastName}`.toUpperCase() : 'AHMET YILMAZ',
      cardNumber: '4242 4242 4242 4242',
      expiryDate: '12/28',
      cvc: '123',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const newOrder = await ordersApi.createOrder({
        shippingAddress: {
          fullName: data.fullName,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: 'Türkiye',
          phone: data.phone,
        },
        paymentDetails: {
          method: 'credit_card',
          cardLastFour: data.cardNumber.replace(/\s/g, '').slice(-4),
          cardHolderName: data.cardHolderName,
        },
      });

      clearCart();
      toastSuccess('Siparişiniz Alındı!', 'Ödemeniz başarıyla doğrulandı.');
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (err: any) {
      toastError('Sipariş Hatası', err.message || 'Sipariş oluşturulurken bir problem yaşandı.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Güvenli Checkout & Ödeme</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Lütfen teslimat adresi ve ödeme bilgilerinizi eksiksiz doldurunuz.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMS SECTION */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Section */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="w-5 h-5 text-primary" />
              Teslimat & Adres Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ad Soyad"
                {...register('fullName')}
                error={errors.fullName?.message}
                placeholder="Örn: Ahmet Yılmaz"
              />
              <Input
                label="Telefon Numarası"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+90 5XX XXX XX XX"
              />
            </div>

            <Input
              label="Açık Adres"
              {...register('addressLine1')}
              error={errors.addressLine1?.message}
              placeholder="Mahalle, Cadde, Sokak, Bina No ve Daire No..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="İl (Şehir)" {...register('city')} error={errors.city?.message} placeholder="İstanbul" />
              <Input label="İlçe" {...register('state')} error={errors.state?.message} placeholder="Kadıköy" />
              <Input label="Posta Kodu" {...register('zipCode')} error={errors.zipCode?.message} placeholder="34710" />
            </div>
          </div>

          {/* Payment Card Simulation Section */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Ödeme Bilgileri (Simülasyon)
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Lock className="w-3.5 h-3.5" /> SSL Korumalı
              </div>
            </div>

            <Input
              label="Kart Üzerindeki İsim"
              {...register('cardHolderName')}
              error={errors.cardHolderName?.message}
              placeholder="AHMET YILMAZ"
            />

            <Input
              label="Kart Numarası"
              {...register('cardNumber')}
              error={errors.cardNumber?.message}
              placeholder="4242 4242 4242 4242"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Son Kullanma Tarihi"
                {...register('expiryDate')}
                error={errors.expiryDate?.message}
                placeholder="MM/YY"
              />
              <Input label="CVC / CVV" {...register('cvc')} error={errors.cvc?.message} placeholder="123" />
            </div>
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg text-foreground border-b border-border pb-4">Sipariş Detayı</h3>

            {/* Product items mini list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 border-b border-border pb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.product.name}</p>
                    <p className="text-muted-foreground">{item.quantity} Adet</p>
                  </div>
                  <span className="font-bold text-foreground">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="font-medium text-foreground">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span className="font-medium text-foreground">
                  {cart.shipping === 0 ? <span className="text-emerald-600 font-bold">Ücretsiz</span> : formatPrice(cart.shipping)}
                </span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>İndirim</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between items-baseline text-sm text-foreground">
                <span className="font-bold">Ödenecek Toplam Tutar</span>
                <span className="font-black text-xl text-primary">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full rounded-xl font-bold gap-2 text-base shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" /> Siparişi Tamamla ({formatPrice(cart.total)})
            </Button>

            <div className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Test amaçlı simülasyon ödemesidir
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
