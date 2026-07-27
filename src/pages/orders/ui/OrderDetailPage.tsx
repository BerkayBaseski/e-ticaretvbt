import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Truck, Package } from 'lucide-react';
import { ordersApi } from '../../../shared/api';
import { formatPrice } from '../../../shared/lib/utils';
import { Skeleton } from '../../../shared/ui/Skeleton';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: orders } = useQuery({
    queryKey: ['orders-list'],
    queryFn: ordersApi.getOrders,
  });

  const order = orders?.find((o) => o.id === id) || orders?.[0];

  if (!order) {
    return (
      <div className="py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <Link to="/orders" className="text-xs text-[#CBD5E1] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Tüm Siparişler
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sipariş Detayı & Kargo Takibi</h1>
          <p className="text-xs text-[#CBD5E1] mt-0.5">Sipariş No: <span className="font-bold text-white">{order.orderNumber}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-md">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#3B82F6]" /> Canlı Kargo Takip Durumu
            </h3>

            <div className="flex items-center justify-between text-xs pt-2">
              <div className="flex items-center gap-2 text-[#22C55E] font-bold">
                <CheckCircle2 className="w-5 h-5" /> Kargo Yola Çıktı
              </div>
              <span className="text-[#CBD5E1]">Takip No: <span className="font-mono text-white font-bold">{order.trackingNumber || 'TRK-984210492'}</span></span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-md">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#3B82F6]" /> Siparişteki Ürünler
            </h3>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-xs p-3 rounded-xl bg-black/30 border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <img src={item.productImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-black" />
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-[11px] text-[#CBD5E1]">{item.quantity} Adet</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-white">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 space-y-4 shadow-md text-xs text-[#CBD5E1]">
            <h3 className="font-bold text-sm text-white border-b border-[#1F2937] pb-3">Teslimat & Ödeme</h3>
            <div>
              <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.state} / {order.shippingAddress.city}</p>
            </div>
            <div className="border-t border-[#1F2937] pt-3 space-y-1">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="font-bold text-white">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-[#1F2937]">
                <span>Ödenen Tutar</span>
                <span className="text-[#3B82F6]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
