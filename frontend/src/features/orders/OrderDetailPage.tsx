import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  FileText, 
  RotateCcw, 
  X, 
  Box
} from 'lucide-react';
import { ordersApi } from '../../api';
import { formatPrice, formatDate } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { success, info } = useToast();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Beden / Boyut Uymadı');
  const [returnNote, setReturnNote] = useState('');

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

  const handleDownloadInvoice = () => {
    info('E-Fatura Hazırlanıyor', 'E-Faturanız yeni sekmede PDF olarak açılıyor...');
    window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReturnModalOpen(false);
    success('İade Kodu Oluşturuldu', `İade kodunuz: IADE-${Math.floor(100000 + Math.random() * 900000)}. Kargo şubesine bu kod ile ücretsiz teslim edebilirsiniz.`);
  };

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

  // 4-Step Cargo Progress Status
  const isShippedOrDelivered = order.status === 'shipped' || order.status === 'delivered';
  const isDelivered = order.status === 'delivered';

  const orderSteps = [
    { label: 'Sipariş Alındı', done: true, time: formatDate(order.createdAt) },
    { label: 'Hazırlanıyor', done: true, time: 'Depoda Ambalajlandı' },
    { label: 'Kargoya Verildi', done: isShippedOrDelivered, time: 'Yurtiçi Kargo: YTK849204' },
    { label: 'Teslim Edildi', done: isDelivered, time: isDelivered ? 'Teslimat Tamamlandı' : 'Tahmini: Yarın' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/orders" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Tüm Siparişler
            </Link>
            <span>/</span>
            <span className="font-mono text-foreground font-semibold">#{order.orderNumber}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Sipariş Detayı</h1>
        </div>

        {/* Action Buttons: E-Invoice & Return Request */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadInvoice}
            className="rounded-xl text-xs font-bold gap-1.5"
          >
            <FileText className="w-4 h-4 text-primary" /> E-Fatura Görüntüle
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReturnModalOpen(true)}
            className="rounded-xl text-xs font-bold gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> İade Talebi Oluştur
          </Button>
        </div>
      </div>

      {/* LIVE CARGO PROGRESS TRACKING STEPPER */}
      <div className="bg-[#111827] border border-border p-6 rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" /> Kargo & Teslimat Süreci
          </h3>
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
            Takip Kodu: YTK849204
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative pt-2">
          {orderSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2 relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                step.done 
                  ? 'bg-primary text-white shadow-lg shadow-blue-600/30 ring-4 ring-primary/20' 
                  : 'bg-black/60 text-muted-foreground border border-white/10'
              }`}>
                {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className="text-xs font-bold text-foreground">{step.label}</span>
              <span className="text-[10px] text-muted-foreground">{step.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN ORDER CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ORDER ITEMS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Box className="w-4 h-4 text-primary" /> Sipariş İçeriği ({order.items.length} Kalem)
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => {
              const fallbackImg = item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-[#111827]">
                  <Link to={`/products/${item.productId}`} className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0">
                    <img src={fallbackImg} alt="" className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`}>
                      <h4 className="text-xs font-bold text-foreground truncate hover:underline">{item.productName}</h4>
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Adet: {item.quantity} | Birim: {formatPrice(item.unitPrice)}</p>
                  </div>

                  <span className="text-xs font-extrabold text-foreground">{formatPrice(item.totalPrice)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELIVERY ADDRESS & PAYMENT SUMMARY */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-[#111827] space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Teslimat Adresi
            </h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.state} / {order.shippingAddress.city} - {order.shippingAddress.zipCode}</p>
              <p className="pt-1 text-foreground font-semibold">Tel: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-[#111827] space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Ödeme Özeti
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Ara Toplam</span>
                <span className="font-medium text-foreground">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Kargo Ücreti</span>
                <span className="font-medium text-foreground">{order.shippingFee === 0 ? 'Ücretsiz' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline font-bold text-sm">
                <span className="text-foreground">Ödenen Toplam</span>
                <span className="text-primary font-black text-lg">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RETURN REQUEST MODAL */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsReturnModalOpen(false)}>
          <form onSubmit={handleCreateReturn} className="bg-[#111827] border border-[#1F2937] w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-primary" /> İade Talebi Oluştur
              </h3>
              <button type="button" onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">İade Nedeni</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/50 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Beden / Boyut Uymadı">Beden / Boyut Uymadı</option>
                <option value="Ürün Hasarlı veya Kusurlu Geldi">Ürün Hasarlı veya Kusurlu Geldi</option>
                <option value="Farklı Ürün Gönderildi">Farklı Ürün Gönderildi</option>
                <option value="Fikir Değişikliği / Vazgeçtim">Fikir Değişikliği / Vazgeçtim</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Açıklama (Opsiyonel)</label>
              <textarea
                rows={3}
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="İade gerekçenizi kısaca açıklayın..."
                className="w-full p-3 rounded-xl bg-black/50 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button type="submit" size="md" className="w-full rounded-xl font-bold gap-2">
              İade Kodunu Oluştur (Ücretsiz Kargo)
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
