import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Package, ArrowRight, Truck, MapPin } from 'lucide-react';
import { ordersApi } from '../../api';
import { formatPrice, formatDate } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderById(orderId || ''),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-12">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <ErrorState
          title="Sipariş Detayı Bulunamadı"
          message={(error as Error)?.message || 'Belirtilen sipariş kaydı sistemde bulunamadı.'}
        />
        <div className="text-center mt-4">
          <Link to="/">
            <Button variant="outline">Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* SUCCESS CELEBRATION HERO */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Siparişiniz Başarıyla Alındı!
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
          Teşekkür ederiz. Siparişiniz hazırlanmak üzere işleme alınmıştır.{' '}
          <span className="font-bold text-foreground">Sipariş No: {order.orderNumber}</span>
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-xs font-semibold text-foreground shadow-sm">
          <Truck className="w-4 h-4 text-primary" />
           Tahmini Teslimat Tarihi:{' '}
          <span className="text-primary font-bold">{formatDate(order.estimatedDelivery)}</span>
        </div>
      </div>

      {/* ORDER ITEMS & DETAILS */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Sipariş Edilen Ürünler
          </h3>
          <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
        </div>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
              <img src={item.productImage} alt="" className="w-14 h-14 rounded-xl object-cover bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{item.productName}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} Adet x {formatPrice(item.unitPrice)}
                </p>
              </div>
              <span className="text-sm font-extrabold text-foreground">{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        {/* Shipping Address Summary */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 bg-muted/40 p-4 rounded-xl">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-primary" /> Teslimat Adresi
            </h4>
            <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
            <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress.state} / {order.shippingAddress.city} - {order.shippingAddress.zipCode}
            </p>
            <p className="text-muted-foreground">Tel: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-2 bg-muted/40 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-foreground mb-2">Ödeme Özeti</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span>{order.shippingFee === 0 ? 'Ücretsiz' : formatPrice(order.shippingFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>İndirim</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-border/60 pt-2 flex justify-between font-extrabold text-sm text-foreground">
              <span>Toplam Tutar</span>
              <span className="text-primary text-base">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Link to="/orders">
          <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
            <Package className="w-5 h-5" /> Siparişlerim Sayfasına Git
          </Button>
        </Link>
        <Link to="/search">
          <Button size="lg" className="w-full sm:w-auto gap-2">
            Alışverişe Devam Et <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
