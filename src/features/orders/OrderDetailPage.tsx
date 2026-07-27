import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ArrowLeft, Truck, MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ordersApi } from '../../api';
import { formatPrice, formatDate } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => ordersApi.getOrderById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-12">
        <ErrorState
          title="Sipariş Bulunamadı"
          message={(error as Error)?.message || 'Belirtilen sipariş numarası mevcut değil.'}
          onRetry={() => refetch()}
        />
        <div className="text-center mt-4">
          <Link to="/orders">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/orders" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Tüm Siparişler
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            Sipariş #{order.orderNumber}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Sipariş Tarihi: {formatDate(order.createdAt)}</p>
        </div>

        <Badge variant="success" className="text-sm px-3 py-1 self-start sm:self-auto">
          {order.status === 'delivered' ? 'Teslim Edildi' : 'Kargoda / Hazırlanıyor'}
        </Badge>
      </div>

      {/* TRACKING TIMELINE BAR */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" /> Kargo Takip Bilgileri
          </h3>
          {order.trackingNumber && (
            <span className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-foreground">
              Takip No: {order.trackingNumber}
            </span>
          )}
        </div>

        {/* Timeline Status Steps */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-foreground">Sipariş Alındı</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <span className="font-semibold text-foreground">Kargoya Verildi</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              order.status === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-muted-foreground">Teslim Edildi</span>
          </div>
        </div>
      </div>

      {/* ORDER ITEMS LIST */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Package className="w-5 h-5 text-primary" /> Ürün Dökümü
        </h3>

        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
              <img src={item.productImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-muted shrink-0" />
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
      </div>

      {/* ADDRESS & PAYMENT INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-2">
            <MapPin className="w-4 h-4 text-primary" /> Teslimat Adresi
          </h3>
          <p className="text-sm font-semibold text-foreground">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-muted-foreground">{order.shippingAddress.addressLine1}</p>
          <p className="text-xs text-muted-foreground">
            {order.shippingAddress.state} / {order.shippingAddress.city} - {order.shippingAddress.zipCode}
          </p>
          <p className="text-xs text-muted-foreground">Tel: {order.shippingAddress.phone}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-2">
            <CreditCard className="w-4 h-4 text-primary" /> Ödeme & Tutar Detayı
          </h3>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span className="font-medium text-foreground">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo Ücreti</span>
              <span className="font-medium text-foreground">
                {order.shippingFee === 0 ? 'Ücretsiz' : formatPrice(order.shippingFee)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>İndirim</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-extrabold text-sm text-foreground">
              <span>Ödenen Toplam Tutar</span>
              <span className="text-primary text-base">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Kredi Kartı (**** {order.paymentDetails.cardLastFour || '4242'})
          </div>
        </div>
      </div>
    </div>
  );
};
